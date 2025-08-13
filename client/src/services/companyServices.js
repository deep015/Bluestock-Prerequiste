import axios from "axios";
import {API_BASE} from "../config/api"



// ✅ Fetch company profile
export const getCompanyProfile = async (token) => {
  const res = await axios.get(`${API_BASE}/getCompanyProfile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.company;
};

// ✅ Register new company
export const registerCompany = async ({ token, data }) => {
  const res = await axios.post(`${API_BASE}/register`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
