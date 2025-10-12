import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Dashboard from "./pages/Dashboard"; // keep this import
import React from "react";

// Home page with the “Get Started” button
function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center p-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-extrabold mb-6"
      >
        🌍 Terrasense Dashboard
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-lg text-gray-300 mb-8 text-center max-w-lg"
      >
        Real-time insights for environmental monitoring.  
        View live data, analytics, and reports on air quality, deforestation, and sustainability.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/dashboard")}
        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-lg transition-all"
      >
        Get Started
      </motion.button>
    </div>
  );
}

// Main app router
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
