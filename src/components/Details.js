import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Details() {
  const [profile, setProfile] = useState("");
  const [cover, setCover] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const location = useLocation();
  const { name } = location.state || {};

  function handleProfileInput(e) {
    setProfile(e.target.value);
  }

  function handleCoverInput(e) {
    setCover(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/apply-internships",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ profile: profile, cover: cover }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("Applied Successfully");

        navigate("/submitted-applications");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <span className="text-3xl font-medium p-4 text-stone-500">
        Hey, {name}!🤚
      </span>
      <div className="text-sm p-4 m-5 bg-gray-100">
        <p className="text-lg text-stone-400 px-5 inline-block">
          {/* <i>Instructions:</i> */}
          Instruction:
        </p>
        <p className="text-lg text-stone-500">
          <i>
            ~ Enter the exact profile name as shown in the Internshala app for
            the internship you are applying for. ~
          </i>
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[80vw] max-w-lg  py-5 px-8 gap-3 border rounded-r-md"
      >
        <h1 className="text-2xl mt-5 mb-5 text-stone-500">Enter details</h1>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        <div className="flex flex-col">
          <label className="text-md text-stone-500">
            Enter the profile you are looking internship for?
          </label>
          <input
            type="text"
            value={profile}
            maxLength={40}
            onChange={handleProfileInput}
            className="outline-none p-2 border"
            placeholder="Enter profile..."
            disabled={loading}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-md text-stone-500">
            Enter a great cover letter to get you hired
          </label>
          <textarea
            value={cover}
            maxLength={500}
            onChange={handleCoverInput}
            className="outline-none p-2 border resize-none max-h-60 overflow-y-auto w-full"
            rows="5"
            placeholder="Write your cover letter here..."
            disabled={loading}
            required
          ></textarea>
        </div>
        <button
          className="p-2 hover:bg-blue-500 bg-blue-400 my-2 mb-10 text-blue-100 font-medium flex items-center justify-center hover:text-blue-100 transition-colors duration-200"
          disabled={loading}
        >
          {/* {loading ? "Submitting..." : "Submit"} */}
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="4"
                  strokeDasharray="31.4"
                  strokeDashoffset="15.7"
                ></circle>
              </svg>
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
}
