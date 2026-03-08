import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Login({ setUserLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: username.trim(), password: password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", "fake-jwt-token");
        setUserLoggedIn(true);
        navigate("/apply", { state: { name: username, password } });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl items-start px-6 pt-24 md:pt-32">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold tracking-tight">Log in</h1>
        <p className="mt-1.5 text-[14px] text-gray-600">
          Welcome back. Enter your credentials below.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label htmlFor="username" className="mb-1.5 block text-[13px] font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your username"
              className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-blue-400 text-blue-100 font-medium rounded-md hover:bg-blue-500 hover:text-blue-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing in..." : (
              <>
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </>
            )}
          </button>
        </form>
        <p className="mt-6 text-[13px] text-gray-600">
          No account?{" "}
          <Link to="/register" className="font-medium text-gray-800 underline decoration-gray-400 underline-offset-4 hover:decoration-gray-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
