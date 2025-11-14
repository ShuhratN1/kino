import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Profileee() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(
    localStorage.getItem("profileAvatar") || null
  );
  const [message, setMessage] = useState("");


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

 
  const handleSave = () => {
    if (!user) return; 
    if (avatar) {
      localStorage.setItem("profileAvatar", avatar);
      user.profileImage = avatar; 
      setMessage("Profil muvaffaqiyatli saqlandi ✅");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center p-8">
      <button
        onClick={() => navigate(-1)}
        className="self-start mb-4 flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        👤 My profile
      </h1>

      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center gap-6">
        <div className="relative">
          <img
            src={avatar || user?.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt="User Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500"
          />
          <label className="absolute bottom-0 right-0 bg-yellow-500 text-black px-2 py-1 text-xs rounded-lg cursor-pointer hover:bg-yellow-400 transition">
            Change
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div className="w-full text-left">
          <label className="text-sm text-gray-400">username: </label>
          <p className="text-white font-semibold text-lg">{user?.username || ""}</p>
        </div>

        <div className="flex gap-4 mt-4">

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition"
          >
            🚪 Logout
          </button>
        </div>

        {message && <p className="text-green-400 mt-3">{message}</p>}
      </div>
    </div>
  );
}
