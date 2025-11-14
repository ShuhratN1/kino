import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = register(username, password);
    if (res.success) {
      navigate("/login");
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-yellow-400 text-center">Register</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
        />
        <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 px-4 py-3 rounded-lg font-semibold transition">
          Register
        </button>
        <p className="text-gray-400 text-center text-sm">
          Allaqachon ro‘yxatdan o‘tganmisiz? <Link to="/login" className="text-yellow-400 underline hover:text-yellow-300">Login</Link>
        </p>
      </form>
    </div>
  );
}
