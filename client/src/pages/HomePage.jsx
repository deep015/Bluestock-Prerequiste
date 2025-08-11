import React from "react";
import { useNavigate } from "react-router-dom";

const HomePageContent = () => {
  const navigate = useNavigate();

  return (
    <>
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
    </>
  );
};

export default HomePageContent;
