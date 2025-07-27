import Editor from "@monaco-editor/react";
import Problem from "./Problem";
import { useEffect, useState } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import { FiCheck, FiCircle, FiMenu, FiPlay, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { problems } from "../data/problems";

export default function IDE() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [pyodide, setPyodide] = useState(null);
  const [code, setCode] = useState(problems[0].starterCode);
  const [results, setResults] = useState([]);
  const [finalResult, setFinalResult] = useState("");
  const [warning, setWarning] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editorKey, setEditorKey] = useState(0); // <-- Important for resetting Editor

  // Fetch user solved problems from MongoDB
  useEffect(() => {
    const rollNo = localStorage.getItem("rollNo");
    if (rollNo) {
      axios.get(`https://ide-backend-0agn.onrender.com/user/${rollNo}`).then((res) => {
        const solved = res.data.solvedProblems || [];
        setCompleted(solved);
        const firstUnsolvedIndex = problems.findIndex(
          (p) => !solved.includes(p.id.toString())
        );
        const idx = firstUnsolvedIndex !== -1 ? firstUnsolvedIndex : 0;
        setCurrentIdx(idx);
        setCode(problems[idx].starterCode);
        setEditorKey((k) => k + 1); // reset editor
      });
    }
  }, []);

  useEffect(() => {
    const loadPyodideAndPackages = async () => {
      if (!window.loadPyodide) {
        console.error("Pyodide script not loaded - add it in index.html");
        return;
      }
      const pyodideInstance = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.2/full/",
      });
      setPyodide(pyodideInstance);
    };
    loadPyodideAndPackages();
  }, []);

  const showWarning = () => {
    setWarning("⚠️ Pasting is not allowed! Please write code yourself.");
    setTimeout(() => setWarning(""), 3000);
  };

  const runSingle = async (input) => {
    const safeCode = code || "";
    const codeWithStdout = `
import sys
from io import StringIO
sys.stdin = StringIO('''${input}''')
_stdout = sys.stdout
sys.stdout = StringIO()
try:
${safeCode.split("\n").map((line) => "    " + line).join("\n")}
    output_text = sys.stdout.getvalue()
except Exception as e:
    output_text = "Error: " + str(e)
sys.stdout = _stdout
output_text
`;
    try {
      return await pyodide.runPythonAsync(codeWithStdout);
    } catch (err) {
      return `Python Error: ${err.message}`;
    }
  };

  const runCode = async () => {
    if (!pyodide) return;
    setIsLoading(true);
    const firstCase = problems[currentIdx].testCases[0];
    const output = await runSingle(firstCase.input);
    setResults([
      {
        input: firstCase.input,
        expected: firstCase.output,
        got: output,
        pass: output.trim() === firstCase.output.trim(),
      },
    ]);
    setFinalResult("");
    setIsLoading(false);
  };

  const goToNextUnsolved = () => {
    const nextUnsolvedIndex = problems.findIndex(
      (p, idx) => !completed.includes(p.id.toString()) && idx !== currentIdx
    );
    const nextIndex = nextUnsolvedIndex !== -1 ? nextUnsolvedIndex : 0;
    setCurrentIdx(nextIndex);
    setCode(problems[nextIndex].starterCode);
    setResults([]);
    setFinalResult("");
    setEditorKey((k) => k + 1); // force re-render of editor
    setSidebarOpen(false);
  };

  const submitCode = async () => {
    if (!pyodide) return;
    setIsLoading(true);
    let allPassed = true;
    const tempResults = [];

    for (const test of problems[currentIdx].testCases) {
      const result = await runSingle(test.input);
      const pass = result.trim() === test.output.trim();
      if (!pass) allPassed = false;
      tempResults.push({ ...test, got: result, pass });
    }

    setResults(tempResults);
    setFinalResult(
      allPassed ? "✅ All test cases passed!" : "❌ Some test cases failed!"
    );

    if (allPassed) {
      const problemId = problems[currentIdx].id;
      if (!completed.includes(problemId.toString())) {
        setCompleted((prev) => [...prev, problemId.toString()]);
      }

      try {
        const rollNo = localStorage.getItem("rollNo");
        await axios.post("https://ide-backend-0agn.onrender.com/updateProgress", {
          rollNo,
          problemId,
        });
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          goToNextUnsolved();
        }, 2000);
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 font-sans">
      {/* Toast Notification */}
      {warning && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-in">
          {warning}
        </div>
      )}

      {/* Mobile Header */}
      <div className="md:hidden p-4 flex justify-between items-center bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md">
        <h1 className="text-xl font-bold tracking-tight">Coding Platform</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <FiMenu className="text-2xl" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "block animate-slide-in-left" : "hidden"
          } md:block w-full md:w-80 bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-700 transform transition-all duration-300 md:sticky md:top-6 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-custom`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-200">Problems</h2>
            <span className="text-sm text-gray-400">
              {completed.length}/{problems.length} Solved
            </span>
          </div>
          {problems.map((p, idx) => {
            const isSolved = completed.includes(p.id.toString());
            const isSelected = currentIdx === idx;
            let diffColor = "text-cyan-400";
            if (p.difficulty === "Hard") diffColor = "text-red-400";
            else if (p.difficulty === "Med.") diffColor = "text-yellow-400";
            else if (p.difficulty === "Easy") diffColor = "text-green-400";

            return (
              <button
                key={p.id}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-left transition-all font-semibold hover:bg-gray-700/80 focus:outline-none border-l-4 ${
                  isSelected
                    ? "bg-gray-700/80 border-blue-500 shadow-md"
                    : "border-transparent"
                }`}
                onClick={() => {
                  setCurrentIdx(idx);
                  setCode(problems[idx].starterCode);
                  setResults([]);
                  setFinalResult("");
                  setEditorKey((k) => k + 1);
                  setSidebarOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg ${
                      isSolved ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {isSolved ? <FiCheck /> : <FiCircle />}
                  </span>
                  <span className="text-gray-100 font-medium text-sm">
                    {idx + 1}. {p.title}
                  </span>
                </div>
                <span className={`text-xs font-bold ${diffColor}`}>
                  {p.difficulty}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Problem Description */}
          <div className="w-full bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 transition-all duration-300 hover:shadow-2xl">
            <Problem problem={problems[currentIdx]} />
          </div>

          {/* Code Editor */}
          <div className="w-full bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700">
            <Editor
              key={editorKey} // <-- Fix to reset code when problem changes
              height="400px"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                copyWithSyntaxHighlighting: false,
                contextmenu: false,
                quickSuggestions: false,
                minimap: { enabled: false },
                fontSize: 16,
                fontFamily: "Fira Code, monospace",
                lineNumbers: "on",
                roundedSelection: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
              }}
              onMount={(editor, monaco) => {
                editor.addCommand(
                  monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV,
                  () => showWarning()
                );
                editor.onKeyDown((e) => {
                  if ((e.ctrlKey || e.metaKey) && e.code === "KeyV") {
                    e.preventDefault();
                    showWarning();
                  }
                });
                editor.onDidPaste(() => {
                  editor.setValue(editor.getValue());
                  showWarning();
                });
              }}
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={runCode}
                disabled={isLoading}
                className={`flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiPlay /> {isLoading ? "Running..." : "Run Code"}
              </button>
              <button
                onClick={submitCode}
                disabled={isLoading}
                className={`flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2.5 rounded-full shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FiCheckCircle /> {isLoading ? "Submitting..." : "Submit Code"}
              </button>
              {completed.includes(problems[currentIdx].id.toString()) && (
                <button
                  onClick={goToNextUnsolved}
                  disabled={isLoading}
                  className={`flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2.5 rounded-full shadow-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiCheckCircle /> Next
                </button>
              )}
            </div>

            {/* Test Case Results */}
            <div className="mt-6 bg-gray-900 p-4 rounded-xl border border-gray-700">
              {results.length > 0 ? (
                results.map((r, i) => (
                  <div
                    key={i}
                    className={`p-4 mb-3 rounded-xl shadow-md border transition-all duration-200 ${
                      r.pass
                        ? "bg-green-900/50 border-green-700"
                        : "bg-red-900/50 border-red-700"
                    } text-white`}
                  >
                    <div className="flex items-center gap-2 font-bold text-lg">
                      {r.pass ? (
                        <FiCheckCircle className="text-green-400" />
                      ) : (
                        <FiXCircle className="text-red-400" />
                      )}
                      {r.pass ? "Passed" : "Failed"} - Test Case {i + 1}
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <b>Input:</b>{" "}
                        <span className="text-blue-300 font-mono">{r.input}</span>
                      </div>
                      <div>
                        <b>Expected:</b>{" "}
                        <span className="text-green-300 font-mono">
                          {r.output}
                        </span>
                      </div>
                      <div>
                        <b>Got:</b>{" "}
                        <span className="text-yellow-300 font-mono">
                          {r.got.trim() || "<empty output>"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center">
                  {isLoading ? "Running code..." : "Run code to see results..."}
                </div>
              )}
            </div>

            {/* Final Result */}
            {finalResult && (
              <div
                className={`mt-6 p-4 rounded-xl text-white text-center font-bold text-lg shadow-md border transition-all duration-200 ${
                  finalResult.includes("All test cases passed")
                    ? "bg-green-600/80 border-green-700"
                    : "bg-red-600/80 border-red-700"
                }`}
              >
                {finalResult}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

