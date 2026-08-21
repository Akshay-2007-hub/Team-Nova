import { useState, useEffect } from 'react';

// Scenarios: 'NORMAL', 'MODERATE', 'HIGH'
export function useSimulation(initialScenario = 'NORMAL', isCameraOn = true) {
  const [scenario, setScenario] = useState(initialScenario);
  const [data, setData] = useState(generateBaseData(initialScenario));

  useEffect(() => {
    if (!isCameraOn) return; // Pause the simulation if the camera is off
    
    const interval = setInterval(() => {
      setData(prev => generateNextTick(prev, scenario));
    }, 1000);
    return () => clearInterval(interval);
  }, [scenario, isCameraOn]);

  return { scenario, setScenario, data };
}

function generateBaseData(scenario) {
  let baseScore = 20;
  if (scenario === 'MODERATE') baseScore = 65;
  if (scenario === 'HIGH') baseScore = 88;

  return {
    riskScore: baseScore,
    opticalDeviation: baseScore,
    pm25: baseScore * 0.8,
    traffic: scenario === 'NORMAL' ? 400 : (scenario === 'MODERATE' ? 1200 : 2400),
    confidence: 90,
    sensorAgreement: 88,
    history: Array.from({ length: 15 }, (_, i) => ({
      time: i,
      baseline: 20,
      anomaly: Math.max(0, baseScore + (Math.random() * 12 - 6))
    }))
  };
}

function generateNextTick(prev, scenario) {
  const target = scenario === 'NORMAL' ? 20 : (scenario === 'MODERATE' ? 65 : 88);
  const drift = (target - prev.riskScore) * 0.1 + (Math.random() * 6 - 3);
  
  const newRisk = Math.min(100, Math.max(0, prev.riskScore + drift));
  const newOptical = Math.min(100, Math.max(0, prev.opticalDeviation + drift * 1.2));
  
  const newHistory = [...prev.history.slice(1), {
    time: prev.history[prev.history.length - 1].time + 1,
    baseline: 20,
    anomaly: newOptical
  }];

  return {
    ...prev,
    riskScore: Math.round(newRisk),
    opticalDeviation: Math.round(newOptical),
    pm25: Math.round(newRisk * 0.8 + Math.random() * 5),
    history: newHistory,
    traffic: scenario === 'NORMAL' ? 400 + Math.random()*50 : (scenario === 'MODERATE' ? 1200 + Math.random()*100 : 2400 + Math.random()*200),
    sensorAgreement: Math.round(85 + Math.random() * 10)
  };
}
