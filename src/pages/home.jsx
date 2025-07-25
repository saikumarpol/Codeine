
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiHome, FiUser, FiLogOut, FiBarChart2 } from "react-icons/fi";
import { FiVideo } from "react-icons/fi";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useMotionTemplate, useMotionValue, motion, animate } from "framer-motion";

// Define navButtonClass for navbar buttons
const navButtonClass = "px-4 py-2 rounded-xl font-semibold text-white bg-gray-800/80 hover:bg-blue-600 transition shadow-md mx-2";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

export default function Home() {
  const color = useMotionValue(COLORS_TOP[0]);
  const navigate = useNavigate();

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <motion.section
      style={{ backgroundImage }}
      className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      {/* Modern glassmorphism navbar */}
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
      <div className="relative z-10 flex flex-col items-center">
        <span className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm">
          Hi there, I'm your assistant
        </span>
        <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
          Increase your coding by over 90%
        </h1>
        <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed">
          Unlock your coding potential with hands-on practice, real interview questions, and instant feedback. Build your skills, solve problems, and get ready to ace your next coding challenge!
        </p>
        <motion.button
          style={{ border, boxShadow }}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
          onClick={() => navigate("/ide")}
        >
          Start your coding journey
          <FiArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
        </motion.button>
      </div>
      {/* Removed animated white dots background */}
    </motion.section>
  );
}
