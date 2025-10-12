// ../lib/api.js
import axios from "axios";

// Set your backend URL here
const API = axios.create({
  baseURL: "http://localhost:5000/api", // <-- Make sure this matches your backend port
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
