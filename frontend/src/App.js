import React, { useState, useEffect } from 'react';

function App() {
  const [metrics, setMetrics] = useState({ cpu: 0, memory: 0, status: "Healthy" });

  useEffect(() => {
    const fetchData = () => {
      // Use the environment variable fallback smoothly
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:80';
      
      fetch(`${backendUrl}/api/metrics`)
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
    const BACKEND_URL = "https://autohealops.onrender.com";
    
    fetch(`${backendUrl}/api/chaos`, { method: 'POST' })
      .then(res => res.json())
      .then(data => alert(data.message))
      .catch(err => console.log(err));
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