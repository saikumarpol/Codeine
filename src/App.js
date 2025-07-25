import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { problems } from "./data/problems";
import IDE from "./components/IDE";
import Problem from "./components/Problem";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import Leaderboard from "./pages/Leaderboard";
import VideoPage from "./pages/video";
import Home from "./pages/home";
import Profile from "./pages/profile.jsx";
import Layout from "./components/Layout.jsx"

export default function App() {
  const [currentProblem, setCurrentProblem] = useState(problems[0]);
  const [solved, setSolved] = useState([]);
  const rollNo = localStorage.getItem("rollNo");

  const fetchSolvedProblems = async () => {
    try {
      const res = await axios.get(`https://ide-backend-0agn.onrender.com/user/${rollNo}`);
      setSolved(res.data.solvedProblems || []);
    } catch (error) {
      console.error("Error fetching solved problems", error);
      setSolved([]);
    }
  };

  useEffect(() => {
    if (!rollNo) return;
    fetchSolvedProblems();
    const savedProblemId = localStorage.getItem("currentProblemId");
    if (savedProblemId) {
      const problem = problems.find((p) => p.id === parseInt(savedProblemId));
      if (problem) {
        setCurrentProblem(problem);
      }
    }
  }, [rollNo]);

  const setProblem = (p) => {
    setCurrentProblem(p);
    localStorage.setItem("currentProblemId", p.id);
  };

  const handleNextProblem = async () => {
    await fetchSolvedProblems();
    const index = problems.findIndex((p) => p.id === currentProblem.id);
    const next = problems[index + 1];
    if (next) {
      setProblem(next);
    } else {
      alert("🎉 You finished all problems!");
    }
  };

  const [initialRoute, setInitialRoute] = useState("/register");

  useEffect(() => {
    if (!localStorage.getItem("registered")) {
      setInitialRoute("/register");
    } else if (!rollNo) {
      setInitialRoute("/login");
    } else {
      setInitialRoute("/home");
    }
  }, [rollNo]);

  return (
    <Router>
      <Routes>
        {/* Routes without navbar */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Routes with navbar */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/ide"
            element={
              <IDE
                problem={currentProblem}
                starterCode={currentProblem.starterCode}
                testCases={currentProblem.testCases}
                problemId={currentProblem.id}
                onNextProblem={handleNextProblem}
              />
            }
          />
          <Route path="/questions" element={<Problem problem={currentProblem} />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<RedirectTo route={initialRoute} />} />
      </Routes>
      <footer className="absolute bottom-4 w-full text-center text-gray-400 text-sm">
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

    </Router>
  );
}

// Redirect helper
function RedirectTo({ route }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(route, { replace: true });
  }, [route, navigate]);
  return null;
}