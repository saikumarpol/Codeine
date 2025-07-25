import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Profile() {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [leaderboard, setLeaderboard] = useState({ rank: "-", problemsSolved: 0, streak: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load user data from localStorage
    setName(localStorage.getItem("name") ?? "User");
    setRollNo(localStorage.getItem("rollNo") ?? "");
    setEmail(localStorage.getItem("email") ?? "");
  }, []);

  useEffect(() => {
    if (!rollNo) return;
    setIsLoading(true);
    fetch("https://ide-backend-0agn.onrender.com/leaderboard")
      .then(res => res.json())
      .then(data => {
        const idx = data.findIndex(u => u.rollNo === rollNo);
        if (idx !== -1) {
          setLeaderboard({
            rank: idx + 1,
            problemsSolved: data[idx].problemsSolved,
            streak: data[idx].streak,
          });
        }
      })
      .catch(err => console.error("Failed to fetch leaderboard:", err))
      .finally(() => setIsLoading(false));
  }, [rollNo]);

  const progress = Math.min((leaderboard.problemsSolved / 100) * 100, 100);

  // Define achievements explicitly to avoid syntax issues
  const achievements = [];
  if (leaderboard.streak >= 7) {
    achievements.push({
      label: "7+ Day Streak 🔥",
      color: "yellow",
      className: "text-yellow-300 border-yellow-500 bg-yellow-500/10",
    });
  }
  if (leaderboard.rank <= 10) {
    achievements.push({
      label: "Top 10 Coder 🏆",
      color: "blue",
      className: "text-blue-300 border-blue-500 bg-blue-500/10",
    });
  }
  if (leaderboard.problemsSolved >= 50) {
    achievements.push({
      label: "50+ Problems Solver ✅",
      color: "green",
      className: "text-green-300 border-green-500 bg-green-500/10",
    });
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
        <div className="animate-pulse bg-gray-800/50 rounded-3xl w-full max-w-3xl h-96"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-200 px-4 py-12 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/40 rounded-3xl shadow-2xl border border-gray-800/50 flex flex-col items-center w-full max-w-3xl p-8 backdrop-blur-xl"
      >
        {/* Avatar */}
        <motion.div
          className="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-5xl shadow-xl mb-4 ring-4 ring-blue-500/30"
          whileHover={{ scale: 1.05 }}
        >
          {name ? name.charAt(0).toUpperCase() : "U"}
          <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-md"></div>
        </motion.div>
        <motion.h1
          className="text-4xl font-extrabold mb-1 text-white tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {name}
        </motion.h1>
        <p className="text-gray-400 text-lg">{rollNo || "No Roll Number"}</p>
        {/* <p className="text-gray-400 text-md mb-8">{email || "No Email"}</p> */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8">
          {[
            { key: "Rank", value: leaderboard.rank, color: "yellow-400" },
            { key: "Problems Solved", value: leaderboard.problemsSolved, color: "green-400" },
            { key: "Streak 🔥", value: `${leaderboard.streak} days`, color: "orange-400" },
          ].map((stat, index) => (
            <motion.div
              key={stat.key}
              className="bg-gray-800/50 rounded-xl p-5 text-center border border-gray-700/50 backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <h2 className="text-gray-400 text-sm font-medium mb-2">{stat.key}</h2>
              <p className={`text-3xl font-bold text-${stat.color}`}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <h3 className="text-xl font-bold mb-3 text-white">Progress Overview</h3>
          <motion.div
            className="w-full h-6 rounded-full bg-gray-700/50 overflow-hidden relative"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-green-700"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            ></motion.div>
            <div className="absolute inset-0 flex items-center justify-end pr-2 text-xs text-white font-semibold">
              {progress.toFixed(1)}%
            </div>
          </motion.div>
          <p className="text-sm text-gray-400 mt-2">
            {leaderboard.problemsSolved} / 100 problems solved
          </p>
        </div>

        {/* Achievements Section */}
        <div className="w-full">
          <h3 className="text-xl font-bold mb-3 text-white">Achievements</h3>
          <div className="flex flex-wrap gap-3">
            {achievements.map((achievement, index) => (
              <motion.span
                key={achievement.label}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${achievement.className}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                {achievement.label}
              </motion.span>
            ))}
            {achievements.length === 0 && (
              <motion.span
                className="px-4 py-2 rounded-full bg-gray-700/50 text-gray-400 text-sm border border-gray-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
              >
                Keep Going 💪
              </motion.span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}