import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Server, Terminal, ShieldAlert, Cpu, 
  Layers, HardDrive, Play, RefreshCw, CheckCircle, 
  AlertTriangle, Clock, ChevronRight, LayoutDashboard, Settings, Radio
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

function App() {
  const [metrics, setMetrics] = useState({ cpu: 24, memory: 42, status: "Healthy" });
  const [history, setHistory] = useState([]);
  const [logs, setLogs] = useState([
    { ts: "00:00:01", msg: "AutoHealOps Daemon initializing core system loops...", type: "info" },
    { ts: "00:00:02", msg: "Connection established with MongoDB Atlas cluster.", type: "success" },
    { ts: "00:00:03", msg: "Telemetry sync engine online. Active tracking enabled.", type: "info" }
  ]);
  const [incidents, setIncidents] = useState([
    { id: 1, time: "10 mins ago", event: "Cluster Health Checked", desc: "All nodes reporting green", status: "resolved" }
  ]);
  const [isInjecting, setIsInjecting] = useState(false);
  const terminalEndRef = useRef(null);

  const BACKEND_URL = "https://autohealops-backend.onrender.com";

  // Auto-scroll terminal logs to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Telemetry loop
  useEffect(() => {
    const fetchData = () => {
      fetch(`${BACKEND_URL}/api/metrics`)
        .then(res => {
          if (!res.ok) throw new Error("API Offline");
          return res.json();
        })
        .then(data => {
          setMetrics(data);
          
          // Append data to timeline graph history
          setHistory(prev => {
            const newHistory = [...prev, {
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              cpu: data.cpu,
              memory: data.memory
            }];
            if (newHistory.length > 7) newHistory.shift();
            return newHistory;
          });

          // Generate synthetic operational logs
          if (data.status === "Healthy") {
            const normalLogs = [
              "Telemetry tick acknowledged by cluster coordinator.",
              "Health status verified across microservice slices.",
              "Memory buffers clearing normally. Zero leaks detected."
            ];
            const randomLog = normalLogs[Math.floor(Math.random() * normalLogs.length)];
            setLogs(prev => [...prev, { ts: new Date().toLocaleTimeString(), msg: randomLog, type: "info" }]);
          }
        })
        .catch(err => {
          console.log("Telemetry link sync waiting...", err);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Intercepting metrics changes to trigger auto-heal log visualizations
  useEffect(() => {
    if (metrics.status === "Unhealthy") {
      setLogs(prev => [
        ...prev,
        { ts: new Date().toLocaleTimeString(), msg: "CRITICAL: High CPU Threshold Exceeded on Cluster Slice 01!", type: "error" },
        { ts: new Date().toLocaleTimeString(), msg: "AIOps Watcher engine intercepting failure signatures...", type: "warn" },
        { ts: new Date().toLocaleTimeString(), msg: "Remediation Script triggered: Isolating target container processes.", type: "warn" }
      ]);
      
      setIncidents(prev => [
        { id: Date.now(), time: "Just now", event: "Container CPU Cap Breached", desc: "Auto-healing script active", status: "active" },
        ...prev
      ]);
    } else if (metrics.status === "Healthy" && history.length > 1 && history[history.length - 2]?.cpu > 80) {
      setLogs(prev => [
        ...prev,
        { ts: new Date().toLocaleTimeString(), msg: "SUCCESS: Mitigations applied. Containers fully restarted.", type: "success" },
        { ts: new Date().toLocaleTimeString(), msg: "System metrics normalized safely back to cluster base thresholds.", type: "success" }
      ]);
      setIncidents(prev => {
        const updated = [...prev];
        if (updated[0]) {
          updated[0].status = "resolved";
          updated[0].desc = "Mitigations successful in 5.2s";
        }
        return updated;
      });
    }
  }, [metrics.status]);

  const triggerChaos = () => {
    setIsInjecting(true);
    fetch(`${BACKEND_URL}/api/chaos`, { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        setTimeout(() => setIsInjecting(false), 2000);
      })
      .catch(err => {
        console.error(err);
        setIsInjecting(false);
      });
  };

  const isHealthy = metrics.status === "Healthy";

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 font-sans flex overflow-hidden">
      
      {/* 1. SIDEBAR NAVIGATION PANEL */}
      <aside className="w-64 bg-[#0F1626] border-r border-slate-800/60 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-800/40 gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-slate-100 tracking-tight leading-none text-sm">AutoHealOps</h1>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider">v2.4 ENTERPRISE</span>
            </div>
          </div>
          <nav className="p-4 space-y-1.5">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/40 text-indigo-400 text-sm font-medium border border-slate-700/30">
              <LayoutDashboard className="h-4 w-4" /> Cockpit Panel
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/20 hover:text-slate-200 text-sm font-medium transition">
              <Server className="h-4 w-4" /> Node Topology
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/20 hover:text-slate-200 text-sm font-medium transition">
              <Terminal className="h-4 w-4" /> Cluster Shell
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800/20 hover:text-slate-200 text-sm font-medium transition">
              <Settings className="h-4 w-4" /> Policy Configurations
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800/40 bg-[#0C1220]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-indigo-400">LPU</div>
            <div>
              <p className="text-xs font-medium text-slate-300">SRE Operator Mode</p>
              <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span> Connected Cloud
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* WORKSPACE AREA CONTAINER */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* 2. TOPBAR MANAGEMENT HEADER */}
        <header className="h-16 bg-[#0F1626]/80 backdrop-blur-md border-b border-slate-800/40 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-semibold text-slate-100">Infrastructure Operations Center</h2>
            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              <span>Telemetry Sync Syncing Every 3000ms</span>
            </div>
          </div>

          <div>
            <button 
              onClick={triggerChaos}
              disabled={isInjecting || !isHealthy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all border shadow-lg ${
                !isHealthy 
                  ? "bg-rose-950/20 text-rose-400 border-rose-800/40 cursor-not-allowed"
                  : isInjecting 
                    ? "bg-amber-600 text-white border-amber-500 animate-pulse"
                    : "bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white border-rose-500 shadow-rose-950/20 hover:shadow-rose-600/20 active:scale-[0.98]"
              }`}
            >
              {isInjecting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
              {!isHealthy ? " remediation system active" : "Inject Chaos Fault"}
            </button>
          </div>
        </header>

        {/* MAIN DASHBOARD CONTENT GRID */}
        <main className="p-6 space-y-6 max-w-[1600px] w-full mx-auto">
          
          {/* 3. METRIC CARDS & SERVICE HEALTH MATRIX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* CARD 1: GLOBAL STATE INDICATOR */}
            <div className={`p-5 rounded-xl border backdrop-blur-md transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-32 ${
              isHealthy 
                ? "bg-emerald-950/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.03)]" 
                : "bg-rose-950/10 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.03)]"
            }`}>
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full opacity-[0.02] bg-current"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">System Status</span>
                {isHealthy ? <CheckCircle className="h-5 w-5 text-emerald-400" /> : <AlertTriangle className="h-5 w-5 text-rose-400 animate-bounce" />}
              </div>
              <div>
                <div className={`text-2xl font-bold tracking-tight mb-0.5 ${isHealthy ? "text-emerald-400" : "text-rose-400"}`}>
                  {metrics.status.toUpperCase()}
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  {isHealthy ? "Autonomous Healer Standing By" : "Remediation Subroutines Running"}
                </p>
              </div>
            </div>

            {/* CARD 2: CPU LOAD METRIC */}
            <div className="p-5 rounded-xl border border-slate-800/60 bg-[#131A2C]/40 backdrop-blur-md flex flex-col justify-between h-32">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Engine CPU Load</span>
                <Cpu className={`h-4 w-4 ${isHealthy ? "text-indigo-400" : "text-rose-400 animate-pulse"}`} />
              </div>
              <div>
                <div className="text-3xl font-mono font-bold text-white tracking-tight">
                  {metrics.cpu}<span className="text-sm font-sans text-slate-400 ml-1">%</span>
                </div>
                <div className="w-full bg-slate-800/60 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${metrics.cpu > 80 ? 'bg-gradient-to-r from-rose-500 to-red-500' : 'bg-gradient-to-r from-indigo-500 to-blue-500'}`}
                    style={{ width: `${metrics.cpu}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* CARD 3: MEMORY METRIC */}
            <div className="p-5 rounded-xl border border-slate-800/60 bg-[#131A2C]/40 backdrop-blur-md flex flex-col justify-between h-32">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">RAM Allocation</span>
                <HardDrive className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-3xl font-mono font-bold text-white tracking-tight">
                  {metrics.memory}<span className="text-sm font-sans text-slate-400 ml-1">%</span>
                </div>
                <div className="w-full bg-slate-800/60 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${metrics.memory}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* CARD 4: INFRASTRUCTURE CONTEXT MAP */}
            <div className="p-5 rounded-xl border border-slate-800/60 bg-[#131A2C]/40 backdrop-blur-md flex flex-col justify-between h-32">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Deployment Runtime</span>
                <Layers className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-100 tracking-tight">Render Cloud Cluster</div>
                <p className="text-xs text-indigo-400 font-mono mt-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block"></span> Isolated Docker Env
                </p>
              </div>
            </div>

          </div>

          {/* 4. REAL-TIME GRAPH TELEMETRY ANALYSIS */}
          <div className="p-5 rounded-xl border border-slate-800/60 bg-[#131A2C]/30 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-200">Real-Time Operations Telemetry</h3>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block"></span> CPU Load
                </span>
                <span className="flex items-center gap-1.5 text-purple-400">
                  <span className="h-2 w-2 rounded-full bg-purple-500 inline-block"></span> Memory Usage
                </span>
              </div>
            </div>
            <div className="h-64 w-full">
              {history.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center text-xs text-slate-500 font-mono">
                  Assembling runtime metric streaming buffers...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F1626', borderColor: '#334155', color: '#F1F5F9', fontSize: '11px', fontFamily: 'monospace' }} />
                    <Area type="monotone" dataKey="cpu" stroke="#6366f1" fillOpacity={0.1} fill="url(#colorCpu)" strokeWidth={2} />
                    <Area type="monotone" dataKey="memory" stroke="#a855f7" fillOpacity={0.05} fill="url(#colorMem)" strokeWidth={2} />
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* LOWER GRID: LIVE LOGS TERMINAL & INCIDENT ACTIVITY TIMELINE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 5. LIVE LOGS TERMINAL-STYLE PANEL */}
            <div className="lg:col-span-2 p-5 rounded-xl border border-slate-800/60 bg-[#0A0E17] flex flex-col h-[350px]">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-slate-200 font-mono">Live Central Event Streaming</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Tailing Stdout</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto font-mono text-xs space-y-1.5 pr-2 custom-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="leading-relaxed flex items-start gap-2 select-text">
                    <span className="text-slate-600 shrink-0">[{log.ts}]</span>
                    <span className={
                      log.type === "error" ? "text-rose-400 font-semibold" :
                      log.type === "warn" ? "text-amber-400" :
                      log.type === "success" ? "text-emerald-400" : "text-slate-300"
                    }>
                      {log.type === "error" && "🚨 "}
                      {log.type === "success" && "✔ "}
                      {log.msg}
                    </span>
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            </div>

            {/* 6. AUTO-HEALING ACTIVITY TIMELINE */}
            <div className="p-5 rounded-xl border border-slate-800/60 bg-[#131A2C]/30 backdrop-blur-md flex flex-col h-[350px]">
              <div className="flex items-center gap-2 border-b border-slate-800/40 pb-3 mb-4">
                <ShieldAlert className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-200">Incident Recovery Engine Activity</h3>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {incidents.map((incident) => (
                  <div key={incident.id} className="relative pl-6 pb-2 border-l border-slate-800 last:border-0 last:pb-0">
                    <div className={`absolute top-0.5 left-0 -translate-x-1/2 h-2.5 w-2.5 rounded-full border-2 ${
                      incident.status === 'active' 
                        ? 'bg-rose-500 border-rose-950 animate-ping' 
                        : 'bg-emerald-400 border-emerald-950'
                    }`} />
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className={`font-semibold ${incident.status === 'active' ? 'text-rose-400' : 'text-slate-200'}`}>
                        {incident.event}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" /> {incident.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{incident.desc}</p>
                    <div className="mt-1.5 flex items-center text-[10px] text-indigo-400 font-mono font-medium tracking-wide uppercase">
                      Subroutine Loop Logs <ChevronRight className="h-3 w-3 ml-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default App;