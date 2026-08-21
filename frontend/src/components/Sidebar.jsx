import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', fill: true },
    { id: 'optical', label: 'Optical Sensor', icon: 'visibility' },
    { id: 'baseline', label: 'Baseline Learning', icon: 'analytics' },
    { id: 'fusion', label: 'Sensor Fusion', icon: 'layers' },
    { id: 'hotspot', label: 'Hotspot Map', icon: 'map' },
    { id: 'forecast', label: 'Forecast', icon: 'temp_preferences_custom' },
    { id: 'simulator', label: 'What-If Simulator', icon: 'biotech' },
    { id: 'settings', label: 'System Settings', icon: 'settings' },
  ];

  return (
    <nav className="hidden md:flex flex-col h-full py-8 bg-surface-container/60 backdrop-blur-xl fixed left-0 top-0 w-[280px] z-40 border-r border-outline-variant/50 transition-all duration-200 ease-in-out">
      <div className="px-6 mb-10">
        <h1 className="font-headline-md text-headline-md text-primary font-bold tracking-tight">VayuMitra X</h1>
        <p className="font-caption text-caption text-on-surface-variant mt-1">Atmospheric Intelligence</p>
      </div>
      
      <div className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                isActive 
                  ? 'text-on-primary bg-primary shadow-md shadow-primary/20 translate-x-1' 
                  : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface hover:translate-x-1'
              }`}
            >
              <span 
                className="material-symbols-outlined" 
                style={isActive && item.fill ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-label-mono text-sm tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="px-4 mt-auto pt-6 border-t border-outline-variant/30 flex flex-col space-y-2">
        <button 
          onClick={() => setActiveTab('support')}
          className={`w-full flex items-center space-x-3 px-4 py-2 rounded transition-all ${
            activeTab === 'support' 
              ? 'bg-primary/20 text-primary font-bold' 
              : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined">help</span>
          <span className="font-label-mono text-label-mono">Support</span>
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`w-full flex items-center space-x-3 px-4 py-2 rounded transition-all ${
            activeTab === 'logs' 
              ? 'bg-primary/20 text-primary font-bold' 
              : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined">history</span>
          <span className="font-label-mono text-label-mono">Logs</span>
        </button>
      </div>
    </nav>
  );
}
