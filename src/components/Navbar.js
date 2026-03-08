import { Link, useNavigate } from "react-router-dom";
import { LogOut, Terminal } from "lucide-react";

export default function Navbar({ userLoggedIn, setUserLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        localStorage.removeItem("token");
        sessionStorage.clear();
        setUserLoggedIn(false);
        navigate("/");
      } else {
        console.error("Logout failed:", await response.json());
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-gray-800">
          <Terminal className="h-4 w-4" />
          internbot
        </Link>

        <div className="flex items-center gap-1">
          {userLoggedIn ? (
            <>
              <Link to="/apply">
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  Apply
                </button>
              </Link>
              <Link to="/applications">
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  History
                </button>
              </Link>
              <div className="ml-2 h-5 w-px bg-gray-200" />
              <button 
                onClick={handleLogout} 
                className="ml-1 h-8 w-8 inline-flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                  Log in
                </button>
              </Link>
              <Link to="/register">
                <button className="px-3 py-1.5 text-sm font-medium bg-blue-400 text-blue-100 hover:bg-blue-500 hover:text-blue-100 rounded-md transition-colors duration-200">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
