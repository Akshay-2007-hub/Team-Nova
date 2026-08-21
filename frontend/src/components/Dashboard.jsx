import React, { useState, useEffect, useRef } from 'react';
import WebcamSensor from './WebcamSensor';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Tilt from 'react-parallax-tilt';
import toast from 'react-hot-toast';

export default function Dashboard({ isDemo, setIsDemo, simulation, liveData, setLiveData, isCameraOn = true }) {
  const { data: simData } = simulation;
  const data = (!isDemo && liveData) ? { ...simData, ...liveData } : simData;

  const maxDash = 283;
  const riskOffset = maxDash - (maxDash * (data.riskScore / 100));

  const getRiskText = (score) => {
    if (score > 85) return { text: "CRITICAL RISK", color: "text-error", bg: "bg-error/10", border: "border-error/20" };
    if (score > 60) return { text: "MODERATE-HIGH", color: "text-tertiary", bg: "bg-tertiary/10", border: "border-tertiary/20" };
    if (score > 40) return { text: "MODERATE RISK", color: "text-tertiary", bg: "bg-tertiary/10", border: "border-tertiary/20" };
    return { text: "NORMAL RISK", color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" };
  };

  const getRiskStroke = (score) => {
    if (score > 85) return "var(--color-error)";
    if (score > 40) return "var(--color-tertiary)";
    return "var(--color-secondary)";
  };

  const riskStyle = getRiskText(data.riskScore);

  const prevDeviation = useRef(data.opticalDeviation);
  useEffect(() => {
    if (data.opticalDeviation > 60 && prevDeviation.current <= 60) {
      toast.error('Atmospheric Anomaly Detected!', {
        icon: '⚠️',
        style: {
          border: '1px solid var(--color-error)',
          padding: '16px',
        }
      });
    }
    prevDeviation.current = data.opticalDeviation;
  }, [data.opticalDeviation]);

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      
      {/* Hero / Key Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Risk Score */}
        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500} className="glass-panel !bg-slate-900 !border-slate-700 p-8 flex flex-col items-center justify-center lg:col-span-1 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50 group-hover:to-slate-900/80 transition-colors"></div>
          <h2 className="font-headline-md text-lg font-bold !text-slate-100 mb-6 relative z-10">Atmospheric Risk Score</h2>
          
          <div className="relative w-56 h-56 flex items-center justify-center z-10">
            <svg className="w-full h-full transform -rotate-90 transition-all duration-1000" viewBox="0 0 100 100">
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <circle cx="50" cy="50" fill="none" r="42" stroke="var(--color-surface-variant)" strokeWidth="10"></circle>
              <circle cx="50" cy="50" fill="none" r="42" 
                      stroke={getRiskStroke(data.riskScore)} 
                      strokeDasharray="264" 
                      strokeDashoffset={264 - (264 * (data.riskScore / 100))} 
                      strokeLinecap="round" 
                      strokeWidth="10" 
                      className="transition-all duration-1000 ease-out"
                      filter="url(#glow)">
              </circle>
            </svg>
            <div className="absolute flex flex-col items-center text-center mt-2">
              <span className={`font-display-lg text-6xl font-bold tracking-tighter ${riskStyle.color} drop-shadow-md`}>{data.riskScore}</span>
              <span className="font-label-mono text-xs text-on-surface-variant uppercase tracking-widest mt-1">out of 100</span>
            </div>
          </div>
          
          <div className={`mt-8 px-6 py-2 ${riskStyle.bg} border ${riskStyle.border} rounded-full transition-colors relative z-10 backdrop-blur-md`}>
            <span className={`font-label-mono text-sm font-semibold tracking-wider ${riskStyle.color}`}>{riskStyle.text}</span>
          </div>
        </Tilt>

        {/* Key Telemetry Bento Box */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="glass-panel !bg-slate-900 !border-slate-700 p-6 flex flex-col justify-between group relative overflow-hidden">
             <div className="flex justify-between items-start">
               <span className="font-label-mono text-sm !text-slate-300 font-bold uppercase tracking-wider">PM 2.5 Estimate</span>
               <span className="material-symbols-outlined text-outline/50 group-hover:text-primary transition-colors">air</span>
             </div>
             <div>
               <div className={`font-display-lg text-4xl mt-4 font-bold ${data.pm25 > 150 ? 'text-error' : data.pm25 > 50 ? 'text-tertiary' : 'text-secondary'}`}>
                 {data.pm25 || 15} <span className="text-sm font-body-md text-slate-500">µg/m³</span>
               </div>
               <div className="text-sm !text-slate-400 mt-1 font-bold">
                 {data.pm25 > 150 ? 'Unhealthy' : data.pm25 > 50 ? 'Moderate' : 'Good'} Air Quality
               </div>
             </div>
          </div>

          <div className="glass-panel !bg-slate-900 !border-slate-700 p-6 flex flex-col justify-between group">
             <div className="flex justify-between items-start">
               <span className="font-label-mono text-sm !text-slate-300 font-bold uppercase tracking-wider">Sensor Agreement</span>
               <span className="material-symbols-outlined text-outline/50 group-hover:text-primary transition-colors">compare_arrows</span>
             </div>
             <div>
               <div className="font-display-lg text-4xl mt-4 font-bold text-primary">
                 {data.sensorAgreement}%
               </div>
               <div className="text-sm !text-slate-400 mt-1 font-bold">Multi-modal fusion</div>
             </div>
          </div>

          <div className="glass-panel !bg-slate-900 !border-slate-700 p-6 flex flex-col justify-between group">
             <div className="flex justify-between items-start">
               <span className="font-label-mono text-sm !text-slate-300 font-bold uppercase tracking-wider">Confidence Level</span>
               <span className="material-symbols-outlined text-outline/50 group-hover:text-secondary transition-colors">verified_user</span>
             </div>
             <div>
               <div className="font-display-lg text-4xl mt-4 font-bold text-secondary">
                 {data.sensorAgreement ? Math.max(0, data.sensorAgreement - 2) : 98}%
               </div>
               <div className="text-sm !text-slate-400 mt-1 font-bold">AI certainty score</div>
             </div>
          </div>

          <div className="glass-panel !bg-slate-900 !border-slate-700 p-6 flex flex-col justify-between group">
             <div className="flex justify-between items-start">
               <span className="font-label-mono text-sm !text-slate-300 font-bold uppercase tracking-wider">Current Hotspot</span>
               <span className="material-symbols-outlined text-outline/50 group-hover:text-error transition-colors">location_on</span>
             </div>
             <div>
               <div className="font-headline-md text-xl mt-4 font-bold !text-slate-100">
                 {data.riskScore > 50 ? 'Industrial Zone B' : 'Main Road Junction'}
               </div>
               <div className="text-sm !text-slate-400 mt-1 font-bold">Zone C - Sector 7</div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Backend Settings Panel */}
      {!isDemo && (
        <div className="glass-panel !bg-slate-900 !border-slate-700 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-headline-md text-lg font-bold !text-slate-100 flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">tune</span> Engine Configuration
             </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-400 font-bold">Detection Sensitivity (0-100)</label>
                <input 
                  type="range" min="0" max="100" defaultValue="50" 
                  onChange={(e) => fetch('/api/config', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({sensitivity: parseInt(e.target.value)})
                  })}
                  className="w-full accent-primary" 
                />
             </div>
             <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-400 font-bold">Brightness Threshold (0-255)</label>
                <input 
                  type="range" min="0" max="255" defaultValue="200" 
                  onChange={(e) => fetch('/api/config', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({brightness_threshold: parseInt(e.target.value)})
                  })}
                  className="w-full accent-secondary" 
                />
             </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Live Optical Sensor Wrapper */}
        <div className="lg:col-span-1 lg:h-[460px] !bg-slate-900 !border-slate-700 rounded-xl overflow-hidden">
          <WebcamSensor isDemo={isDemo} data={data} onLiveData={setLiveData} setIsDemo={setIsDemo} isCameraOn={isCameraOn} />
        </div>

        {/* Enhanced Baseline Learning Engine */}
        <div className="glass-panel !bg-slate-900 !border-slate-700 p-6 lg:col-span-2 flex flex-col lg:h-[460px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-lg font-bold !text-slate-100">Baseline Learning & History</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_var(--color-secondary)]"></div>
                  <span className="text-xs text-on-surface-variant font-label-mono uppercase">Baseline</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]"></div>
                  <span className="text-xs text-on-surface-variant font-label-mono uppercase">Anomaly</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.history || simData.history} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="anomalyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.2} />
                  
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '3 3' }}
                  />
                  <Area type="monotone" dataKey="baseline" name="Baseline" stroke="var(--color-secondary)" strokeWidth={3} fillOpacity={1} fill="url(#baselineGrad)" activeDot={{ r: 6, fill: 'var(--color-secondary)', stroke: 'var(--color-surface)', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="anomaly" name="Anomaly" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#anomalyGrad)" activeDot={{ r: 6, fill: 'var(--color-primary)', stroke: 'var(--color-surface)', strokeWidth: 2 }} />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* DOAS Path Analysis */}
        <div className="glass-panel p-6 lg:col-span-2 flex flex-col h-[280px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-lg font-semibold text-on-surface">DOAS Path Analysis</h3>
            <span className="material-symbols-outlined text-outline/50">sensors</span>
          </div>
          <div className="flex-1 bg-surface-container-lowest/50 rounded-xl border border-outline-variant/30 p-6 relative flex items-center shadow-inner">
            <div className="w-14 h-14 bg-surface border border-outline-variant rounded-full flex items-center justify-center z-10 shadow-lg">
              <span className="material-symbols-outlined text-primary text-2xl">wb_iridescent</span>
            </div>
            
            <div className="flex-1 h-32 relative mx-4">
              <div className="absolute top-1/4 left-0 w-full h-[3px] bg-secondary beam-anim rounded-full shadow-[0_0_12px_var(--color-secondary)]"></div>
              <div className={`absolute top-1/2 left-0 w-full h-[3px] beam-anim rounded-full ${data.opticalDeviation > 50 ? 'bg-error shadow-[0_0_12px_var(--color-error)]' : 'bg-primary shadow-[0_0_12px_var(--color-primary)]'}`} style={{ animationDelay: '0.7s' }}></div>
              <div className={`absolute top-3/4 left-0 w-full h-[3px] beam-anim rounded-full ${data.opticalDeviation > 70 ? 'bg-error shadow-[0_0_12px_var(--color-error)]' : 'bg-tertiary shadow-[0_0_12px_var(--color-tertiary)]'}`} style={{ animationDelay: '1.4s' }}></div>
            </div>
            
            <div className="flex flex-col justify-between h-32 z-10 space-y-3">
              <div className="w-10 h-10 bg-surface border border-secondary rounded-xl flex items-center justify-center shadow-lg"><span className="text-sm text-secondary font-label-mono font-bold">R</span></div>
              <div className={`w-10 h-10 bg-surface border rounded-xl flex items-center justify-center shadow-lg ${data.opticalDeviation > 50 ? 'border-error text-error' : 'border-primary text-primary'}`}><span className="text-sm font-label-mono font-bold">M1</span></div>
              <div className={`w-10 h-10 bg-surface border rounded-xl flex items-center justify-center shadow-lg ${data.opticalDeviation > 70 ? 'border-error text-error' : 'border-tertiary text-tertiary'}`}><span className="text-sm font-label-mono font-bold">M2</span></div>
            </div>
          </div>
        </div>

        {/* Digital Twin Map */}
        <div className="glass-panel p-0 lg:col-span-1 flex flex-col relative overflow-hidden h-[280px] group">
          <div className="p-6 relative z-20 flex justify-between items-center bg-gradient-to-b from-surface/90 to-transparent">
            <h3 className="font-headline-md text-lg font-semibold text-on-surface">Digital Twin</h3>
            <span className="material-symbols-outlined text-outline/50 group-hover:animate-spin">radar</span>
          </div>
          
          <div className="absolute inset-0 z-0">
             <div 
               className="absolute inset-0 bg-cover bg-center opacity-40 transition-all duration-1000 scale-105 group-hover:scale-110" 
               style={{ 
                 backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6CpgNUtCj_mKPLrHJkUaKb0y7KPp3oIgSQfIpChO6SqjX6A_2vyko-bWUw13rYVpWGjOf0Ifk67KKKRLqxxEylOBcVV1kzS-WSM8Oe-yThqvFAHs7TPS5ICWitLH5rInujXJEMpsg6bwh7ORg3Vacds2hGSVaQdjcr-sp8YCFmq5RiMdU8eOYyyxOnndBG9oTh93AapN7FS2815VB2KRb41LZv8KFtpUsDtTDoDei6h5dIaYH5Nz3')",
                 filter: data.riskScore > 60 ? 'saturate(2) hue-rotate(320deg) brightness(1.2)' : 'saturate(1)'
               }}>
            </div>
            {/* Radar Sweep Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] radar-sweep opacity-30"></div>
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center mt-4">
             {data.riskScore > 50 && (
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full animate-ping absolute -left-3 -top-3 ${data.riskScore > 70 ? 'bg-error' : 'bg-tertiary'}`}></div>
                  <div className={`w-2 h-2 rounded-full relative z-10 shadow-[0_0_10px_currentColor] ${data.riskScore > 70 ? 'bg-error text-error' : 'bg-tertiary text-tertiary'}`}></div>
                </div>
             )}
          </div>
          
          {data.riskScore > 50 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface/80 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 z-20 shadow-lg">
               <span className="font-label-mono text-xs font-bold text-error flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span> HOTSPOT DETECTED
               </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
