import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://ide-backend-3wz1.onrender.com/leaderboard").then((res) => setData(res.data));
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-200 px-4">
      <div className="bg-gray-900/80 rounded-3xl shadow-2xl border border-gray-800 flex flex-col w-full max-w-4xl p-8 backdrop-blur-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-2">
            <span className="text-yellow-400">🏆</span> Leaderboard
          </h2>
          {/* <button
            onClick={() => navigate("/ide")}
            className="bg-blue-600 px-5 py-2 rounded-xl shadow-lg hover:bg-blue-700 transition font-semibold text-white"
          >
            ← Back
          </button> */}
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse bg-gray-800/80 rounded-2xl shadow-lg backdrop-blur">
            <thead className="bg-gray-700/80">
              <tr>
                <th className="px-6 py-4 text-left text-yellow-300 font-bold text-lg rounded-tl-2xl">Rank</th>
                <th className="px-6 py-4 text-left text-blue-300 font-bold text-lg">Name</th>
                <th className="px-6 py-4 text-left text-green-300 font-bold text-lg">Roll No</th>
                <th className="px-6 py-4 text-left text-pink-300 font-bold text-lg">Problems Solved</th>
                <th className="px-6 py-4 text-left text-orange-300 font-bold text-lg rounded-tr-2xl">Streak 🔥</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((u, i) => (
                  <tr
                    key={i}
                    className={`hover:bg-gray-700/80 transition ${i === 0 ? "bg-yellow-400/80 text-black font-bold" : i === 1 ? "bg-gray-400/80 text-black font-bold" : i === 2 ? "bg-orange-400/80 text-black font-bold" : ""}`}
                  >
                    <td className="px-6 py-4 text-lg">{i + 1}</td>
                    <td className="px-6 py-4 text-lg flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-lg`}>{u.name.charAt(0)}</span>
                      {u.name}
                    </td>
                    <td className="px-6 py-4 text-lg">{u.rollNo}</td>
                    <td className="px-6 py-4 text-lg">{u.problemsSolved}</td>
                    <td className="px-6 py-4 text-lg">{u.streak}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400 text-xl">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
