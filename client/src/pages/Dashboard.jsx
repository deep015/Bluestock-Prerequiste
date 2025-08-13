// client/src/pages/Dashboard.jsx
// This is the main protected page that an authenticated user can access.

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../App';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-8 p-8">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 text-center">
        Welcome to the Dashboard, {user?.name || 'User'}!
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
        This is a protected page. You are successfully logged in.
      </p>
      <button
        onClick={() => dispatch(logout())}
        className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
