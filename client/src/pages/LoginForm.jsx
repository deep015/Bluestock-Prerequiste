import React from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock } from 'react-icons/fa';

export default function LoginForm({ toggleView }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = data => {
    console.log('Login form submitted:', data);
    // Add your login API call logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center dark:text-gray-100">
        Login as a Company
      </h2>
      
      {/* Email Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaEnvelope className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="email-login"
          type="email"
          {...register("email", { 
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
          })}
          className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          placeholder="Email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      
      {/* Password Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaLock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="password-login"
          type="password"
          {...register("password", { required: "Password is required" })}
          className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          placeholder="Password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors duration-300"
      >
        Login
      </button>

      {/* Toggle Link */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <span
          className="text-indigo-600 font-semibold cursor-pointer hover:underline"
          onClick={toggleView}
        >
          Sign up
        </span>
      </div>
    </form>
  );
};

