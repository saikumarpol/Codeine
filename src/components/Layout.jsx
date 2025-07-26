// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="pt-24 px-4"> {/* Adjust pt-24 to avoid overlap with fixed navbar */}
        <Outlet />
      </main>
    </div>
  );
}
