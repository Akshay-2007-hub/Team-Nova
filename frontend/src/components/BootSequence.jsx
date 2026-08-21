import React, { useState, useEffect } from 'react';

export default function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([]);
  
  const bootLogs = [
    "INITIALIZING VAYUMITRA X ENGINE v2.4.1...",
    "ESTABLISHING SECURE SATELLITE UPLINK... [OK]",
    "CALIBRATING OPTICAL SENSORS... [OK]",
    "LOADING NEURAL FUSION MODELS...",
    "ENGAGING MULTI-MODAL ATMOSPHERIC ANALYSIS...",
    "SYSTEM READY. LAUNCHING DASHBOARD..."
  ];

  useEffect(() => {
    let currentLine = 0;
    
    const interval = setInterval(() => {
      if (currentLine < bootLogs.length) {
        setLines(prev => [...prev, bootLogs[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 600); // short delay after final line before clearing
      }
    }, 350); // delay between lines

    return () => clearInterval(interval);
  }, []); // Empty dependency array prevents re-renders from restarting the boot sequence

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col justify-center px-12 md:px-24 font-label-mono text-sm tracking-widest text-primary animate-in fade-in duration-300">
      <div className="max-w-2xl w-full mx-auto">
        <div className="flex items-center gap-3 mb-8 animate-pulse">
            <span className="material-symbols-outlined text-4xl">rocket_launch</span>
            <h1 className="text-2xl font-bold font-headline-md tracking-widest text-on-surface">VAYUMITRA X // SYSTEM BOOT</h1>
        </div>
        <div className="space-y-3">
          {lines.map((line, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <span className="text-secondary opacity-70">[{new Date().toISOString().substring(11, 19)}]</span>
              <span className="text-primary">{line}</span>
            </div>
          ))}
          {lines.length < bootLogs.length && (
            <div className="flex gap-4 items-center animate-pulse mt-2">
              <span className="text-secondary opacity-70">[{new Date().toISOString().substring(11, 19)}]</span>
              <span className="w-2 h-4 bg-primary inline-block"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
