import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { Menu, X } from "lucide-react";

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-xl">

      <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">

        
        <h1
          onClick={() => navigate("/")}
          className="text-3xl font-bold cursor-pointer hover:text-yellow-400 transition-transform transform hover:scale-105"
        >
          🎬 Movie App
        </h1>

        {onSearch && (
          <div className="relative w-full md:w-96 mx-auto mt-3 md:mt-0 hidden md:block">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-full text-white bg-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 shadow-md transition"
            />
            {searchText && (
              <button
                onClick={() => {
                  setSearchText("");
                  onSearch("");
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 font-bold transition"
              >
                ×
              </button>
            )}
          </div>
        )}

  
        <div className="hidden md:flex flex-wrap gap-3 items-center mt-3 md:mt-0">
          <Link
            to="/popular"
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold shadow-md transition transform hover:scale-105"
          >
            🔥 Popular
          </Link>

          <Link
            to="/multfilms"
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold shadow-md transition transform hover:scale-105"
          >
            🎞 Cartoons
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <div
                onClick={() => navigate("/profileee")}
                className="w-12 h-12 rounded-full overflow-hidden cursor-pointer border-2 border-yellow-400 hover:scale-110 transition-transform"
              >
                <img
                  src={
                    user.profileImage ||
                    localStorage.getItem("profileAvatar") ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold shadow-md transition transform hover:scale-105"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md transition transform hover:scale-105"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden absolute right-4 top-4 text-white"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X size={30} /> : <Menu size={30} />}
        </button>

        {onSearch && mobileMenu && (
          <div className="relative w-full px-2 mt-2 md:hidden">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full px-4 py-2 rounded-full text-white bg-gray-800 outline-none focus:ring-2 focus:ring-yellow-400 shadow-md transition"
            />
          </div>
        )}

        {mobileMenu && (
          <div className="md:hidden flex flex-col items-start w-full px-2 gap-3 mt-4">
            <Link
              to="/popular"
              onClick={() => setMobileMenu(false)}
              className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold shadow-md transition"
            >
              🔥 Popular
            </Link>

            <Link
              to="/multfilms"
              onClick={() => setMobileMenu(false)}
              className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold shadow-md transition"
            >
              🎞 Cartoons
            </Link>

            {user ? (
              <div className="flex items-center gap-3 px-4 py-2">
                <div
                  onClick={() => {
                    navigate("/profileee");
                    setMobileMenu(false);
                  }}
                  className="w-12 h-12 rounded-full overflow-hidden cursor-pointer border-2 border-yellow-400 hover:scale-110 transition-transform"
                >
                  <img
                    src={
                      user.profileImage ||
                      localStorage.getItem("profileAvatar") ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenu(false)}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold shadow-md transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileMenu(false)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-md transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>


    </nav>
  );
}

