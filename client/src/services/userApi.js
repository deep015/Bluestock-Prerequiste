import apiClient from "./apiClient";

export const getUsers = async () => {
  const { data } = await apiClient.get("/v1/users");
  return data;
};
