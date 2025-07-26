import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post("https://ide-backend-0agn.onrender.com/auth/register", { rollNo, name, password });
      setMsg(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 px-4">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          <div className="relative w-16 h-16">
            <div className="absolute w-full h-full border-4 border-t-transparent border-[#1e90ff] rounded-full animate-spin"></div>
            <div className="absolute w-10 h-10 top-3 left-3 border-4 border-t-transparent border-yellow-400 rounded-full animate-spin-slow"></div>
          </div>
          <p className="mt-4 text-white font-semibold text-lg">Registering...</p>
        </div>
      )}
      <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8">
          <img src="/assests/signup.png" alt="Sign Up" className="w-40 sm:w-56 md:w-72 lg:w-80 xl:w-96 mb-4 md:mb-6" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white text-center">
            Unlock Your <br /> Coding <span className="text-[#1e90ff]">Performance <span className="text-white">With</span> codeine</span>
          </h2>
        </div>
        {/* Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Create your <span className="text-[#1e90ff]">Account</span></h2>
            <p className="text-gray-300 mb-8 text-sm text-center">Register to unlock your coding performance</p>
            {/* Inputs */}
            <label className="block text-gray-300 mb-1 ml-1" htmlFor="rollNo">Roll Number</label>
            <input id="rollNo" className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-[#1e90ff] mb-4 text-white" placeholder="Enter Roll Number" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
            <label className="block text-gray-300 mb-1 ml-1" htmlFor="name">Name</label>
            <input id="name" className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-[#1e90ff] mb-4 text-white" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
            <label className="block text-gray-300 mb-1 ml-1" htmlFor="password">Password</label>
            <input id="password" type="password" className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-[#1e90ff] mb-4 text-white" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister} className="w-full bg-[#1e90ff] hover:bg-[#1877c9] text-white font-semibold py-2 rounded-lg mb-6 transition-colors text-lg shadow">Register</button>
            <div className="text-center text-gray-400 text-sm">Already have an account? <a href="/login" className="text-[#1e90ff] hover:underline">Login</a></div>
            {msg && <p className="mt-4 text-center text-green-400">{msg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
