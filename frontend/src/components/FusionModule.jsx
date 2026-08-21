import React from 'react';

export default function FusionModule({ liveData }) {
  const data = liveData || {};
  const weather = data.weather || { temperature: '--', windspeed: '--' };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      
      <div className="glass-panel !bg-slate-900 !border-slate-700 p-8 flex flex-col">
        <h2 className="font-headline-md text-2xl font-bold !text-slate-100 flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary text-3xl">layers</span>
          Multi-Modal Sensor Fusion
        </h2>
        <p className="text-slate-400 mb-8 max-w-2xl">
          Visualizing how the AI engine combines raw optical computer vision telemetry with meteorological data (wind/temperature) to calculate the final ambient PM2.5 and Risk Score.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Input Nodes */}
          <div className="flex flex-col gap-6 justify-center">
             
             {/* Optical Node */}
             <div className="bg-slate-800/80 p-6 rounded-xl border border-secondary shadow-lg shadow-secondary/10 relative">
                <div className="absolute -right-4 top-1/2 w-4 h-0.5 bg-secondary"></div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">visibility</span> Optical Matrix
                  </h3>
                  <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">Weight: 85%</span>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>Base Anomaly:</span> <span className="font-bold text-white">{data.opticalDeviation || 0}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scatter Ratio:</span> <span className="font-bold text-white">{data.scatterPercentage || 0}%</span>
                  </div>
                </div>
             </div>

             {/* Meteorological Node */}
             <div className="bg-slate-800/80 p-6 rounded-xl border border-tertiary shadow-lg shadow-tertiary/10 relative">
                <div className="absolute -right-4 top-1/2 w-4 h-0.5 bg-tertiary"></div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary">air</span> Meteo API
                  </h3>
                  <span className="text-xs bg-tertiary/20 text-tertiary px-2 py-1 rounded">Weight: 15%</span>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between">
                    <span>Wind Speed:</span> <span className="font-bold text-white">{weather.windspeed} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Temperature:</span> <span className="font-bold text-white">{weather.temperature} °C</span>
                  </div>
                </div>
             </div>

          </div>

          {/* Fusion Engine Center */}
          <div className="flex items-center justify-center relative">
             {/* Connecting Lines */}
             <div className="absolute left-0 top-1/4 w-full h-0.5 bg-secondary opacity-50 -z-10 hidden lg:block"></div>
             <div className="absolute left-0 bottom-1/4 w-full h-0.5 bg-tertiary opacity-50 -z-10 hidden lg:block"></div>
             
             <div className="w-56 h-56 rounded-full bg-slate-900 border-4 border-primary shadow-[0_0_40px_rgba(47,217,244,0.2)] flex flex-col items-center justify-center relative z-10 animate-pulse">
               <span className="material-symbols-outlined text-5xl text-primary mb-2">memory</span>
               <div className="font-bold text-lg text-slate-100 uppercase tracking-widest">Fusion Engine</div>
               <div className="text-primary font-label-mono mt-2 text-sm">{data.sensorAgreement || 0}% Agreement</div>
             </div>
          </div>

          {/* Output Node */}
          <div className="flex flex-col gap-6 justify-center">
             
             <div className="bg-primary/10 p-6 rounded-xl border border-primary shadow-lg shadow-primary/20 relative">
                <div className="absolute -left-4 top-1/2 w-4 h-0.5 bg-primary hidden lg:block"></div>
                <h3 className="font-bold text-primary flex items-center gap-2 mb-6 text-lg uppercase tracking-wide">
                  <span className="material-symbols-outlined text-primary">assessment</span> Final Output
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm text-slate-300 mb-1">
                      <span>Synthesized PM 2.5</span>
                      <span className="font-bold text-white">{data.pm25 || 0} µg/m³</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((data.pm25 || 0) / 300) * 100)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-slate-300 mb-1">
                      <span>Atmospheric Risk Score</span>
                      <span className="font-bold text-white">{data.riskScore || 0}/100</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-500 ${data.riskScore > 70 ? 'bg-error' : data.riskScore > 40 ? 'bg-tertiary' : 'bg-secondary'}`} style={{ width: `${data.riskScore || 0}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-primary/20">
                  <div className="text-xs text-primary/70 uppercase tracking-wider font-bold mb-1">Status Verdict</div>
                  <div className={`font-display-lg text-2xl font-bold ${data.status === 'HIGH' ? 'text-error' : data.status === 'MODERATE' ? 'text-tertiary' : 'text-secondary'}`}>
                    {data.status || 'NOMINAL'}
                  </div>
                </div>
             </div>

          </div>

        </div>
      </div>
    </div>
  );
}
