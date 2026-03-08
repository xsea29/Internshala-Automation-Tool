import { useEffect, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft, Inbox } from "lucide-react";

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/submitted-applications`);
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await response.json();
        setApps(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "applied";
    if (statusLower === "submitted" || statusLower === "applied") {
      return "bg-blue-100 text-blue-700 border border-blue-200";
    } else if (statusLower === "failed") {
      return "bg-red-100 text-red-700 border border-red-200";
    }
    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  return (
    <div className="mx-auto max-w-5xl px-6 pt-12 pb-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
          <p className="mt-1 text-[13px] text-gray-600 font-mono">
            {apps.length} record{apps.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link to="/apply">
          <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> New run
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <p className="text-[14px] text-red-700 font-medium">{error}</p>
          <p className="mt-1 text-[13px] text-gray-600">Is your Flask backend running on localhost:5000?</p>
        </div>
      ) : apps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Inbox className="mb-3 h-8 w-8 text-gray-300" />
          <p className="text-[15px] font-medium">No applications yet</p>
          <p className="mt-1 text-[13px] text-gray-600">Run your first automation to see results here.</p>
          <Link to="/apply">
            <button className="mt-5 px-4 py-2 bg-blue-400 text-blue-100 font-medium rounded-md hover:bg-blue-500 hover:text-blue-100 transition-colors duration-200">
              Start applying
            </button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-px bg-gray-200 text-[13px]">
            {/* Header */}
            <div className="bg-gray-50 px-4 py-2.5 font-medium text-gray-600">Company</div>
            <div className="bg-gray-50 px-4 py-2.5 font-medium text-gray-600">Profile</div>
            <div className="bg-gray-50 px-4 py-2.5 font-medium text-gray-600">Date</div>
            <div className="bg-gray-50 px-4 py-2.5 font-medium text-gray-600">Status</div>
            {/* Rows */}
            {apps.map((app, i) => (
              <React.Fragment key={i}>
                <div className="bg-white px-4 py-3 font-medium">{app.company}</div>
                <div className="bg-white px-4 py-3 text-gray-600">{app.title || app.profile}</div>
                <div className="bg-white px-4 py-3 text-gray-600 font-mono">{new Date().toLocaleDateString("en-GB")}</div>
                <div className="bg-white px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${getStatusBadge("Applied")}`}>
                    Applied
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
