import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 dark:bg-gray-900">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden md:flex dark:bg-gray-800">
        
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 p-8 bg-gradient-to-r from-indigo-500 to-purple-500 items-center justify-center">
          <h1 className="text-white text-3xl font-bold">IMS Placeholder</h1>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-4 justify-center items-center w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold dark:text-white">Welcome</h2>
          <p className="text-gray-500 dark:text-gray-300 text-center">
            Please choose an option to continue
          </p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
