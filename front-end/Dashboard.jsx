import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { motion } from "framer-motion";
import API from "../lib/api";

// Component to handle map clicks to set coordinates
function LocationMarker({ formData, setFormData }) {
  useMapEvents({
    click(e) {
      setFormData({
        ...formData,
        coordinates: {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        },
      });
    },
  });
  return null;
}

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    region: "",
    alertType: "",
    severity: "",
    description: "",
    coordinates: { latitude: 0, longitude: 0 },
  });

  const alertTypes = ["Erosion", "Drought", "Deforestation", "Soil Degradation"];
  const severities = ["Low", "Medium", "High", "Critical"];

  // Fetch alerts from server
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/alerts");
      setAlerts(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to load environmental alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { region, alertType, severity, description, coordinates } = formData;

    if (!region || !alertType || !severity || !description) {
      alert("⚠️ Please fill all fields.");
      return;
    }

    if (
      !coordinates.latitude ||
      !coordinates.longitude ||
      isNaN(coordinates.latitude) ||
      isNaN(coordinates.longitude)
    ) {
      alert("⚠️ Please enter valid coordinates.");
      return;
    }

    try {
      const payload = {
        region,
        alertType,
        severity,
        description,
        coordinates: {
          latitude: parseFloat(coordinates.latitude),
          longitude: parseFloat(coordinates.longitude),
        },
        status: "Active",
        affectedArea: 0,
        reportedBy: "Web Form",
      };

      await API.post("/alerts", payload);

      alert("✅ Alert submitted successfully!");
      setFormData({
        region: "",
        alertType: "",
        severity: "",
        description: "",
        coordinates: { latitude: 0, longitude: 0 },
      });

      fetchAlerts();
    } catch (err) {
      console.error(err.response || err);
      alert("❌ Failed to submit alert");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center mb-8"
      >
        🌍 TerraSense Environmental Dashboard
      </motion.h1>

      {/* Map */}
      <div className="mb-8 flex justify-center">
        <MapContainer
          center={[0.0236, 37.9062]}
          zoom={6}
          className="h-[500px] w-full max-w-6xl rounded-3xl shadow-2xl border border-gray-700"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Show existing alerts */}
          {alerts.map((alert) => (
            <Marker
              key={alert._id}
              position={[alert.coordinates.latitude, alert.coordinates.longitude]}
            >
              <Popup>
                <strong>{alert.region}</strong>
                <br />
                {alert.alertType} - {alert.severity}
              </Popup>
            </Marker>
          ))}

          {/* Clickable map to set coordinates */}
          <LocationMarker formData={formData} setFormData={setFormData} />
        </MapContainer>
      </div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-3xl p-8 shadow-xl mb-10"
      >
        <h2 className="text-3xl font-semibold mb-6 text-emerald-400 text-center">
          Report Environmental Alert
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Region */}
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-emerald-300">Region</label>
            <input
              type="text"
              placeholder="Enter region"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full p-4 rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Alert Type */}
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-emerald-300">Alert Type</label>
            <select
              value={formData.alertType}
              onChange={(e) => setFormData({ ...formData, alertType: e.target.value })}
              className="w-full p-4 rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select alert type</option>
              {alertTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div className="flex flex-col">
            <label className="mb-2 font-bold text-emerald-300">Severity</label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
              className="w-full p-4 rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select severity</option>
              {severities.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col md:col-span-2">
            <label className="mb-2 font-bold text-emerald-300">Description</label>
            <textarea
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-4 rounded-xl text-black font-medium h-32 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Coordinates */}
          <div className="flex flex-col md:col-span-2">
            <label className="mb-2 font-bold text-emerald-300">Coordinates</label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Latitude"
                value={formData.coordinates.latitude || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: { ...formData.coordinates, latitude: parseFloat(e.target.value) },
                  })
                }
                className="w-1/2 p-4 rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <input
                type="number"
                placeholder="Longitude"
                value={formData.coordinates.longitude || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: { ...formData.coordinates, longitude: parseFloat(e.target.value) },
                  })
                }
                className="w-1/2 p-4 rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <p className="text-sm text-gray-400 mt-1">
              You can also click on the map to auto-fill coordinates.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Alert
        </button>
      </motion.form>

      {/* Alerts Display */}
      {loading ? (
        <p className="text-center text-gray-400 text-lg">Loading data...</p>
      ) : alerts.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No active environmental alerts found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alert) => (
            <motion.div
              key={alert._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-3xl p-6 shadow-2xl hover:shadow-emerald-500 transition-all duration-300"
            >
              <h2 className="text-xl font-bold mb-2 text-emerald-400">{alert.region}</h2>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">{alert.alertType}</span> • {alert.severity} severity
              </p>
              <p className="text-gray-200 mb-3">{alert.description}</p>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(alert.updatedAt).toLocaleString("en-US")}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
