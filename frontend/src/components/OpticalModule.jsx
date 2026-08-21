import React from 'react';
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import WebcamSensor from './WebcamSensor';

export default function OpticalModule({ isDemo, liveData, setIsDemo, setLiveData, isCameraOn = true }) {
  const data = liveData || {};

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="glass-panel !bg-slate-900 !border-slate-700 p-6 flex justify-between items-center">
        <div>
          <h2 className="font-headline-md text-2xl font-bold !text-slate-100 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">visibility</span>
            Optical Sensor Analysis
          </h2>
          <p className="text-slate-400 mt-1">Raw Computer Vision Telemetry & Diagnostics</p>
        </div>
        
        <div className={`px-4 py-2 rounded-full border font-bold text-sm flex items-center gap-2 ${data.backendStatus === 'HIGH' ? 'bg-error/20 border-error/50 text-error' : data.backendStatus === 'MODERATE' ? 'bg-tertiary/20 border-tertiary/50 text-tertiary' : data.backendStatus === 'NOMINAL' ? 'bg-secondary/20 border-secondary/50 text-secondary' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
          <span className={`w-2 h-2 rounded-full ${data.backendStatus === 'HIGH' ? 'bg-error animate-ping' : data.backendStatus === 'MODERATE' ? 'bg-tertiary' : data.backendStatus === 'NOMINAL' ? 'bg-secondary' : 'bg-slate-500'}`}></span>
          {data.backendStatus || 'OFFLINE'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Camera Feed */}
        <div className="lg:col-span-2 glass-panel !bg-slate-900 !border-slate-700 overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <span className="font-label-mono font-bold text-slate-300">LIVE FEED : CAMERA 01</span>
            <span className="text-xs text-primary animate-pulse font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">fiber_manual_record</span> RECORDING
            </span>
          </div>
          <div className="flex-1 relative bg-black">
            {!isCameraOn ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">videocam_off</span>
                <p>Camera feed disabled by user.</p>
              </div>
            ) : !isDemo ? (
              <img 
                src="/api/video-feed" 
                className="absolute inset-0 w-full h-full object-contain" 
                alt="Backend Video Feed" 
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">videocam_off</span>
                <p>System in Demo Mode. Switch to LIVE to view feed.</p>
              </div>
            )}
            
            {/* Overlay HUD */}
            {!isDemo && (
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="bg-black/60 backdrop-blur px-3 py-1 rounded text-xs font-label-mono text-primary border border-primary/30">
                  FPS: ~30.0
                </div>
                <div className="bg-black/60 backdrop-blur px-3 py-1 rounded text-xs font-label-mono text-secondary border border-secondary/30">
                  RES: 640x480
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Telemetry Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel !bg-slate-900 !border-slate-700 p-6">
             <h3 className="font-label-mono text-sm text-slate-400 font-bold mb-4 uppercase">Raw Data Feed</h3>
             <div className="space-y-4">
               <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                 <span className="text-slate-300">Particle Count</span>
                 <span className="font-display-lg text-2xl text-primary font-bold">{data.particleCount || 0}</span>
               </div>
               <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                 <span className="text-slate-300">Scatter Ratio</span>
                 <span className="font-display-lg text-2xl text-secondary font-bold">{data.scatterPercentage || 0}%</span>
               </div>
               <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                 <span className="text-slate-300">Brightness (Mean)</span>
                 <span className="font-display-lg text-2xl text-slate-100 font-bold">{data.brightness || 0}</span>
               </div>
               <div className="flex justify-between items-end">
                 <span className="text-slate-300">Temporal Variance</span>
                 <span className="font-display-lg text-2xl text-tertiary font-bold">{data.temporalVariation || 0}</span>
               </div>
             </div>
          </div>

          <div className="glass-panel !bg-slate-900 !border-slate-700 p-6">
             <h3 className="font-label-mono text-sm text-slate-400 font-bold mb-4 uppercase flex items-center gap-2">
               <span className="material-symbols-outlined text-primary text-sm">tune</span> 
               Engine Configuration
             </h3>
             <div className="space-y-6">
               <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-slate-400 font-bold">
                    <span>Detection Sensitivity</span>
                    <span className="text-primary">0-100</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" defaultValue="50" 
                    onChange={(e) => fetch('/api/config', {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({sensitivity: parseInt(e.target.value)})
                    })}
                    className="w-full accent-primary" 
                    disabled={isDemo}
                  />
               </div>
               <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-slate-400 font-bold">
                    <span>MOG2 Brightness Threshold</span>
                    <span className="text-secondary">0-255</span>
                  </div>
                  <input 
                    type="range" min="0" max="255" defaultValue="200" 
                    onChange={(e) => fetch('/api/config', {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({brightness_threshold: parseInt(e.target.value)})
                    })}
                    className="w-full accent-secondary"
                    disabled={isDemo} 
                  />
               </div>
             </div>
          </div>
        </div>
        
      </div>
      
      {/* Real-time Optical Trend */}
      <div className="glass-panel !bg-slate-900 !border-slate-700 p-6 h-[300px] flex flex-col">
          <h3 className="font-headline-md text-lg font-bold !text-slate-100 mb-4">Optical Deviation Trend</h3>
          <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.history || []} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="opticalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.1} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#f8fafc',
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="anomaly" name="Optical Score" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#opticalGrad)" activeDot={{ r: 6 }} />
                </AreaChart>
             </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
}
