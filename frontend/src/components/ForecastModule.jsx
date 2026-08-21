import React, { useState, useEffect } from 'react';

export default function ForecastModule() {
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch History
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Fetch AI Prediction
    fetch('/api/predict')
      .then(res => res.json())
      .then(data => {
        if (data.prediction !== null) {
          setPrediction(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      
      {prediction && (
        <div className="glass-panel !bg-slate-900 !border-slate-700 p-6 flex flex-col md:flex-row justify-between items-center relative overflow-hidden group mb-6">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <div>
            <h3 className="font-bold text-primary flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined">auto_graph</span> AI Predictive Forecast
            </h3>
            <div className="text-sm text-slate-400">Linear regression model based on last 500 telemetry points</div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-bold uppercase">Trend</div>
              <div className={`font-bold capitalize ${prediction.trend === 'increasing' ? 'text-error' : prediction.trend === 'decreasing' ? 'text-secondary' : 'text-slate-300'}`}>
                {prediction.trend}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-bold uppercase">+60 min Forecast</div>
              <div className="font-display-lg text-3xl font-bold text-slate-100">{prediction.prediction} <span className="text-sm text-slate-500">µg/m³</span></div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-panel !bg-slate-900 !border-slate-700 p-8 flex flex-col relative overflow-hidden group">
        <h2 className="font-headline-md text-lg font-bold !text-slate-100 mb-6">Atmospheric History Log</h2>
        
        {loading ? (
          <div className="text-center text-slate-400 py-10 animate-pulse">Loading Database Records...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-800 text-slate-400">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Optical Score</th>
                  <th className="px-4 py-3">PM 2.5</th>
                  <th className="px-4 py-3">Temp (°C)</th>
                  <th className="px-4 py-3">Wind (km/h)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((log) => (
                  <tr key={log.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-label-mono">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${log.optical_anomaly_score > 60 ? 'bg-error/20 text-error' : 'bg-secondary/20 text-secondary'}`}>
                        {log.optical_anomaly_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold">{log.pm25}</td>
                    <td className="px-4 py-3">{log.weather_temperature || '--'}</td>
                    <td className="px-4 py-3">{log.weather_windspeed || '--'}</td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-6 text-slate-500">No logs found in database. Let the engine run for a few seconds!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
