import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SubmittedApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:5000/api/submitted-applications"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchApplications();
  }, []);

  function handleGoBack(e) {
    e.preventDefault();

    navigate("/details");
  }

  return (
    <>
      <div
        className="text-2xl font-thin text-stone-400 px-10 py-3 hover:text-stone-500"
        onClick={handleGoBack}
      >
        <i class="ri-arrow-left-circle-line"></i>
        <span className="hover:underline cursor-pointer font-medium text-lg">
          Back
        </span>
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        <h2 className="text-4xl text-stone-500 font-medium p-2 my-6 md:p-2 md:my-4">
          ✅ Submitted Applications
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        <table border="1" className="w-full max-w-6xl mx-auto p-4">
          <thead className="px-4 py-4 bg-stone-100 text-stone-400 sticky top-0">
            <tr>
              <th className="px-2 py-6">COMPANY</th>
              <th className="px-2 py-6">PROFILE</th>
              <th className="px-2 py-6">APPLIED ON</th>
              <th className="px-2 py-6">APPLICATION STATUS</th>
            </tr>
          </thead>
          <tbody className="overflow-scroll">
            {applications.length > 0 ? (
              applications.map((app, index) => (
                <tr key={index} className="text-stone-600">
                  <td className="px-4 py-4 text-lg text-wrap font-medium">
                    {app.company}
                  </td>
                  <td className="px-4 py-4 text-lg text-center">
                    {app.title} Internship
                  </td>
                  <td className="px-4 py-4 text-lg text-center">
                    {new Date().toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-10 py-4 text-lg text-center font-medium">
                    ⭐Applied
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-2xl text-stone-500  font-medium p-2 my-6 md:p-2 md:my-4"
                >
                  😟 No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
