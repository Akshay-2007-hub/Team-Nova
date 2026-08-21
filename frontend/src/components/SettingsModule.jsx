import React, { useState, useEffect } from 'react';

export default function SettingsModule({ isDemo, setIsDemo }) {
  const [config, setConfig] = useState({
    sensitivity: 50,
    brightness_threshold: 200,
    learning_rate: 0.01
  });

  const [saved, setSaved] = useState(false);

  // Fetch current config from backend
  useEffect(() => {
    if (!isDemo) {
      fetch('/api/config')
        .then(res => res.json())
        .then(data => setConfig(data))
        .catch(err => console.error(err));
    }
  }, [isDemo]);

  const handleSave = () => {
    if (isDemo) return;
    
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })
    .then(res => res.json())
    .then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      
      <div className="glass-panel !bg-slate-900 !border-slate-700 p-8 flex flex-col relative overflow-hidden group">
        <h2 className="font-headline-md text-2xl font-bold !text-slate-100 flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-3xl">settings</span>
          System Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* General Preferences */}
          <div className="space-y-6">
             <h3 className="font-bold text-slate-300 uppercase tracking-widest text-sm border-b border-slate-700 pb-2">General Preferences</h3>
             
             <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
               <div>
                 <div className="font-bold text-slate-100">Operation Mode</div>
                 <div className="text-xs text-slate-400 mt-1">Switch between Simulated frontend and Live hardware backend.</div>
               </div>
               <button 
                  onClick={() => setIsDemo(!isDemo)}
                  className={`px-4 py-2 rounded font-bold text-sm transition-all ${isDemo ? 'bg-secondary/20 text-secondary border border-secondary/50' : 'bg-primary/20 text-primary border border-primary/50'}`}
               >
                 {isDemo ? 'DEMO MODE' : 'LIVE MODE'}
               </button>
             </div>

             <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
               <div>
                 <div className="font-bold text-slate-100">Telemetry Storage</div>
                 <div className="text-xs text-slate-400 mt-1">Database connection for historical logs (SQLite).</div>
               </div>
               <div className="px-3 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/50 flex items-center gap-1">
                 <span className="material-symbols-outlined text-xs">check_circle</span> CONNECTED
               </div>
             </div>
             
             <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
               <div>
                 <div className="font-bold text-slate-100">Meteorological API</div>
                 <div className="text-xs text-slate-400 mt-1">Open-Meteo connection for wind and temperature.</div>
               </div>
               <div className="px-3 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/50 flex items-center gap-1">
                 <span className="material-symbols-outlined text-xs">check_circle</span> ONLINE
               </div>
             </div>
          </div>

          {/* Engine Parameters */}
          <div className="space-y-6">
             <h3 className="font-bold text-slate-300 uppercase tracking-widest text-sm border-b border-slate-700 pb-2 flex items-center gap-2">
               <span className="material-symbols-outlined text-sm">tune</span> Engine Parameters
             </h3>
             
             <div className={`space-y-6 p-4 rounded-lg border ${isDemo ? 'bg-slate-800/20 border-slate-800 opacity-50 pointer-events-none' : 'bg-slate-800/50 border-slate-700'}`}>
                
                {isDemo && (
                  <div className="text-xs text-secondary font-bold mb-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">info</span> 
                    Must be in LIVE mode to configure backend engine.
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-slate-400 font-bold">
                    <span>MOG2 Learning Rate</span>
                    <span className="text-primary">{config.learning_rate}</span>
                  </div>
                  <input 
                    type="range" min="0.001" max="0.1" step="0.001" value={config.learning_rate} 
                    onChange={(e) => setConfig({...config, learning_rate: parseFloat(e.target.value)})}
                    className="w-full accent-primary" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-slate-400 font-bold">
                    <span>Detection Sensitivity</span>
                    <span className="text-primary">{config.sensitivity}</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={config.sensitivity} 
                    onChange={(e) => setConfig({...config, sensitivity: parseInt(e.target.value)})}
                    className="w-full accent-primary" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-slate-400 font-bold">
                    <span>Brightness Threshold</span>
                    <span className="text-primary">{config.brightness_threshold}</span>
                  </div>
                  <input 
                    type="range" min="0" max="255" value={config.brightness_threshold} 
                    onChange={(e) => setConfig({...config, brightness_threshold: parseInt(e.target.value)})}
                    className="w-full accent-primary" 
                  />
                </div>

                <button 
                  onClick={handleSave}
                  className="w-full py-3 bg-primary text-on-primary font-bold rounded hover:bg-primary-fixed transition-all"
                >
                  {saved ? 'Saved!' : 'Apply Configuration to Engine'}
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
