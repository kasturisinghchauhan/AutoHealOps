# AutoHealOps: Self-Healing Cockpit for Cloud Infrastructure 🚀

An enterprise-grade, full-stack Site Reliability Engineering (SRE) dashboard designed to simulate, detect, and automatically recover from critical microservice failures in real-time. 

Live Application: [https://autohealops-frontend.onrender.com](https://autohealops-frontend.onrender.com)

---

## 💡 Overview

In massive cloud architectures (like Netflix or Google), manual intervention when a sub-system crashes creates expensive downtime. **AutoHealOps** introduces an autonomous monitoring and self-healing loop. When a fault is deliberately injected via the UI, a containerized automated agent intercepts the failure log, executes custom recovery routines, and restores the system to a `Healthy` state within seconds—completely cutting out human error and middle-of-the-night emergency engineering calls.

---

## 🏗️ System Architecture

The application is built using a decoupled, multi-tier cloud infrastructure:

* **Frontend:** Built using **React** to display real-time cluster health statuses and resource loads (CPU/RAM).
* **Backend:** A containerized **Python API** running inside a **Docker environment** handling the telemetry data, anomaly detection loops, and auto-restart automation blocks.
* **Database:** Hosted on a cloud-native **MongoDB Atlas (M0 Shared Cluster)** cluster managing state configurations, environment tracking, and historic error logs.

---

## 🛠️ Key Features

* **Real-Time Telemetry:** Continuous reporting of synthetic cluster metrics (CPU load, memory allocation).
* **Fault Injection Simulation:** Interactive controls to instantly crash background simulated microservices.
* **Automated Remediation:** Zero-human mitigation script that drops corrupted caches, re-allocates memory bounds, and verifies database handshakes.
* **Production-Ready Cloud Deployment:** Fully containerized stack deployed via active CI/CD pipelines.

---

## ⚙️ Tech Stack

| Layer | Technology Used |
| :--- | :--- |
| **Frontend** | React, CSS3, JavaScript (ES6) |
| **Backend** | Python, Docker (Containerization Platform) |
| **Database** | MongoDB Atlas (Cloud NoSQL) |
| **Hosting & Cloud Infrastructure** | Render (Web Services Hosting Platform) |

---

## 🚀 How It Works (The Self-Healing Loop)

1. **Steady State:** The frontend pulls current metrics from the Python backend service, yielding a green `Healthy` cluster banner.
2. **Failure Trigger:** Clicking the "Simulate Microservice Failure" button changes the mock system health status to `Critical`.
3. **Detection & Restoration:** The Python backend hooks into the state loop, isolates the failure reason, wipes state anomalies, and updates the shared memory buffer.
4. **Auto-Resolution:** The status updates automatically on the interface back to `Healthy` seamlessly.
