
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';

const RegisterForm = ({ toggleView }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = data => {
    console.log('Register form submitted:', data);
    // Add your registration API call logic here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center dark:text-gray-100">
        Register as a Company
      </h2>
      
      {/* Full Name Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaUser className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="fullName-register"
          type="text"
          {...register("fullName", { required: "Full name is required" })}
          className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          placeholder="Full Name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
        )}
      </div>
      
      {/* Email Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaEnvelope className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id="email-register"
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
          id="password-register"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" }
          })}
          className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          placeholder="Password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Terms and Conditions Checkbox */}
      <div className="flex items-center">
        <input
          id="terms"
          type="checkbox"
          {...register("terms", { required: "You must accept the terms and conditions" })}
          className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          I accept the Terms and Conditions
        </label>
      </div>
      {errors.terms && (
        <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>
      )}

      {/* Register Button */}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors duration-300"
      >
        Register
      </button>

      {/* Toggle Link */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <span
          className="text-indigo-600 font-semibold cursor-pointer hover:underline"
          onClick={toggleView}
        >
          Login
        </span>
      </div>
    </form>
  );
};


export default RegisterForm