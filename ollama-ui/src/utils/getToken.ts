export const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken") || "";
    }
    return "";
  };
  