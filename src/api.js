// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://chatwave-backend-9vhe.onrender.com", // ✅ Your deployed backend
  withCredentials: true, // Helps with CORS
});

export default API;

