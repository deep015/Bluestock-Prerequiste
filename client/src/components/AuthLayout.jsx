import React from "react";
import SideBanner from "./SideBanner";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="h-150 flex items-center justify-center p-8 dark:bg-gray-900">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden md:flex dark:bg-gray-800">
        
        {/* Left Side - Always same */}
        <SideBanner />

        {/* Right Side - Changes based on route */}
        <div className="flex flex-col gap-4 justify-center items-center w-full md:w-1/2 py-10 ">
          <Outlet /> {/* This will render Login/Register/HomePage content */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
