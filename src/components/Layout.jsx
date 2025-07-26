import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-[#0a0f1e] via-[#12192d] to-[#0a0f1e] text-white">
      {/* Navbar */}
      <Navbar />

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
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
