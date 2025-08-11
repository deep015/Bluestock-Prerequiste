import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../index.css";

const RegisterForm = () => {
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
 const [showPopup, setShowPopup] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setShowPopup(true); // show popup on register click
  };

  return (
    <>
   
<div className="w-full flex flex-col gap-6 text-black dark:text-white">
  <h2 className="text-2xl font-bold text-center text-[#1e0e4b] dark:text-white">
    Register as a Company
  </h2>

  <form  onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
    {/* Full Name */}
    <div>
      <label className="block font-medium text-sm mb-2">Full Name</label>
      <input
        type="text"
        className="w-full h-11 px-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#478aff] outline-none"
      />
    </div>

    {/* Phone */}
    <div>
      <label className="block font-medium text-sm mb-2">Phone Number</label>
      <PhoneInput
        country={"in"}
        value={phone}
        onChange={(value) => setPhone(value)}
        enableSearch={true}
        placeholder="Enter mobile number"
        inputClass="!w-full !h-11 !rounded-lg !border-gray-300 shadow-sm"
      />
    </div>

    {/* Gender */}
    <div>
      <label className="block font-medium text-sm mb-2">Gender</label>
      <div className="flex gap-2">
        {["Male", "Female", "Other"].map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGender(g)}
            className={`px-4 py-2 rounded-4xl gap-2 shadow-md transition text-sm font-medium 
              ${
                gender === g
                  ? "bg-[#478aff] text-white"
                  : "bg-white text-gray-700"
              }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>

    {/* Passwords */}
    <div className="flex gap-3">
      <div className="w-1/2">
        <label className="block font-medium text-sm mb-2">Password</label>
        <input
          type="password"
          className="w-full h-11 px-3 rounded-lg border  shadow-md focus:ring-2 focus:ring-[#478aff] outline-none"
        />
      </div>
      <div className="w-1/2">
        <label className="block font-medium text-sm mb-2">Confirm Password</label>
        <input
          type="password"
          className="w-full h-11 px-3 rounded-lg border  shadow-md focus:ring-2 focus:ring-[#478aff] outline-none"
        />
      </div>
    </div>

    {/* Privacy */}
    <div className="flex items-start gap-2 text-sm">
      <input type="checkbox" className="mt-1 w-4 h-4 accent-[#478aff]" />
      <span className="text-gray-600">
        All your information is processed as per our{" "}
        <a href="#" className="text-[#478aff] hover:underline">Privacy Policy</a>{" "}
        and{" "}
        <a href="#" className="text-[#478aff] hover:underline">Terms of Use</a>.
      </span>
    </div>

    {/* Submit */}
    <button
      type="submit"
      className="bg-[#478aff] h-11 w-full rounded-full text-white font-medium shadow-md hover:bg-blue-600"
    >
     Register
    </button>
  </form>

  {/* Sign up */}
  <p className="text-sm text-center mt-2">
    Don’t have an account?{" "}
    <a className="text-[#7747ff] hover:underline" href="#">Sign up</a>
  </p>
</div>
      {showPopup && (
        <div className="fixed  inset-0 b bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg h-120 w-1/2 max-w-md">
            <h3 className="text-sm font-semibold pt-5 pl-3 text-left">
              Great Almost done !
            </h3>
            <h3 className="text-sm font-semibold border-b-2 pl-3 pb-2 text-left">
              Please Verfiy your mobile number
            </h3>
            <p className="text-center mb-4 text-gray-600">
              Please verify your email and mobile number to proceed.
            </p>
            <div className="flex gap-3 justify-center">
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                Email Link Verification
              </button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                Mobile OTP Verification
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowPopup(false)}
                className="text-red-500 underline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    
    </>
  );
};

export default RegisterForm;
