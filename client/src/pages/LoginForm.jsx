import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../store/store";
import InputField from "../components/InputField";
import { loginUser } from "../services/authService";

export default function LoginForm({ toggleView }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate, isLoading, error } = useMutation({
    mutationFn: loginUser,
 onSuccess: (data) => {
  
  dispatch(setCredentials({ token: data.token, user: data.user }));

  // Store token in localStorage
  localStorage.setItem("token", data.token);

  console.log("Login success, token:", data.token);
  navigate("/company/register");
},

    onError: (err) => {
      console.error("Login error:", err.message || err);
    },
  });

  const onSubmit = (formData) => mutate(formData);

  return (
       <div className="w-full h-130 flex flex-col gap-6 text-black dark:text-white">
        <h2 className="text-2xl font-bold text-center text-[#1e0e4b] dark:text-white">
         Login as a Company
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full  flex mt-18  flex-col text-black dark:text-white"
        >
      

      {error && (
        <p className="bg-red-100 text-red-600 p-2 rounded">
          {error.message || "Login failed"}
        </p>
      )}

      <InputField
        label="EmailID"
        placeholder="Enter your email"
        {...register("email", { required: "Email is required" })}
        error={errors.email?.message}
      />
    <a href="" className="text-blue-400 hover:underline font-semibold text-sm pb-6">Login in with OTP</a>
      <InputField
        label="Password"
        type="password"
        placeholder="Enter your password"
        {...register("password", { required: "Password is required" })}
        error={errors.password?.message}
      />
      <a href="" className="text-blue-400 hover:underline font-semibold text-sm pb-8">Forget Password ?</a>
      <button
        type="submit"
        className="bg-blue-500 h-11 w-full rounded-full text-white font-medium shadow-md hover:bg-blue-600 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Logging In..." : "Login"}
      </button>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <span
          onClick={toggleView}
          className="text-blue-500 font-medium cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </div>
    </form>
    </div>
  );
}
