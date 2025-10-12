import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import API from "../lib/api";

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    region: "",
    alertType: "",
    severity: "",
    description: "",
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    try {
      const res = await API.get("/alerts");
      setAlerts(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to load environmental alerts");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await API.post("/alerts", formData);
      alert("✅ Alert submitted successfully!");
      setFormData({
        region: "",
        alertType: "",
        severity: "",
        description: "",
      });
      fetchAlerts();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit alert");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-800 text-white p-10">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold text-center mb-12 text-emerald-400 tracking-wide"
      >
        🌍 Terrasense Environmental Dashboard
      </motion.h1>

      {/* MAP SECTION */}
      <div className="mb-16 flex justify-center">
        <MapContainer
          center={[0.0236, 37.9062]}
          zoom={6}
          className="h-[550px] w-full max-w-6xl rounded-3xl shadow-[0_0_40px_rgba(16,185,129,0.4)] border border-emerald-400/40"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {alerts.map((alert, i) => (
            <Marker key={i} position={[-1 + i * 0.5, 36 + i * 0.5]}>
              <Popup>
                <strong>{alert.region}</strong>
                <br />
                {alert.alertType} - {alert.severity}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* FORM SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto p-12 bg-gradient-to-br from-slate-900/90 via-emerald-900/80 to-cyan-900/80 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.5)] border border-emerald-500/40 backdrop-blur-xl"
      >
        <h2 className="text-4xl font-bold text-center text-emerald-300 mb-10">
          🚨 Report Environmental Alert
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-10">
            {/* REGION */}
            <div>
              <label className="block text-2xl font-bold text-emerald-300 mb-4 drop-shadow-md">
                Region
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                placeholder="Enter affected region (e.g., Nairobi, Kisumu...)"
                className="w-full p-6 text-xl bg-slate-800/70 border-2 border-emerald-500/60 rounded-3xl text-gray-100 placeholder-gray-400 focus:ring-4 focus:ring-emerald-400 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* ALERT TYPE */}
            <div>
              <label className="block text-2xl font-bold text-emerald-300 mb-4 drop-shadow-md">
                Alert Type
              </label>
              <select
                name="alertType"
                value={formData.alertType}
                onChange={handleChange}
                required
                className="w-full p-6 text-xl bg-slate-800/70 border-2 border-emerald-500/60 rounded-3xl text-gray-100 focus:ring-4 focus:ring-emerald-400 focus:border-emerald-500 outline-none transition-all"
              >
                <option value="">Select Type</option>
                <option value="Flood">🌊 Flood</option>
                <option value="Drought">☀️ Drought</option>
                <option value="Wildfire">🔥 Wildfire</option>
                <option value="Air Pollution">🌫️ Air Pollution</option>
                <option value="Deforestation">🌲 Deforestation</option>
              </select>
            </div>
          </div>

          {/* SEVERITY */}
          <div>
            <label className="block text-2xl font-bold text-emerald-300 mb-4 drop-shadow-md">
              Severity
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              required
              className="w-full p-6 text-xl bg-slate-800/70 border-2 border-emerald-500/60 rounded-3xl text-gray-100 focus:ring-4 focus:ring-emerald-400 focus:border-emerald-500 outline-none transition-all"
            >
              <option value="">Select Severity</option>
              <option value="Low">🟢 Low</option>
              <option value="Moderate">🟡 Moderate</option>
              <option value="High">🔴 High</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-2xl font-bold text-emerald-300 mb-4 drop-shadow-md">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the issue (e.g., severe flooding in lowlands, smoke from nearby fires...)"
              rows={5}
              className="w-full p-6 text-xl bg-slate-800/70 border-2 border-emerald-500/60 rounded-3xl text-gray-100 placeholder-gray-400 focus:ring-4 focus:ring-emerald-400 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          {/* SUBMIT */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full md:w-2/3 py-5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold text-2xl rounded-3xl shadow-[0_0_25px_rgba(16,185,129,0.7)] transition-all duration-300"
            >
              🚀 Submit Alert
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* ALERT LIST */}
      {loading ? (
        <p className="text-center text-gray-400 mt-10">Loading data...</p>
      ) : alerts.length === 0 ? (
        <p className="text-center text-gray-400 mt-10">
          No active environmental alerts found.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-16">
          {alerts.map((alert) => (
            <motion.div
              key={alert._id}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/80 border border-emerald-600/40 rounded-3xl p-6 shadow-lg hover:shadow-emerald-500/20 transition-all"
            >
              <h2 className="text-2xl font-semibold text-emerald-300 mb-3">
                {alert.region}
              </h2>
              <p className="text-lg text-gray-300 mb-2">
                {alert.alertType} • {alert.severity}
              </p>
              <p className="text-gray-200 mb-3">{alert.description}</p>
              <p className="text-sm text-gray-500">
                Updated: {new Date(alert.updatedAt).toLocaleString("en-US")}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
