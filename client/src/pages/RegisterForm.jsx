// client/src/pages/RegisterForm.jsx
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import InputField from "../components/InputField";
import VerificationPopup from "../components/VerficationPopup";
import { registerUser, verifyEmail } from "../services/authService";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [userId, setUserId] = useState(null);

const handleRegister = async (e) => {
  e.preventDefault();
  setError("");

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    const data = await registerUser({
      name: fullName,
      email,
      phone,
      gender,
      password,
    });

    setUserId(data.userId);

    // ✅ Backend already sent verification link — we just show popup
    setShowPopup(true);

  } catch (err) {
    setError(err.response?.data?.message || "Registration failed");
  }
};


  return (
    <>
      <div className="w-full h-135 px-10 pb-55 flex flex-col gap-6 text-black dark:text-white">
        <h2 className="text-2xl font-bold text-center text-[#1e0e4b] dark:text-white">
         Register as a Company
        </h2>
        {error && <p className="bg-red-100 text-red-600 p-2 rounded">{error}</p>}

        <form onSubmit={handleRegister} className="flex pb-36 flex-col gap-4 w-full">
          <InputField
            label="Full Name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <label className="block font-medium text-sm mb-2">Phone Number</label>
            <PhoneInput
              country={"in"}
              value={phone}
              onChange={setPhone}
              enableSearch
              placeholder="Enter mobile number"
              inputClass="!w-full !h-11 !rounded-lg !border !border-gray-300 shadow-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-sm mb-2">Gender</label>
            <div className="flex gap-2">
              {["Male", "Female", "Other"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`px-4 py-2 rounded-4xl shadow-md text-sm font-medium ${
                    gender === g ? "bg-blue-500 text-white" : "bg-white text-gray-700"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
    <div className="flex flex-row">
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
</div>
          <div className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1 w-6 h-6 accent-blue-500" required />
            <span className="text-gray-600">
              All your information is processed as per our{" "}
              <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a> and{" "}
              <a href="#" className="text-blue-500 hover:underline">Terms of Use</a>.
            </span>
          </div>

          <button
            type="submit"
            className="bg-blue-500 h-8 w-full rounded-full text-white font-medium shadow-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>

          {showPopup && (
      <VerificationPopup
        onClose={() => setShowPopup(false)}
        email={email}
      />
    )}

    </>
  );
}
