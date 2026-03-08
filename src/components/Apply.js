import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Check, RotateCcw, List, Clock, Sparkles, Square, AlertTriangle } from "lucide-react";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
}

function ConfettiBurst() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const duration = 1.5 + Math.random() * 1.5;
        const size = 4 + Math.random() * 6;
        const colors = ["#60a5fa", "#34d399", "#818cf8", "#f472b6"];
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{
              left: `${left}%`,
              top: "-10px",
              width: `${size}px`,
              height: `${size * 0.6}px`,
              backgroundColor: color,
              opacity: 0.8,
              animation: `confetti-fall ${duration}s ease-in ${delay}s forwards`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function Apply() {
  const [profile, setProfile] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phase, setPhase] = useState("form"); // "form" | "initializing" | "progress" | "complete" | "stopped"
  const [progress, setProgress] = useState(0);
  const [statusMessages, setStatusMessages] = useState([]);
  const [appliedCount, setAppliedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState(null);
  const [isStopping, setIsStopping] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);

  const timerRef = useRef(null);
  const statusContainerRef = useRef(null);
  const eventSourceRef = useRef(null);
  const sessionIdRef = useRef(null);

  const addStatus = useCallback((text) => {
    setStatusMessages((prev) => [...prev, { text, timestamp: Date.now() }]);
  }, []);

  // Auto-scroll status messages
  useEffect(() => {
    if (statusContainerRef.current) {
      statusContainerRef.current.scrollTop = statusContainerRef.current.scrollHeight;
    }
  }, [statusMessages]);

  // Elapsed time counter
  useEffect(() => {
    if (phase === "progress" || phase === "initializing") {
      timerRef.current = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Warn before leaving during progress
  useEffect(() => {
    const handler = (e) => {
      if (phase === "progress" || phase === "initializing" || isStopping) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [phase, isStopping]);

  const cleanupAutomation = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!profile.trim()) {
      setError("Enter a role");
      return;
    }
    if (!coverLetter.trim()) {
      setError("Enter a cover letter");
      return;
    }
    if (coverLetter.length > 500) {
      setError("Cover letter must be under 500 chars");
      return;
    }

    // Phase 1: Initializing
    setPhase("initializing");
    setElapsedTime(0);
    setStatusMessages([]);
    setProgress(0);
    setAppliedCount(0);
    setTotalCount(0);
    setIsStopping(false);

    addStatus("Initializing automation...");

    // Transition to progress after 2.5s
    setTimeout(async () => {
      setPhase("progress");
      addStatus("Automation started");
      addStatus("Connecting to server...");
      setProgress(5);

      try {
        // Step 1: Start the automation process with POST
        const initResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/apply-internships`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profile: profile.trim(), cover: coverLetter.trim() }),
        });

        if (!initResponse.ok) {
          const errorData = await initResponse.json();
          setError(errorData.message || "Failed to start automation");
          addStatus("Error: " + (errorData.message || "Failed to start automation"));
          setPhase("form");
          return;
        }

        const initData = await initResponse.json();
        const sessionId = initData.session_id;
        sessionIdRef.current = sessionId;

        addStatus("Session started, monitoring progress...");
        setProgress(10);

        // Step 2: Connect to EventSource for real-time progress
        const eventSource = new EventSource(
          `${process.env.REACT_APP_BACKEND_URL}/api/apply-internships-stream?session=${sessionId}`
        );
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("Progress update:", data);

          // Update progress bar
          if (data.progress !== undefined) {
            setProgress(data.progress);
          }

          // Update counts
          if (data.applied !== undefined) {
            setAppliedCount(data.applied);
          }
          if (data.total !== undefined) {
            setTotalCount(data.total);
          }

          // Add status message
          if (data.status) {
            addStatus(data.status);
          }

          // Handle completion
          if (data.complete) {
            setProgress(100);
            addStatus(`Complete — applied to ${data.applied} internships`);
            setPhase("complete");
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            eventSource.close();
          }
        };

        eventSource.onerror = (error) => {
          console.error("EventSource error:", error);
          eventSource.close();
          
          // Only show error if not already complete
          if (phase !== "complete") {
            setError("Connection lost. The process may still be running.");
            addStatus("Error: Connection lost");
            setPhase("form");
          }
        };

      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to connect to the server.");
        addStatus("Error: Failed to connect to the server.");
        setPhase("form");
      }
    }, 2500);
  };

  const handleStop = async () => {
    setShowStopDialog(false);
    setIsStopping(true);

    // Immediately clean up EventSource
    cleanupAutomation();

    // Attempt to notify backend
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/stop-automation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionIdRef.current }),
      });
    } catch (err) {
      console.error("Failed to notify backend:", err);
      setError("Could not reach server, but automation was stopped locally");
    }

    addStatus("Automation stopped by user");
    setPhase("stopped");
    setIsStopping(false);
  };

  const handleReset = () => {
    cleanupAutomation();
    setPhase("form");
    setProfile("");
    setCoverLetter("");
    setProgress(0);
    setStatusMessages([]);
    setAppliedCount(0);
    setTotalCount(0);
    setElapsedTime(0);
    setShowConfetti(false);
    setError(null);
    setIsStopping(false);
    sessionIdRef.current = null;
  };

  // ─── Form Screen ──────────────────────────────────────────
  if (phase === "form" || phase === "initializing") {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl items-start px-6 pt-24 md:pt-32">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-bold tracking-tight">New application run</h1>
          <p className="mt-1.5 text-[14px] text-gray-600">
            Enter the role and a cover letter. We'll apply to every match on Internshala.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <label htmlFor="profile" className="mb-1.5 block text-[13px] font-medium">
                Internship role
              </label>
              <input
                id="profile"
                type="text"
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                placeholder='e.g. "Frontend Developer"'
                className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                disabled={phase === "initializing"}
                required
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label htmlFor="coverLetter" className="text-[13px] font-medium">
                  Cover letter
                </label>
                <span className="font-mono text-[12px] text-gray-500">
                  {coverLetter.length}/500
                </span>
              </div>
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write your cover letter here..."
                rows={7}
                maxLength={500}
                disabled={phase === "initializing"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-blue-400 text-blue-100 font-medium rounded-md hover:bg-blue-500 hover:text-blue-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={phase === "initializing"}
            >
              {phase === "initializing" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  Start automation <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {phase === "initializing" && (
            <div className="mt-6 animate-fade-in rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2 text-[13px] text-gray-600">
                <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
                Initializing automation...
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Progress / Complete / Stopped Screen ───────────────────────────
  const isStopped = phase === "stopped";
  const isComplete = phase === "complete";
  const isRunning = phase === "progress";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl items-start px-6 pt-24 md:pt-32 pb-20">
      <div className="w-full max-w-2xl">
        {showConfetti && <ConfettiBurst />}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isComplete ? "Run complete" : isStopped ? "Automation stopped" : "Automation running"}
            </h1>
            <p className="mt-1 text-[14px] text-gray-600">
              {isComplete
                ? `Applied to ${totalCount} ${profile} internships`
                : isStopped
                  ? `Stopped after ${appliedCount} of ${totalCount} applications`
                  : `Applying to ${profile} internships on Internshala`}
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-[13px] font-mono text-gray-600">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(elapsedTime)}
          </div>
        </div>

        {/* Stopped warning badge */}
        {isStopped && (
          <div className="mt-4 animate-fade-in inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-yellow-500/40 bg-yellow-500/10 text-yellow-700 text-[13px]">
            <AlertTriangle className="h-3.5 w-3.5" />
            Automation stopped at {progress}% — {appliedCount} of {totalCount} applications submitted
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-8">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[32px] font-bold tracking-tight font-mono">
              {progress}%
            </span>
            {totalCount > 0 && (
              <span className="text-[13px] text-gray-600">
                {appliedCount} of {totalCount} applications
              </span>
            )}
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: isComplete ? "#60a5fa" : isStopped ? "#ef4444" : "#1f2937",
              }}
            />
            {isRunning && progress < 100 && (
              <div
                className="absolute top-0 h-full w-24 animate-pulse rounded-full opacity-30 bg-gray-800"
                style={{
                  left: `calc(${progress}% - 3rem)`,
                  filter: "blur(8px)",
                }}
              />
            )}
          </div>
        </div>

        {/* Stop button */}
        {isRunning && (
          <div className="mt-4">
            <button
              onClick={() => setShowStopDialog(true)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isStopping}
            >
              {isStopping ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Stopping...
                </>
              ) : (
                <>
                  <Square className="mr-2 h-3.5 w-3.5 fill-current" />
                  Stop Automation
                </>
              )}
            </button>
          </div>
        )}

        {/* Stop Confirmation Dialog */}
        {showStopDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-lg font-semibold mb-2">Stop automation?</h2>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to stop? Progress will be saved. You've applied to {appliedCount} of {totalCount} internships so far.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowStopDialog(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Continue running
                </button>
                <button
                  onClick={handleStop}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Stop automation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status feed */}
        <div className="mt-8">
          <p className="mb-3 text-[12px] font-medium uppercase tracking-widest text-gray-500">
            Activity
          </p>
          <div
            ref={statusContainerRef}
            className="max-h-[260px] space-y-0.5 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1"
          >
            {statusMessages.map((msg, i) => (
              <div
                key={i}
                className="flex items-start gap-3 animate-fade-in rounded-md px-3 py-2 text-[13px]"
              >
                <span className="mt-0.5 font-mono text-[11px] text-gray-400 shrink-0">
                  {formatTime(Math.floor((msg.timestamp - (statusMessages[0]?.timestamp ?? msg.timestamp)) / 1000))}
                </span>
                <span className={
                  msg.text === "Automation stopped by user"
                    ? "text-red-600"
                    : i === statusMessages.length - 1 && isRunning
                      ? "text-gray-800"
                      : "text-gray-600"
                }>
                  {msg.text}
                </span>
                {i === statusMessages.length - 1 && isRunning && (
                  <Loader2 className="ml-auto h-3.5 w-3.5 shrink-0 animate-spin text-gray-400" />
                )}
                {i === statusMessages.length - 1 && isComplete && (
                  <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-blue-500" />
                )}
                {i === statusMessages.length - 1 && isStopped && (
                  <Square className="ml-auto h-3.5 w-3.5 shrink-0 text-red-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Completion stats & actions */}
        {isComplete && (
          <div className="mt-8 animate-fade-in">
            <div className="mb-6 grid grid-cols-3 gap-3">
              {[
                { label: "Applied", value: totalCount, icon: Check },
                { label: "Time", value: formatTime(elapsedTime), icon: Clock },
                { label: "Role", value: profile, icon: Sparkles },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4">
                  <stat.icon className="mb-2 h-4 w-4 text-gray-400" />
                  <p className="text-[18px] font-semibold tracking-tight truncate">
                    {stat.value}
                  </p>
                  <p className="text-[12px] text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 bg-blue-400 text-blue-100 font-medium rounded-md hover:bg-blue-500 hover:text-blue-100 transition-colors duration-200"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Apply to more roles
              </button>
              <Link to="/applications">
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors">
                  <List className="mr-2 h-4 w-4" />
                  View all applications
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Stopped actions */}
        {isStopped && (
          <div className="mt-8 animate-fade-in">
            <div className="mb-6 grid grid-cols-3 gap-3">
              {[
                { label: "Applied", value: `${appliedCount}/${totalCount}`, icon: Check },
                { label: "Time", value: formatTime(elapsedTime), icon: Clock },
                { label: "Role", value: profile, icon: Sparkles },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-4">
                  <stat.icon className="mb-2 h-4 w-4 text-gray-400" />
                  <p className="text-[18px] font-semibold tracking-tight truncate">
                    {stat.value}
                  </p>
                  <p className="text-[12px] text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 bg-blue-400 text-blue-100 font-medium rounded-md hover:bg-blue-500 hover:text-blue-100 transition-colors duration-200"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Start new run
              </button>
              <Link to="/applications">
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors">
                  <List className="mr-2 h-4 w-4" />
                  View applications
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
