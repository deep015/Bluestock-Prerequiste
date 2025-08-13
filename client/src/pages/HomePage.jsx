import React from "react";
import { useNavigate } from "react-router-dom";
import SideBanner from "../components/SideBanner";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center  bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full  h-135 max-w-5xl rounded-3xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden md:flex">
        
        {/* Left fixed banner */}
        <SideBanner />
      
        {/* Right content */}
        <div className="flex h-135 flex-col w-full md:w-1/2  ">
          <div className="">
          <h2 className="text-2xl mt-30 text-center font-bold text-gray-900 dark:text-white">
            Welcome
          </h2>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-lg my-2"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-lg my-2"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
