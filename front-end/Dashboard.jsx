import React, { useEffect, useState } from "react";
import { getHealthStatus } from "../services/api";

const Dashboard = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHealthStatus();
        setStatus(data);
      } catch (error) {
        console.error("Error fetching health status:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        🌿 TerraSense Dashboard
      </h1>

      {status ? (
        <div className="bg-white shadow-xl rounded-2xl p-6 text-center">
          <p className="text-xl font-semibold text-gray-700">
            {status.message}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Status: {status.status} | Updated:{" "}
            {new Date(status.timestamp).toLocaleString()}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Loading system status...</p>
      )}
    </div>
  );
};

export default Dashboard;
