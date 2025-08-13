// client/src/layouts/AuthLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import SideBanner from "../components/SideBanner";

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="w-full max-w-5xl rounded-3xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden md:flex">
        
        {/* Left side: Banner */}
        <SideBanner />

        {/* Right side: Auth form */}
        <div className="flex flex-col justify-center w-full md:w-1/2 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
