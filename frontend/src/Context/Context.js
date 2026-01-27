import React from "react";
export const UserContext = React.createContext(null);
export const API_BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
console.log("API URL:", API_BACKEND_URL);
export default UserContext;