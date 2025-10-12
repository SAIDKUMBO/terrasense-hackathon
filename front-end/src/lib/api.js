// src/lib/api.js OR src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://terrasense-hackathon-2.onrender.com/api", // 👈 use your live backend URL
});

export default API;
