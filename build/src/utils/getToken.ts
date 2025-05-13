import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  username: string;
  role: string;
  exp: number;
};

export const getToken = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken") || "";
  }
  return "";
};

export const getUserInfo = (): DecodedToken | null => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (err) {
    console.error("❌ Failed to decode token:", err);
    return null;
  }
};
