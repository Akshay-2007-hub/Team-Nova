import React from 'react';

export default function HotspotMap({ liveData }) {
  const risk = liveData?.riskScore || 0;

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500 h-[70vh] flex flex-col">
      <div className="glass-panel !bg-slate-900 !border-slate-700 p-8 flex-1 flex flex-col relative overflow-hidden group">
        <h2 className="font-headline-md text-lg font-bold !text-slate-100 mb-6 relative z-10">Live Area Mapping</h2>
        
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen" 
             style={{ 
               backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6CpgNUtCj_mKPLrHJkUaKb0y7KPp3oIgSQfIpChO6SqjX6A_2vyko-bWUw13rYVpWGjOf0Ifk67KKKRLqxxEylOBcVV1kzS-WSM8Oe-yThqvFAHs7TPS5ICWitLH5rInujXJEMpsg6bwh7ORg3Vacds2hGSVaQdjcr-sp8YCFmq5RiMdU8eOYyyxOnndBG9oTh93AapN7FS2815VB2KRb41LZv8KFtpUsDtTDoDei6h5dIaYH5Nz3')",
               backgroundSize: 'cover',
               backgroundPosition: 'center'
             }}>
        </div>
        
        <div className="relative z-10 flex-1 flex items-center justify-center">
            {risk > 40 && (
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className={`w-32 h-32 rounded-full absolute -left-16 -top-16 opacity-30 animate-ping ${risk > 70 ? 'bg-error' : 'bg-tertiary'}`}></div>
                <div className={`w-4 h-4 rounded-full relative z-10 shadow-[0_0_20px_currentColor] ${risk > 70 ? 'bg-error text-error' : 'bg-tertiary text-tertiary'}`}></div>
                <div className="absolute top-6 left-6 bg-surface/90 px-3 py-1 rounded border border-white/10 text-xs font-bold text-white whitespace-nowrap">
                  Zone 1 Detected
                </div>
              </div>
            )}
            
            {risk > 75 && (
              <div className="absolute bottom-1/3 right-1/3">
                <div className="w-24 h-24 rounded-full absolute -left-12 -top-12 opacity-30 animate-ping bg-error"></div>
                <div className="w-4 h-4 rounded-full relative z-10 shadow-[0_0_20px_currentColor] bg-error text-error"></div>
                <div className="absolute top-6 left-6 bg-surface/90 px-3 py-1 rounded border border-white/10 text-xs font-bold text-white whitespace-nowrap">
                  Zone 2 Critical
                </div>
              </div>
            )}
        </div>
        
        <div className="relative z-10 mt-auto bg-slate-800/80 p-4 rounded-lg border border-slate-700 flex justify-between">
           <div>
             <div className="text-sm text-slate-400 font-bold">Current Sector Threat</div>
             <div className={`text-2xl font-bold ${risk > 60 ? 'text-error' : 'text-secondary'}`}>{risk > 60 ? 'ELEVATED' : 'NOMINAL'}</div>
           </div>
           <div>
             <div className="text-sm text-slate-400 font-bold">Weather Modulation</div>
             <div className="text-lg font-bold text-blue-400">
               {liveData?.weather?.windspeed ? `${liveData.weather.windspeed} km/h Wind` : 'Pending...'}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
