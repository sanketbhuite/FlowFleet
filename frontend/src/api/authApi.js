import api from "./axios";

export const fetchDrivers = async () => {
  const res = await api.get("auth/users/");
  return res.data.filter((u) => u.role === "DRIVER");
};
