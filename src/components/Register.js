import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null); // Clear any existing error before making the request

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: name, password: password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", "fake-jwt-token");
        navigate("/login");
      } else {
        setError(data.message); // If registration fails, display message from API
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  }

  return (
    <div className="w-full h-screen sm:flex sm:flex-col sm:items-center">
      <h1 className="sm:text-5xl text-3xl p-10">
        <span className="text-stone-500 font-medium">Register to </span>
        <span className="text-blue-500 font-medium">
          Internshala Automation
        </span>
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-[80vw] py-5 px-8 max-w-md sm:flex sm:flex-col gap-5 rounded border"
      >
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-col">
          <label className="text-sm text-blue-400">Name</label>
          <input
            className="outline-none p-2 border"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name..."
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-blue-400">Password</label>
          <input
            className="outline-none p-2 border"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password..."
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-blue-400">Confirm Password</label>
          <input
            className="outline-none p-2 border"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password..."
            required
          />
        </div>

        <button className="p-2 bg-blue-400 text-blue-100 font-medium hover:bg-blue-500 hover:text-blue-100 transition-colors duration-200">
          Register
        </button>

        <a
          href="/login"
          class="text-sm text-stone-500 text-right hover:text-blue-500 hover:underline"
        >
          Already registered? Login
        </a>
      </form>
    </div>
  );
}
