import React, { useState, useEffect } from 'react';

export default function BaselineModule() {
  const [baseline, setBaseline] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/baseline')
      .then(res => res.json())
      .then(data => {
        setBaseline(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      
      <div className="glass-panel !bg-slate-900 !border-slate-700 p-8 flex flex-col relative overflow-hidden group">
        <h2 className="font-headline-md text-2xl font-bold !text-slate-100 flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-secondary text-3xl">analytics</span>
          Atmospheric Baseline Calibration
        </h2>
        <p className="text-slate-400 mb-8 max-w-2xl">
          The baseline establishes the standard ambient conditions for the optical sensor. All anomaly scores and deviation metrics are calculated relative to these established values.
        </p>

        {loading ? (
          <div className="text-center text-slate-400 py-10 animate-pulse">Loading Calibration Data...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div className="text-slate-400 font-label-mono text-xs uppercase font-bold mb-2">Reference Particle Count</div>
              <div className="font-display-lg text-4xl text-slate-100 font-bold">
                {baseline?.particle_count || 0}
              </div>
              <div className="text-xs text-slate-500 mt-2">Expected ambient particulate matter</div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div className="text-slate-400 font-label-mono text-xs uppercase font-bold mb-2">Reference Scatter Ratio</div>
              <div className="font-display-lg text-4xl text-slate-100 font-bold">
                {baseline?.scatter_percentage ? baseline.scatter_percentage.toFixed(3) : '0.000'}%
              </div>
              <div className="text-xs text-slate-500 mt-2">Expected optical dispersion percentage</div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div className="text-slate-400 font-label-mono text-xs uppercase font-bold mb-2">Reference Brightness</div>
              <div className="font-display-lg text-4xl text-slate-100 font-bold">
                {baseline?.brightness ? baseline.brightness.toFixed(3) : '0.000'}
              </div>
              <div className="text-xs text-slate-500 mt-2">Standard ambient lighting (0-255 scale)</div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <div className="text-slate-400 font-label-mono text-xs uppercase font-bold mb-2">Reference Temporal Variance</div>
              <div className="font-display-lg text-4xl text-slate-100 font-bold">
                {baseline?.temporal_variation ? baseline.temporal_variation.toFixed(3) : '0.000'}
              </div>
              <div className="text-xs text-slate-500 mt-2">Expected inter-frame volatility</div>
            </div>
            
          </div>
        )}
        
        <div className="mt-8 flex gap-4">
           <button className="px-6 py-3 bg-secondary/10 text-secondary border border-secondary/30 rounded font-bold hover:bg-secondary/20 transition-all flex items-center gap-2">
             <span className="material-symbols-outlined text-sm">refresh</span>
             Recalibrate Baseline
           </button>
           <button className="px-6 py-3 bg-slate-800 text-slate-300 rounded font-bold hover:bg-slate-700 transition-all">
             View Calibration History
           </button>
        </div>
      </div>
    </div>
  );
}
