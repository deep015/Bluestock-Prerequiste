import axios from "axios";
import {API_BASE} from "../config/api";

// 1️⃣ Register user
export const registerUser = async (formData) => {
  try {
    const res = await axios.post(`${API_BASE}/register`, formData);

    // If backend returns { data: { token, user } }
    if (res.data?.data) {
      return {
        token: res.data.data.token,
        user: res.data.data.user,
        message: res.data.message,
      };
    }
    return res.data; // Expecting { token, user, message }
  } catch (err) {
    throw err.response?.data || { message: "Registration failed" };
  }
};

// 2️⃣ Login user (normalize shape)
export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, credentials);
    console.log("Backend response:", res.data);

    const token = res.data.token;

    if (!token) {
      throw { message: "Invalid login response from server" };
    }

    // Return token only; user is optional or fetched later
    return { token, user: null }; 
  } catch (err) {
    console.error("Login request failed:", err.response?.data || err.message);
    throw err.response?.data || { message: err.message || "Login failed" };
  }
};



// 3️⃣ Verify email
export const verifyEmail = async (token) => {
  try {
    const res = await axios.post(`${API_BASE}/verify-email`, { token });
    return res.data; // Expecting { message }
  } catch (err) {
    throw err.response?.data || { message: "Email verification failed" };
  }
};

// 4️⃣ Verify mobile OTP
export const verifyMobile = async ({ userId, otp }) => {
  try {
    const res = await axios.post(`${API_BASE}/verify-mobile`, { userId, otp });
    return res.data; // Expecting { message }
  } catch (err) {
    throw err.response?.data || { message: "Mobile verification failed" };
  }
};
