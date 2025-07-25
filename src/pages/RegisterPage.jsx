import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post("https://ide-backend-3wz1.onrender.com/auth/register", {
        rollNo,
        name,
        password,
      });
      setMsg(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">

        {/* Image Section — top on mobile, left on desktop */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8">
          <img
            src="/assests/signup.png"
            alt="Sign Up Illustration"
            className="w-40 sm:w-56 md:w-72 lg:w-80 xl:w-96 mb-4 md:mb-6"
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white text-center">
            Unlock Your <br />
            Coding <span className="text-[#1e90ff]">Performance</span>
          </h2>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-extrabold text-white mb-2 text-center">
              Create your <span className="text-[#1e90ff]">Account</span>
            </h2>
            <p className="text-gray-300 mb-8 text-sm text-center">
              Register to unlock your coding performance
            </p>

            {/* Form Inputs */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-1 ml-1" htmlFor="rollNo">Roll Number</label>
              <input
                id="rollNo"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e90ff] mb-4 text-white placeholder-gray-400"
                placeholder="Enter Roll Number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                autoComplete="username"
              />

              <label className="block text-gray-300 mb-1 ml-1" htmlFor="name">Name</label>
              <input
                id="name"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e90ff] mb-4 text-white placeholder-gray-400"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />

              <label className="block text-gray-300 mb-1 ml-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e90ff] mb-2 text-white placeholder-gray-400"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            {/* Register Button */}
            <button
              className="w-full bg-[#1e90ff] hover:bg-[#1877c9] text-white font-semibold py-2 rounded-lg mb-6 transition-colors duration-200 text-lg shadow"
              onClick={handleRegister}
            >
              Register
            </button>

            {/* Login Redirect */}
            <div className="w-full text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-[#1e90ff] font-semibold hover:underline">Login</a>
            </div>

            {/* Success/Error Message */}
            {msg && <p className="mt-4 text-green-400 text-center w-full">{msg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}