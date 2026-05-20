import React, { useState, useEffect } from 'react';

function App() {
  const [metrics, setMetrics] = useState({ cpu: 0, memory: 0, status: "Healthy" });

  // Define your live backend URL once at the top of your component
  const BACKEND_URL = "https://autohealops-backend.onrender.com";

  useEffect(() => {
    const fetchData = () => {
      // Fetches live data from https://autohealops-backend.onrender.com/api/metrics
      fetch(`${BACKEND_URL}/api/metrics`)
        .then(res => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then(data => setMetrics(data))
        .catch(err => console.log("Waiting for backend API...", err));
    };
    
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerChaos = () => {
    // Triggers chaos simulation via POST to your live backend endpoint
    fetch(`${BACKEND_URL}/api/chaos`, { method: 'POST' })
      .then(res => res.json())
      .then(data => alert(data.message))
      .catch(err => console.log("Chaos injection error: ", err));
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>AutoHealOps Self-Healing Cockpit</h1>
        <p>Enterprise SRE Monitoring Dashboard</p>
      </div>
      <div className="grid">
        <div className="card">
          <h2>System Infrastructure Health</h2>
          <p>Status: <span className={metrics.status === "Healthy" ? "badge-healthy" : "badge-unhealthy"}>{metrics.status}</span></p>
          <p>Engine CPU Load: <strong>{metrics.cpu}%</strong></p>
          <p>Allocated RAM Usage: <strong>{metrics.memory}%</strong></p>
          <button onClick={triggerChaos}>Simulate Microservice Failure</button>
        </div>
      </div>
    </div>
  );
}

export default App;