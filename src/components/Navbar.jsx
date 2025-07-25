import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiHome,
  FiUser,
  FiLogOut,
  FiBarChart2,
  FiVideo,
} from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full z-20">
      <div className="mx-auto max-w-4xl mt-4 flex justify-between items-center px-6 py-3 rounded-2xl bg-gray-900/80 backdrop-blur-md border border-gray-800 shadow-lg">
        <div className="flex gap-4">
          <button
            className="flex flex-col items-center text-gray-200 hover:text-blue-400 transition-colors duration-200 px-3 py-2 rounded-lg focus:outline-none"
            onClick={() => navigate("/home")}
          >
            <FiHome className="h-6 w-6 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          <button
            className="flex flex-col items-center text-gray-200 hover:text-pink-400 transition-colors duration-200 px-3 py-2 rounded-lg focus:outline-none"
            onClick={() => navigate("/video")}
          >
            <FiVideo className="h-6 w-6 mb-1" />
            <span className="text-xs">Video</span>
          </button>
          <button
            className="flex flex-col items-center text-gray-200 hover:text-green-400 transition-colors duration-200 px-3 py-2 rounded-lg focus:outline-none"
            onClick={() => navigate("/profile")}
          >
            <FiUser className="h-6 w-6 mb-1" />
            <span className="text-xs">Profile</span>
          </button>
          <button
            className="flex flex-col items-center text-gray-200 hover:text-yellow-400 transition-colors duration-200 px-3 py-2 rounded-lg focus:outline-none"
            onClick={() => navigate("/leaderboard")}
          >
            <FiBarChart2 className="h-6 w-6 mb-1" />
            <span className="text-xs">Leaderboard</span>
          </button>
        </div>
        <button
          className="flex flex-col items-center text-gray-200 hover:text-red-400 transition-colors duration-200 px-3 py-2 rounded-lg focus:outline-none"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          <FiLogOut className="h-6 w-6 mb-1" />
          <span className="text-xs">Logout</span>
        </button>
      </div>
    </nav>
  );
}