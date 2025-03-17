import { useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

export default function Navbar({ userLoggedIn, setUserLoggedIn }) {
  const navigate = useNavigate();

  function handleClick() {
    navigate("/homepage");
    setUserLoggedIn(false);
  }

  async function handleLoggout(e) {
    e.stopPropagation();
    try {
      const response = await fetch("http://127.0.0.1:5000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        // Clear any stored auth tokens
        localStorage.removeItem("token");
        sessionStorage.clear();

        setUserLoggedIn(false);
        // navigate("/login");
        setTimeout(() => {
          navigate("/login");
        }, 100);
      } else {
        console.error("Logout failed:", await response.json());
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <div
      className="w-full text-[20px] py-4 px-10 text-stong-400 sm:flex sm:items-center sm:justify-between font-semibold border-b-2 border-b-gray-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="sm:flex sm:items-center">
        <img src={logo} className="sm:w-[150px]" alt="internshala"></img>
        <span className="sm:mx-5 pt-5">
          <span className="text-blue-400 font-bold text-2xl md:text-xl">
            AUTO
          </span>
          <span className="text-gray-500 font-bold text-2xl md:text-xl">
            MATION
          </span>
        </span>
      </div>
      {userLoggedIn && (
        <div className="relative group">
          <button
            onClick={handleLoggout}
            className="text-2xl font-thin text-blue-500 outline-none"
          >
            <i class="ri-logout-box-line"></i>
          </button>

          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-max px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out transform scale-95 group-hover:scale-100">
            Logout
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
}
