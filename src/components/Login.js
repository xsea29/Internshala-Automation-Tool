import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUserLoggedIn }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: name, password: password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", "fake-jwt-token");
        setUserLoggedIn(true);
        navigate("/details", { state: { name, password } });
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center md:flex md:flex-col md:items-center">
      <h1 className="md:text-5xl text-4xl p-10 text-center">
        <span className="text-stone-500  font-medium">Login to </span>
        <span className="text-blue-500 font-medium md:font-medium">
          Internshala Automation
        </span>
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-[80vw] py-5 px-8 max-w-md flex flex-col item-center md:flex md:flex-col gap-5 border rounded-r-md rounded-md"
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
            placeholder="Enter name..."
            required
          />
        </div>
        <button className="p-2 bg-blue-400 text-blue-100 font-medium hover:bg-blue-500 hover:text-blue-100 transition-colors duration-200">
          Login
        </button>

        <a
          href="/register"
          className="text-sm text-stone-500 text-right hover:text-blue-500 hover:underline"
        >
          New user? Register here!
        </a>
      </form>
    </div>
  );
}
