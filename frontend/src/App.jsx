import React, { useState, useEffect } from 'react';
import LandingScreen from './components/LandingScreen';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import BootSequence from './components/BootSequence';
import ForecastModule from './components/ForecastModule';
import HotspotMap from './components/HotspotMap';
import OpticalModule from './components/OpticalModule';
import BaselineModule from './components/BaselineModule';
import FusionModule from './components/FusionModule';
import SimulatorModule from './components/SimulatorModule';
import SettingsModule from './components/SettingsModule';
import SupportModule from './components/SupportModule';
import LogsModule from './components/LogsModule';
import { useSimulation } from './utils/simulation';
import { Toaster } from 'react-hot-toast';

function App() {
  const [hasLaunched, setHasLaunched] = useState(false);
  const [showBootSequence, setShowBootSequence] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [liveData, setLiveData] = useState(null);
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    let ws;
    if (!isDemo && isCameraOn) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/ws`;
      ws = new WebSocket(wsUrl);
      
      ws.onmessage = (event) => {
        try {
          const backendData = JSON.parse(event.data);
          setLiveData(prev => ({
            ...prev,
            opticalDeviation: backendData.optical_anomaly_score,
            riskScore: backendData.risk_score,
            particleCount: backendData.particle_count,
            scatterPercentage: backendData.scatter_percentage,
            brightness: backendData.brightness,
            temporalVariation: backendData.temporal_variation,
            backendStatus: backendData.status,
            history: backendData.history,
            pm25: backendData.pm25,
            sensorAgreement: backendData.sensor_agreement,
            weather: backendData.weather
          }));
        } catch (error) {
          console.error("Failed to parse websocket data:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } else if (!isDemo && !isCameraOn) {
      // If camera is explicitly off, override liveData to look offline
      setLiveData(prev => prev ? ({
        ...prev,
        riskScore: 0,
        opticalDeviation: 0,
        pm25: 0,
        particleCount: 0,
        backendStatus: 'OFFLINE'
      }) : null);
    }
    
    return () => {
      if (ws) ws.close();
    };
  }, [isDemo, isCameraOn]);

  // Apply dark mode to HTML document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Critical Hazard Notifications
  const notifiedRef = React.useRef(false);
  useEffect(() => {
    if (liveData && liveData.riskScore > 75) {
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        if (Notification.permission === 'granted') {
          new Notification('VAYU MITRA X ALERT', {
            body: `CRITICAL HAZARD DETECTED! Risk Score: ${liveData.riskScore}. PM2.5: ${liveData.pm25}`,
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
               new Notification('VAYU MITRA X ALERT', {
                 body: `CRITICAL HAZARD DETECTED! Risk Score: ${liveData.riskScore}. PM2.5: ${liveData.pm25}`
               });
            }
          });
        }
      }
    } else if (liveData && liveData.riskScore < 70) {
      // Reset when risk goes down
      notifiedRef.current = false;
    }
  }, [liveData?.riskScore, liveData?.pm25]);

  const simulation = useSimulation('NORMAL', isCameraOn);

  const handleLaunch = () => {
    setShowBootSequence(true);
    setHasLaunched(true);
  };

  if (!hasLaunched) {
    return <LandingScreen onLaunch={handleLaunch} setDemoMode={setIsDemo} />;
  }

  return (
    <div className="font-body-md text-body-md bg-background text-on-background flex h-screen overflow-hidden w-full relative">
      {showBootSequence && <BootSequence onComplete={() => setShowBootSequence(false)} />}
      
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: 'var(--color-surface-bright)',
            color: 'var(--color-on-surface)',
            border: '1px solid var(--color-outline-variant)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            fontFamily: "'JetBrains Mono', monospace",
            borderRadius: '12px'
          },
          success: { iconTheme: { primary: 'var(--color-secondary)', secondary: 'white' } },
          error: { iconTheme: { primary: 'var(--color-error)', secondary: 'white' }, duration: 5000 }
        }} 
      />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 md:ml-[280px] flex flex-col h-screen overflow-y-auto w-full relative">
        <header className="bg-surface/60 backdrop-blur-xl sticky top-0 w-full z-50 border-b border-outline-variant/50 shadow-[0_0_12px_rgba(47,217,244,0.15)] flex justify-between items-center px-6 md:px-10 min-h-[64px]">
          <div className="md:hidden font-headline-md text-headline-md font-bold tracking-tight text-primary">VayuMitra X</div>
          <div className="hidden md:block font-headline-md text-headline-md font-bold tracking-tight text-primary capitalize">{activeTab.replace('-', ' ')}</div>
          
          <div className="flex space-x-4 items-center">
            {isDemo && (
              <div className="hidden lg:flex items-center gap-2 mr-4 bg-surface-dim px-3 py-1 rounded border border-outline-variant/50">
                <span className="text-[10px] font-label-mono text-on-surface-variant mr-1">SCENARIO:</span>
                <button onClick={() => simulation.setScenario('NORMAL')} className={`text-[10px] font-label-mono px-2 py-0.5 rounded ${simulation.scenario === 'NORMAL' ? 'bg-secondary/20 text-secondary' : 'text-on-surface-variant'}`}>NORMAL</button>
                <button onClick={() => simulation.setScenario('MODERATE')} className={`text-[10px] font-label-mono px-2 py-0.5 rounded ${simulation.scenario === 'MODERATE' ? 'bg-tertiary-container/20 text-tertiary-container' : 'text-on-surface-variant'}`}>MODERATE</button>
                <button onClick={() => simulation.setScenario('HIGH')} className={`text-[10px] font-label-mono px-2 py-0.5 rounded ${simulation.scenario === 'HIGH' ? 'bg-error/20 text-error' : 'text-on-surface-variant'}`}>HIGH</button>
              </div>
            )}
            
            {isDemo ? (
              <span className="bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/30 px-3 py-1 rounded text-xs font-label-mono cursor-pointer" onClick={() => setIsDemo(false)} title="Click to Switch to Live Webcam">DEMO MODE</span>
            ) : (
              <span className="bg-secondary/10 text-secondary border border-secondary/30 px-3 py-1 rounded text-xs font-label-mono flex items-center gap-2 cursor-pointer" onClick={() => setIsDemo(true)} title="Click to Switch to Demo Simulation">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span> LIVE
              </span>
            )}

            <div className="relative group flex items-center justify-center">
              <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95" onClick={() => setHasLaunched(false)}>
                <span className="material-symbols-outlined">home</span>
              </button>
              <div className="absolute top-10 right-0 whitespace-nowrap bg-slate-800 text-xs text-slate-200 font-label-mono px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-700 shadow-lg">
                Return to Landing Screen
              </div>
            </div>
            
            <div className="relative group flex items-center justify-center">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95">
                <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
              </button>
              <div className="absolute top-10 right-0 whitespace-nowrap bg-slate-800 text-xs text-slate-200 font-label-mono px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-700 shadow-lg">
                Toggle UI Theme
              </div>
            </div>

            <div className="relative group flex items-center justify-center">
              <button onClick={() => setIsCameraOn(!isCameraOn)} className="text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95">
                <span className="material-symbols-outlined">{isCameraOn ? 'videocam' : 'videocam_off'}</span>
              </button>
              <div className="absolute top-10 right-0 whitespace-nowrap bg-slate-800 text-xs text-slate-200 font-label-mono px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-700 shadow-lg">
                {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
              </div>
            </div>
            
            <div className="relative group flex items-center justify-center">
              <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95" onClick={() => setActiveTab('fusion')}>
                <span className="material-symbols-outlined">sensors</span>
              </button>
              <div className="absolute top-10 right-0 whitespace-nowrap bg-slate-800 text-xs text-slate-200 font-label-mono px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-700 shadow-lg">
                Multi-Modal Sensors
              </div>
            </div>

            <div className="relative group flex items-center justify-center">
              <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95" onClick={() => setActiveTab('optical')}>
                <span className="material-symbols-outlined">visibility</span>
              </button>
              <div className="absolute top-10 right-0 whitespace-nowrap bg-slate-800 text-xs text-slate-200 font-label-mono px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-700 shadow-lg">
                Optical Engine
              </div>
            </div>

            <div className="relative group flex items-center justify-center">
              <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95" onClick={() => setActiveTab('logs')}>
                <span className="material-symbols-outlined">schedule</span>
              </button>
              <div className="absolute top-10 right-0 whitespace-nowrap bg-slate-800 text-xs text-slate-200 font-label-mono px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-slate-700 shadow-lg">
                System Logs History
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 md:p-10 pb-24">
          {activeTab === 'dashboard' ? (
            <Dashboard 
              isDemo={isDemo} 
              setIsDemo={setIsDemo}
              simulation={simulation} 
              liveData={liveData}
              setLiveData={setLiveData}
              isCameraOn={isCameraOn}
            />
          ) : activeTab === 'forecast' ? (
            <ForecastModule />
          ) : activeTab === 'hotspot' ? (
            <HotspotMap liveData={liveData} />
          ) : activeTab === 'optical' ? (
            <OpticalModule 
              isDemo={isDemo} 
              liveData={liveData} 
              setIsDemo={setIsDemo} 
              setLiveData={setLiveData} 
              isCameraOn={isCameraOn}
            />
          ) : activeTab === 'baseline' ? (
            <BaselineModule />
          ) : activeTab === 'fusion' ? (
            <FusionModule liveData={liveData} />
          ) : activeTab === 'simulator' ? (
            <SimulatorModule />
          ) : activeTab === 'settings' ? (
            <SettingsModule isDemo={isDemo} setIsDemo={setIsDemo} />
          ) : activeTab === 'support' ? (
            <SupportModule />
          ) : activeTab === 'logs' ? (
            <LogsModule liveData={liveData} />
          ) : (
            <div className="w-full h-full min-h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="w-24 h-24 mb-6 rounded-full bg-surface-variant/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-5xl">construction</span>
              </div>
              <h2 className="text-2xl font-headline-md text-on-surface font-bold capitalize">{activeTab.replace('-', ' ')} Module</h2>
              <p className="text-on-surface-variant mt-2 text-center max-w-md">
                This module is currently under development. Please return to the main <strong className="text-primary cursor-pointer hover:underline" onClick={() => setActiveTab('dashboard')}>Dashboard</strong> to view the VayuMitra X live telemetry.
              </p>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="mt-8 px-6 py-3 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary-fixed hover:-translate-y-1 transition-all shadow-lg"
              >
                Back to Home Dashboard
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
