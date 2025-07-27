import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [lastUpdated, setLastUpdated] = useState(null);

  const quotes = [
    "Code is like humor. When you have to explain it, it’s bad.",
    "First, solve the problem. Then, write the code.",
    "Dream in code, build in passion, deploy in success.",
    "Your only limit is your imagination — and maybe semicolons.",
    "Every bug you fix is a step closer to mastery."
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Change quote every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch leaderboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("https://ide-backend-0agn.onrender.com/leaderboard");
        setData(res.data);
        setLastUpdated(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      } catch (err) {
        setError("Failed to fetch leaderboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sorting + filtering with tie-breaker
  const filteredData = useMemo(() => {
    let result = [...data];
    if (searchTerm) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    result.sort((a, b) => {
      // Primary sort
      if (a.problemsSolved !== b.problemsSolved) {
        return sortOrder === "desc"
          ? b.problemsSolved - a.problemsSolved
          : a.problemsSolved - b.problemsSolved;
      }
      // Tie-breaker using lastSolvedDate (earlier wins)
      if (a.lastSolvedDate && b.lastSolvedDate) {
        return new Date(a.lastSolvedDate) - new Date(b.lastSolvedDate);
      }
      return 0;
    });
    return result;
  }, [data, searchTerm, sortOrder]);

  const getMedal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-[#0a0f1e] via-[#12192d] to-[#0a0f1e] text-white">
      <main className="flex-1 px-4 py-8">
        {isLoading && (
          <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Branding Header */}
            <div className="flex flex-col items-center text-center px-4">
              <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
                Codeine Leaderboard
              </h1>
              <p className="text-gray-400 mt-2 text-sm sm:text-base">
                Top performers • Last updated: {lastUpdated}
              </p>
              <motion.p
                key={quoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-yellow-400 mt-4 text-lg italic font-medium"
              >
                “{quotes[quoteIndex]}”
              </motion.p>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-col sm:flex-row gap-4 px-4">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or roll number..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 sm:w-auto w-full justify-between sm:justify-start">
                <button
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 w-1/2 sm:w-auto"
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                >
                  {sortOrder === "desc" ? "↓ Desc" : "↑ Asc"}
                </button>
              </div>
            </div>

            {/* Podium */}
            <div className="flex flex-col sm:flex-row sm:justify-center sm:items-end gap-6 mt-10 px-4">
              {filteredData.slice(0, 3).map((u, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative flex flex-col items-center text-center bg-gray-900/60 backdrop-blur-md rounded-xl shadow-lg px-6 pt-10 pb-6 border w-full sm:w-auto ${
                    i === 0
                      ? "border-yellow-400 sm:h-[230px]"
                      : i === 1
                      ? "border-gray-400 sm:h-[200px]"
                      : "border-orange-400 sm:h-[180px]"
                  }`}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <p className="mt-3 font-semibold text-xl">{u.name}</p>
                  <p className="text-gray-400 text-sm">Roll No: {u.rollNo}</p>
                  <p className="text-green-400 mt-1">{u.problemsSolved} Solved</p>
                  <p className="text-orange-400 text-sm">🔥 {u.streak}</p>
                  <span className="absolute -top-5 text-3xl">{getMedal(i + 1)}</span>
                </motion.div>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl bg-gray-900/70 backdrop-blur-md shadow-2xl border border-gray-800 mx-4">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-gray-800/60 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-yellow-300">Rank</th>
                    <th className="px-4 py-3 text-blue-300">Name</th>
                    <th className="px-4 py-3 text-green-300">Roll No</th>
                    <th className="px-4 py-3 text-pink-300">Solved</th>
                    <th className="px-4 py-3 text-orange-300">Streak🔥</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((u, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="hover:bg-gray-800/40 transition"
                    >
                      <td className="px-4 py-3">{getMedal(i + 1)}</td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {u.name.charAt(0)}
                        </span>
                        {u.name}
                      </td>
                      <td className="px-4 py-3">{u.rollNo}</td>
                      <td className="px-4 py-3">{u.problemsSolved}</td>
                      <td className="px-4 py-3">{u.streak}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-gray-400 text-sm py-4 border-t border-gray-700">
        © {new Date().getFullYear()} Codeine — Developed by{" "}
        <a
          href="https://www.linkedin.com/in/sai-kumar-pola-3993851a1/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-200 hover:underline hover:text-blue-400 transition-colors"
        >
          Sai Kumar Pola
        </a>
      </footer>
    </div>
  );
}
