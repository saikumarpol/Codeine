import { useEffect, useState } from "react";
import axios from "axios";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://ide-backend-0agn.onrender.com/leaderboard")
      .then((res) => setData(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-200 px-4">
      {/* Full Page Loader */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          <div className="relative w-16 h-16">
            <div className="absolute w-full h-full border-4 border-t-transparent border-[#1e90ff] rounded-full animate-spin"></div>
            <div className="absolute w-10 h-10 top-3 left-3 border-4 border-t-transparent border-[#ffb703] rounded-full animate-spin-slow"></div>
          </div>
          <p className="mt-4 text-white font-semibold text-lg">Fetching Leaderboard...</p>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (
        <div className="bg-gray-900/80 rounded-3xl shadow-2xl border border-gray-800 flex flex-col w-full max-w-5xl p-6 sm:p-8 backdrop-blur-md">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg flex items-center gap-2">
              <span className="text-yellow-400 text-4xl">🏆</span> Leaderboard
            </h2>
          </div>

          {/* Table (Responsive) */}
          <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-inner">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-700/80">
                <tr>
                  <th className="px-4 py-3 text-yellow-300 font-bold text-base sm:text-lg">Rank</th>
                  <th className="px-4 py-3 text-blue-300 font-bold text-base sm:text-lg">Name</th>
                  <th className="px-4 py-3 text-green-300 font-bold text-base sm:text-lg">Roll No</th>
                  <th className="px-4 py-3 text-pink-300 font-bold text-base sm:text-lg">Problems Solved</th>
                  <th className="px-4 py-3 text-orange-300 font-bold text-base sm:text-lg">Streak 🔥</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((u, i) => (
                    <tr
                      key={i}
                      className={`transition-colors ${
                        i === 0
                          ? "bg-yellow-400/80 text-black font-bold"
                          : i === 1
                          ? "bg-gray-400/80 text-black font-bold"
                          : i === 2
                          ? "bg-orange-400/80 text-black font-bold"
                          : "hover:bg-gray-700/60"
                      }`}
                    >
                      <td className="px-4 py-3 text-sm sm:text-lg">{i + 1}</td>
                      <td className="px-4 py-3 text-sm sm:text-lg flex items-center gap-2">
                        <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white font-bold text-base sm:text-xl shadow-lg">
                          {u.name.charAt(0)}
                        </span>
                        <span className="truncate">{u.name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm sm:text-lg">{u.rollNo}</td>
                      <td className="px-4 py-3 text-sm sm:text-lg">{u.problemsSolved}</td>
                      <td className="px-4 py-3 text-sm sm:text-lg">{u.streak}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-400 text-lg">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
