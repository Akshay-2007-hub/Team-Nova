import React, { useRef, useEffect, useState } from 'react';

export default function WebcamSensor({ isDemo, data, onLiveData, setIsDemo, isCameraOn = true }) {
  const canvasRef = useRef(null);
  const [streamActive, setStreamActive] = useState(isCameraOn);

  useEffect(() => {
    setStreamActive(isCameraOn);
  }, [isCameraOn]);

  const startCamera = () => {
    if (isDemo) setIsDemo(false);
    setStreamActive(true);
  };

  const stopCamera = () => {
    setStreamActive(false);
    if (onLiveData) onLiveData(null);
  };

  // Simulated Animation for Demo Mode
  useEffect(() => {
    if (!isDemo && streamActive) return; 

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;

    const drawDemo = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() / 1000;
      const deviation = data?.opticalDeviation || 0;
      const jitterX = Math.sin(time * 5) * (deviation / 10);
      const jitterY = Math.cos(time * 7) * (deviation / 10);
      const centerX = canvas.width / 2 + jitterX;
      const centerY = canvas.height / 2 + jitterY;

      ctx.beginPath();
      ctx.arc(centerX, centerY, 8 + (deviation / 20), 0, 2 * Math.PI);
      ctx.fillStyle = deviation > 70 ? 'rgba(239, 68, 68, 0.8)' : 
                     deviation > 40 ? 'rgba(217, 119, 6, 0.8)' : 
                     'rgba(14, 165, 233, 0.8)';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      
      // Draw crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - 20, centerY);
      ctx.lineTo(centerX + 20, centerY);
      ctx.moveTo(centerX, centerY - 20);
      ctx.lineTo(centerX, centerY + 20);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.stroke();

      animationFrame = requestAnimationFrame(drawDemo);
    };
    drawDemo();

    return () => cancelAnimationFrame(animationFrame);
  }, [isDemo, streamActive, data]);

  // Compute display coordinates
  const cx = isDemo ? (1240 + Math.floor(Math.random() * 10)) : (data?.x || 0);
  const cy = isDemo ? (842 + Math.floor(Math.random() * 10)) : (data?.y || 0);
  const cint = isDemo ? Math.floor(200 - (data?.opticalDeviation || 0)) : (data?.brightness || 0);

  return (
    <div className="glass-panel !bg-slate-900 !border-slate-700 p-6 flex flex-col space-y-4 w-full h-full relative overflow-hidden group">
      <div className="flex justify-between items-center relative z-10">
        <h3 className="font-headline-md text-lg font-bold !text-slate-100">Live Optical Feed</h3>
        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">videocam</span>
      </div>
      
      <div className="w-full flex-1 min-h-[220px] bg-surface-dim rounded-xl border border-outline-variant/30 relative overflow-hidden flex items-center justify-center shadow-inner">
        {!isDemo && streamActive && (
          <img src="/api/video-feed" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen" alt="Backend Video Feed" />
        )}
        <canvas ref={canvasRef} width={640} height={360} className="absolute inset-0 w-full h-full object-cover z-10 drop-shadow-md pointer-events-none" />
        
        {/* Animated Scanning Line */}
        {(streamActive || isDemo) && (
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/50 shadow-[0_0_15px_var(--color-primary)] z-20 animate-[scan_3s_ease-in-out_infinite_alternate]"></div>
        )}

        {(!streamActive && !isDemo) && (
          <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant flex-col gap-3 z-20 bg-surface-dim/80 backdrop-blur-sm">
            <div className="p-4 rounded-full bg-surface border border-outline-variant/30 shadow-lg mb-2">
              <span className="material-symbols-outlined text-4xl text-outline">videocam_off</span>
            </div>
            <p className="font-label-mono text-sm tracking-wider font-semibold">CAMERA INACTIVE</p>
          </div>
        )}

        {isDemo && (
          <div className="absolute inset-0 bg-cover bg-center opacity-40 z-0 scale-105 group-hover:scale-110 transition-transform duration-1000" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDvcdKdBSAYA-DXFD4SBiHv-3KCH7XZznm5qWPCXoPn10Y-w31bn5c9VkEUQqCHGTt8IKJLVBxucT-gxwQzgV50YYVb4qMWTW9unlClmIVVBJ9MMvmAQUqokSFHFmaHOgYIC6EC16eLxv9gGRoSJcmB4MKGmyX4F9DP8mSft5Qrq73elkK7fggU3-CW9Q7lpwtWS7oXJQukvBmeyRZYbpODfupsLwNL3q-8tcK3k_w2bjcDYgwEBzk8')"}}></div>
        )}
        
        {streamActive && !isDemo && (
          <div className="absolute top-4 left-4 z-20">
             <span className="font-label-mono text-xs font-bold tracking-widest text-primary bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-full flex items-center gap-2 backdrop-blur-md">
               <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--color-primary)]"></span>
               FEED ACTIVE
             </span>
          </div>
        )}
      </div>

      <div className="flex space-x-3 relative z-10">
        <button onClick={startCamera} className={`flex-1 py-2.5 font-label-mono text-sm font-bold tracking-wider rounded-lg transition-all shadow-md ${streamActive && !isDemo ? 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20' : 'bg-primary text-on-primary hover:bg-primary-fixed hover:-translate-y-0.5'}`}>
          {streamActive && !isDemo ? 'TRACKING...' : 'START SENSOR'}
        </button>
        <button onClick={stopCamera} className="flex-1 py-2.5 bg-surface border border-outline-variant text-on-surface font-label-mono text-sm font-bold tracking-wider rounded-lg hover:bg-surface-variant hover:-translate-y-0.5 transition-all shadow-md">
          STOP
        </button>
      </div>

      <div className="space-y-3 pt-3 border-t border-outline-variant/30 relative z-10 mt-auto">
        <div className="flex justify-between items-center text-sm bg-surface-container-lowest/50 p-2 rounded-lg border border-outline-variant/20">
          <span className="text-on-surface-variant font-medium">Optical Centroid</span>
          <span className="font-label-mono font-bold text-primary tracking-wider">{cx > 0 ? `[X:${cx}, Y:${cy}]` : 'AWAITING LOCK'}</span>
        </div>
        <div className="flex justify-between items-center text-sm bg-surface-container-lowest/50 p-2 rounded-lg border border-outline-variant/20">
          <span className="text-on-surface-variant font-medium">Signal Intensity</span>
          <span className="font-label-mono font-bold text-secondary tracking-wider">{cint > 0 ? (cint).toFixed(3) : '0.000'}</span>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0.2; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
