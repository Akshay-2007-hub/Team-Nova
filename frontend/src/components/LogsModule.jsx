import React, { useState, useEffect } from 'react';

export default function LogsModule({ liveData }) {
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    if (liveData && liveData.backendStatus) { // Only log if there's actual data
      setLogs(prev => {
        const timeStr = new Date().toLocaleTimeString();
        const newLogs = [...prev, `[${timeStr}] SYSTEM TICK - PM2.5: ${liveData.pm25}, Risk: ${liveData.riskScore}, Status: ${liveData.backendStatus}`];
        // Keep last 50 logs
        return newLogs.slice(-50);
      });
    }
  }, [liveData]);

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      
      <div className="glass-panel !bg-slate-900 !border-slate-700 p-8 flex flex-col relative overflow-hidden group h-[75vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline-md text-2xl font-bold !text-slate-100 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
            Live System Logs
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-label-mono text-green-500">STREAMING</span>
          </div>
        </div>
        
        <div className="flex-1 bg-black/80 rounded border border-slate-800 p-4 font-label-mono text-xs overflow-y-auto flex flex-col">
          {logs.length === 0 ? (
            <div className="text-slate-600 m-auto text-center">
               Awaiting telemetry stream... <br/> (Make sure you are in LIVE mode)
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-slate-500">VayuMitra X Unified Logging Subsystem v2.1.0</div>
              <div className="text-slate-500 mb-4">Initializing connection to internal memory bus... OK</div>
              
              {logs.map((log, index) => (
                <div key={index} className={`${log.includes('CRITICAL') || log.includes('HIGH') ? 'text-error' : log.includes('MODERATE') ? 'text-tertiary' : 'text-green-400'}`}>
                  {log}
                </div>
              ))}
              <div className="animate-pulse text-slate-500 mt-2">_</div>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex gap-4">
           <button 
             onClick={() => setLogs([])}
             className="px-4 py-2 bg-slate-800 text-slate-300 rounded font-bold hover:bg-slate-700 transition-all text-sm"
           >
             Clear Terminal
           </button>
           <button 
             onClick={() => {
               const logText = ["VayuMitra X Unified Logging Subsystem v2.1.0\n", ...logs].join("\n");
               const blob = new Blob([logText], { type: 'text/plain' });
               const url = URL.createObjectURL(blob);
               const a = document.createElement('a');
               a.href = url;
               a.download = `vayumitra_logs_${new Date().getTime()}.txt`;
               document.body.appendChild(a);
               a.click();
               document.body.removeChild(a);
               URL.revokeObjectURL(url);
             }}
             className="px-4 py-2 bg-slate-800 text-slate-300 rounded font-bold hover:bg-slate-700 transition-all text-sm flex items-center gap-2"
           >
             <span className="material-symbols-outlined text-sm">download</span> Download Log Dump
           </button>
        </div>
      </div>
    </div>
  );
}
