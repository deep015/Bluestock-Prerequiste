import { useMutation } from "@tanstack/react-query";
import api from "./apiClient";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";

export const useLogin = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await api.post("/auth/login", { email, password });
      return data;
    },
    onSuccess: (data) => {
      // Store token in Redux
      dispatch(setCredentials({ token: data.token }));
    },
  });
};
