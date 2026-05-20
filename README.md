# AutoHealOps: Self-Healing Cockpit for Cloud Infrastructure 🚀

An enterprise-grade, full-stack Site Reliability Engineering (SRE) dashboard designed to simulate, detect, and automatically recover from critical microservice failures in real-time. 

* **Live Frontend Interface:** [https://autohealops-frontend.onrender.com](https://autohealops-frontend.onrender.com)
* **Live API Engine Backend:** [https://autohealops-backend.onrender.com](https://autohealops-backend.onrender.com)

---

## 💡 Overview

In massive cloud architectures, manual intervention when a sub-system crashes creates expensive downtime. **AutoHealOps** introduces an autonomous monitoring and self-healing loop. When a fault is deliberately injected via the UI, a containerized automated agent intercepts the failure log, executes custom recovery routines, and restores the system to a `Healthy` state within seconds—completely cutting out human error and middle-of-the-night emergency engineering calls.

---

## 🏗️ System Architecture

The application is built using a decoupled, multi-tier cloud infrastructure:

* **Frontend:** Built using **React** and styled with **Tailwind CSS** to display real-time cluster health statuses, streaming stdout terminal logs, and incident timelines.
* **Backend:** A containerized **Node.js/Python API** handling the telemetry data, anomaly detection loops, and auto-restart automation blocks.
* **Database:** Hosted on a cloud-native **MongoDB Atlas (M0 Shared Cluster)** managing state configurations, environment tracking, and historic error logs.

---

## 🛠️ Key Features

* **Real-Time Telemetry:** Continuous reporting of cluster performance metrics (CPU load, memory allocation) via streaming chart lines.
* **Fault Injection Simulation:** One-click interactive controls to instantly crash background simulated microservices and stress system thresholds.
* **Automated Remediation:** Zero-human mitigation engine that automatically intercepts errors, isolates target container processes, and normalizes cluster bases.
* **Production-Ready Cloud Deployment:** Fully optimized stack deployed via automatic Git-integrated CI/CD pipelines.

---

## ⚙️ Tech Stack

| Layer | Technology Used |
| :--- | :--- |
| **Frontend** | React, Tailwind CSS, Lucide Icons, Recharts, JavaScript (ES6) |
| **Backend** | Python / Node.js, Express, Docker Containerization Platform |
| **Database** | MongoDB Atlas (Cloud NoSQL Cluster) |
| **Hosting & CI/CD** | Render (Web Services Cloud Hosting) |

---

## 🚀 How It Works (The Self-Healing Loop)

1. **Steady State:** The frontend pulls current telemetry statistics from the backend service every 3000ms, yielding a green `HEALTHY` cluster panel.
2. **Failure Trigger:** Clicking the **"Inject Chaos Fault"** button pushes an active failure signature down the pipeline, spiking the CPU load and dropping the environment status to `CRITICAL / UNHEALTHY`.
3. **Detection & Restoration:** The AIOps Watcher engine catches the failure signature, triggers the custom remediation script, isolates container processes, and spins up fresh fallback microservice instances.
4. **Auto-Resolution:** The status updates automatically on the frontend interface, mapping the successful system normalization safely back onto the timeline graph.
