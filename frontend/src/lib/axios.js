import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5012/api" // local backend
    : `${import.meta.env.VITE_API_URL}/api`; // production backend on Render

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

