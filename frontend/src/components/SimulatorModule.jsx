import React, { useState, useEffect } from 'react';

export default function SimulatorModule() {
  const [particleCount, setParticleCount] = useState(15);
  const [opticalScore, setOpticalScore] = useState(30);
  const [scatterRatio, setScatterRatio] = useState(1.5);
  const [windSpeed, setWindSpeed] = useState(5.0);

  const [simulatedRisk, setSimulatedRisk] = useState(0);
  const [simulatedPm25, setSimulatedPm25] = useState(0);

  useEffect(() => {
    // Replicate backend logic exactly
    const windFactor = Math.max(1.0, windSpeed / 5.0);
    const risk = Math.min(100, Math.max(0, (opticalScore * 0.85) + (particleCount * 0.5)));
    const pm = Math.min(500, Math.max(5, Math.floor(((risk * 1.5) + (scatterRatio * 10)) / windFactor)));

    setSimulatedRisk(Math.round(risk));
    setSimulatedPm25(pm);
  }, [particleCount, opticalScore, scatterRatio, windSpeed]);

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      
      <div className="glass-panel !bg-slate-900 !border-slate-700 p-8 flex flex-col relative overflow-hidden group">
        <h2 className="font-headline-md text-2xl font-bold !text-slate-100 flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-3xl">biotech</span>
          What-If Simulator
        </h2>
        <p className="text-slate-400 mb-8 max-w-2xl">
          Test the VayuMitra X backend algorithms safely. Manually adjust optical inputs and weather conditions to see how the AI predicts atmospheric threats and PM 2.5 levels.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Controls */}
          <div className="space-y-8 bg-slate-800/40 p-6 rounded-xl border border-slate-700">
             <h3 className="font-bold text-slate-100 uppercase tracking-widest text-sm mb-4">Input Parameters</h3>
             
             <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-slate-400 font-bold">
                  <span>Raw Particle Count</span>
                  <span className="text-primary">{particleCount}</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={particleCount} 
                  onChange={(e) => setParticleCount(Number(e.target.value))}
                  className="w-full accent-primary" 
                />
             </div>

             <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-slate-400 font-bold">
                  <span>Optical Anomaly Score</span>
                  <span className="text-secondary">{opticalScore}/100</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={opticalScore} 
                  onChange={(e) => setOpticalScore(Number(e.target.value))}
                  className="w-full accent-secondary" 
                />
             </div>

             <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-slate-400 font-bold">
                  <span>Scatter Ratio</span>
                  <span className="text-tertiary">{scatterRatio}%</span>
                </div>
                <input 
                  type="range" min="0" max="25" step="0.1" value={scatterRatio} 
                  onChange={(e) => setScatterRatio(Number(e.target.value))}
                  className="w-full accent-tertiary" 
                />
             </div>

             <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-slate-400 font-bold">
                  <span>Wind Speed (Weather Modulator)</span>
                  <span className="text-blue-400">{windSpeed} km/h</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="0.5" value={windSpeed} 
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full accent-blue-500" 
                />
                <span className="text-xs text-slate-500">High wind speeds disperse particles, significantly lowering PM 2.5 estimates.</span>
             </div>
          </div>

          {/* Outputs */}
          <div className="flex flex-col justify-center space-y-8">
             
             <div className="bg-slate-800/80 p-8 rounded-xl border border-primary relative overflow-hidden shadow-[0_0_30px_rgba(47,217,244,0.1)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
                
                <h3 className="font-bold text-slate-100 flex items-center gap-2 mb-6 uppercase tracking-widest text-sm">
                  <span className="material-symbols-outlined text-primary">memory</span> AI Synthesized Outputs
                </h3>
                
                <div className="space-y-8">
                  <div>
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Calculated PM 2.5 Estimate</div>
                    <div className="flex items-end gap-3">
                      <span className={`font-display-lg text-6xl font-bold ${simulatedPm25 > 150 ? 'text-error' : simulatedPm25 > 50 ? 'text-tertiary' : 'text-primary'}`}>
                        {simulatedPm25}
                      </span>
                      <span className="text-slate-500 font-bold pb-2">µg/m³</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase mb-2">
                      <span className="text-slate-400">Atmospheric Risk Score</span>
                      <span className={simulatedRisk > 70 ? 'text-error' : simulatedRisk > 40 ? 'text-tertiary' : 'text-secondary'}>{simulatedRisk}/100</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-700 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${simulatedRisk > 70 ? 'bg-error' : simulatedRisk > 40 ? 'bg-tertiary' : 'bg-secondary'}`} 
                        style={{ width: `${simulatedRisk}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-700">
                   <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">System Verdict</div>
                   <div className={`px-4 py-2 inline-block rounded font-bold border ${simulatedRisk > 70 ? 'bg-error/10 border-error text-error' : simulatedRisk > 40 ? 'bg-tertiary/10 border-tertiary text-tertiary' : 'bg-secondary/10 border-secondary text-secondary'}`}>
                     {simulatedRisk > 70 ? 'CRITICAL HAZARD' : simulatedRisk > 40 ? 'MODERATE WARNING' : 'NOMINAL CONDITIONS'}
                   </div>
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
}
