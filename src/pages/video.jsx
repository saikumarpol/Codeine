import React, { useState } from "react";
import PythonTutorial from "../pages/PythonTutorial";

export default function VideoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-200 px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">

        {/* First Card - Bro Code */}
        <div className="bg-gray-900/80 rounded-3xl shadow-2xl border border-gray-800 flex flex-col p-6 backdrop-blur-md h-full">
          <h1 className="text-2xl font-bold mb-4 text-white">Bro Code - Python</h1>
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-700 mb-4">
            <iframe
              className="w-full h-56 md:h-64 lg:h-72"
              src="https://www.youtube.com/embed/ix9cRaBkVe0?si=7rBxE6X2uAJFRpEW"
              title="Mastering Python - YouTube"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-gray-300 text-sm">
            Learn Python from scratch by Bro Code. Great for beginners & interview prep.
          </p>
        </div>

        {/* Second Card - Telusko */}
        <div className="bg-gray-900/80 rounded-3xl shadow-2xl border border-gray-800 flex flex-col p-6 backdrop-blur-md h-full">
          <h1 className="text-2xl font-bold mb-4 text-white">Telusko - Python</h1>
          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-700 mb-4">
            <iframe
              className="w-full h-56 md:h-64 lg:h-72"
              src="https://www.youtube.com/embed/videoseries?list=PLsyeobzWxl7poL9JTVyndKe62ieoN-MZ3"
              title="Python Full Playlist"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-gray-300 text-sm">
            Learn Python concepts step-by-step with Telusko's structured tutorials.
          </p>
        </div>

        {/* Third Card - Python Tutorial with Image */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer bg-gray-900/80 rounded-3xl shadow-2xl border border-gray-800 flex flex-col items-center p-6 backdrop-blur-md h-full transition hover:scale-105 hover:shadow-xl"
        >
          <img
            src="/assests/python.png"
            alt="Python Tutorial"
            className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-700"
          />
          <h1 className="text-2xl font-bold mb-2 text-white">Python Tutorial</h1>
          <p className="text-gray-300 text-sm text-center">
            Explore beginner to advanced Python theory with diagrams, code, and more.
            Click to open tutorial.
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="relative bg-white max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-6 text-black">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-xl text-gray-700 hover:text-red-500"
            >
              ✖
            </button>
            <PythonTutorial />
          </div>
        </div>
      )}
    </div>
  );
}