import os
import time
import threading
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import psutil
from ai_module.healer import AutonomousHealer

app = Flask(__name__)
# Enable CORS so your React frontend running on port 3000/80 can pull data safely
CORS(app)

# Fallback string to connect to a local database container
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/autoheal")
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    db = client.get_database()
    client.server_info()
except Exception:
    db = None

# In-memory application status track matrix
system_status = {"cpu_override": None, "status_override": None}

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Healthy", "engine": "Operational"}), 200

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    # Detect metrics data: Use artificial chaos data if active, otherwise grab real live system loads
    cpu = system_status["cpu_override"] if system_status["cpu_override"] is not None else psutil.cpu_percent()
    memory = psutil.virtual_memory().percent
    status_str = system_status["status_override"] if system_status["status_override"] is not None else "Healthy"
    
    # Map status to a numeric metric value for graph telemetry (1 = Healthy, 0 = Unhealthy)
    status_val = 1 if status_str == "Healthy" else 0

    # DYNAMIC ROUTING: Check if the request is from Prometheus scraping engines
    user_agent = request.headers.get('User-Agent', '').lower()
    if 'prometheus' in user_agent or request.args.get('format') == 'prometheus':
        prometheus_format = (
            f"# HELP autoheal_cpu_percent Current CPU load percentage\n"
            f"# TYPE autoheal_cpu_percent gauge\n"
            f"autoheal_cpu_percent {cpu}\n\n"
            f"# HELP autoheal_memory_percent Current Memory utilization percentage\n"
            f"# TYPE autoheal_memory_percent gauge\n"
            f"autoheal_memory_percent {memory}\n\n"
            f"# HELP autoheal_system_status System status value (1=Healthy, 0=Unhealthy)\n"
            f"# TYPE autoheal_system_status gauge\n"
            f"autoheal_system_status {status_val}\n"
        )
        return prometheus_format, 200, {'Content-Type': 'text/plain; version=0.0.4; charset=utf-8'}

    # DEFAULT ROUTING: Return structured JSON for your React Frontend user interface dashboard
    return jsonify({"cpu": cpu, "memory": memory, "status": status_str}), 200

@app.route('/api/logs', methods=['GET'])
def get_logs():
    return jsonify([
        {"timestamp": time.strftime("%Y-%m-%d %H:%M:%S"), "message": "Telemetry collector active. Tracking cluster states."}
    ]), 200

@app.route('/api/chaos', methods=['POST'])
def trigger_chaos():
    # Simulate a critical infrastructure failure by forcing metrics to spike high
    system_status["cpu_override"] = 94.5
    system_status["status_override"] = "Unhealthy"
    print("[SYSTEM] ALERT! Chaos event injected. System performance degrading rapidly.")
    return jsonify({"message": "Chaos injected successfully. AI engine alerted."}), 200

def reset_system():
    while True:
        time.sleep(15)
        if system_status["status_override"] == "Unhealthy":
            time.sleep(5)  # Let the AI healer background thread process its work logs first
            system_status["cpu_override"] = None
            system_status["status_override"] = "Healthy"
            print("[SYSTEM] Notice: Infrastructure metrics normalized back to safe levels.")

if __name__ == '__main__':
    # Initialize and deploy the automated AI watcher engine loop in a background thread
    healer = AutonomousHealer(system_status)
    threading.Thread(target=healer.monitor_loop, daemon=True).start()
    threading.Thread(target=reset_system, daemon=True).start()
    
    print("[BOOT] Launching AutoHealOps Flask application stack running on port 5000...")
    app.run(host='0.0.0.0', port=5000)