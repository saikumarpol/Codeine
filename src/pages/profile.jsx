import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Profile() {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [leaderboard, setLeaderboard] = useState({ rank: "-", problemsSolved: 0, streak: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setName(localStorage.getItem("name") ?? "User");
    setRollNo(localStorage.getItem("rollNo") ?? "");
    setEmail(localStorage.getItem("email") ?? "");
  }, []);

  useEffect(() => {
    if (!rollNo) {
      setIsLoading(false);
      return;
    }
    fetch("https://ide-backend-0agn.onrender.com/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        const idx = data.findIndex((u) => u.rollNo === rollNo);
        if (idx !== -1) {
          setLeaderboard({
            rank: idx + 1,
            problemsSolved: data[idx].problemsSolved,
            streak: data[idx].streak,
          });
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [rollNo]);

  const progress = Math.min((leaderboard.problemsSolved / 100) * 100, 100);

  const achievements = [];
  if (leaderboard.streak >= 7)
    achievements.push({ label: "7+ Day Streak 🔥", className: "text-yellow-300 border-yellow-500 bg-yellow-500/10" });
  if (leaderboard.rank <= 10)
    achievements.push({ label: "Top 10 Coder 🏆", className: "text-blue-300 border-blue-500 bg-blue-500/10" });
  if (leaderboard.problemsSolved >= 50)
    achievements.push({ label: "50+ Problems Solver ✅", className: "text-green-300 border-green-500 bg-green-500/10" });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
        <div className="relative w-16 h-16">
          <div className="absolute w-full h-full border-4 border-t-transparent border-[#1e90ff] rounded-full animate-spin"></div>
          <div className="absolute w-10 h-10 top-3 left-3 border-4 border-t-transparent border-yellow-400 rounded-full animate-spin-slow"></div>
        </div>
        <p className="mt-4 text-white font-semibold text-lg">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-200 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/40 rounded-3xl shadow-2xl border border-gray-800/50 flex flex-col items-center w-full max-w-3xl p-6 sm:p-8"
      >
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-5xl mb-4 ring-4 ring-blue-500/30"
        >
          {name.charAt(0).toUpperCase()}
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-1">{name}</h1>
        <p className="text-gray-400 text-lg mb-8">{rollNo || "No Roll Number"}</p>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8">
          {[
            { key: "Rank", value: leaderboard.rank, color: "yellow-400" },
            { key: "Problems Solved", value: leaderboard.problemsSolved, color: "green-400" },
            { key: "Streak 🔥", value: `${leaderboard.streak} days`, color: "orange-400" },
          ].map((stat, index) => (
            <motion.div
              key={stat.key}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/50 rounded-xl p-4 text-center"
            >
              <h2 className="text-gray-400 text-sm mb-2">{stat.key}</h2>
              <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Progress */}
        <div className="w-full mb-8">
          <h3 className="text-xl font-bold mb-3">Progress Overview</h3>
          <div className="w-full h-6 rounded-full bg-gray-700/50 overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-green-500 to-green-700"
            />
            <div className="absolute inset-0 flex justify-end items-center pr-2 text-xs font-semibold">{progress.toFixed(1)}%</div>
          </div>
          <p className="text-sm text-gray-400 mt-2">{leaderboard.problemsSolved} / 100 problems solved</p>
        </div>

        {/* Achievements */}
        <div className="w-full">
          <h3 className="text-xl font-bold mb-3">Achievements</h3>
          <div className="flex flex-wrap gap-3">
            {achievements.length > 0
              ? achievements.map((a) => (
                  <motion.span key={a.label} whileHover={{ scale: 1.1 }} className={`px-4 py-2 rounded-full border ${a.className}`}>
                    {a.label}
                  </motion.span>
                ))
              : <span className="px-4 py-2 rounded-full bg-gray-700/50 text-gray-400 border border-gray-600">Keep Going 💪</span>}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
