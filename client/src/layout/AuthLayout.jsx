import React from "react";
import SideBanner from "../components/SideBanner";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen p-6 dark:bg-gray-900">
      <div className="w-full max-w-4xl  rounded-3xl shadow-2xl overflow-hidden md:flex dark:bg-gray-800 p-10 gap-6">
        
        {/* Left Side - Always same */}
        <SideBanner />

        {/* Right Side - Changes based on route */}
        <div className="flex flex-col gap-6 justify-center w-full md:w-1/2">
          <Outlet /> {/* This will render Login/Register/HomePage content */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
