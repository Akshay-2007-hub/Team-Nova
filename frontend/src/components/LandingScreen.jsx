import React, { useState } from 'react';

export default function LandingScreen({ onLaunch, setDemoMode }) {
  const [showRegistration, setShowRegistration] = useState(false);
  const [isSignInMode, setIsSignInMode] = useState(false);

  const handleLaunch = (demo) => {
    setDemoMode(demo);
    onLaunch();
  };

  return (
    <div className="flex-1 flex flex-col relative min-h-screen font-body-md overflow-x-hidden w-full">
      
      {/* Registration Modal Overlay */}
      {showRegistration && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
           <div className="bg-surface/80 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col md:flex-row relative">
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

              {/* Left Side: Branding / Info */}
              <div className="md:w-5/12 bg-surface-variant/30 p-10 flex flex-col justify-between relative overflow-hidden border-r border-white/5 hidden md:flex">
                 <div>
                    <h2 className="font-display-lg text-2xl font-bold text-primary tracking-tight mb-2">VayuMitra X</h2>
                    <p className="text-on-surface-variant text-sm mb-8">Deploying advanced neural networks for atmospheric threat detection.</p>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                          <span className="material-symbols-outlined text-primary text-[20px]">security</span>
                       </div>
                       <div>
                          <h4 className="font-bold text-sm text-on-surface">End-to-End Encryption</h4>
                          <p className="text-xs text-on-surface-variant mt-1">Your telemetry data is cryptographically secured.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                          <span className="material-symbols-outlined text-secondary text-[20px]">cloud_sync</span>
                       </div>
                       <div>
                          <h4 className="font-bold text-sm text-on-surface">Cloud Synchronization</h4>
                          <p className="text-xs text-on-surface-variant mt-1">Real-time DB mirroring across all active sensor arrays.</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 text-xs font-label-mono text-on-surface-variant opacity-60">
                    System Version 2.1.0-RC4 <br/>© 2026 Atmospheric Intelligence
                 </div>
              </div>
              
              {/* Right Side: Form */}
              <div className="md:w-7/12 p-8 md:p-10 flex flex-col justify-center relative">
                  <button onClick={() => setShowRegistration(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-surface-variant/50 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>

                  <h3 className="font-headline-lg text-3xl font-bold text-on-surface mb-2">
                    {isSignInMode ? 'Authenticate Node' : 'Initialize Node'}
                  </h3>
                  <p className="text-on-surface-variant text-sm mb-8">
                    {isSignInMode ? 'Enter your credentials to access the sensor array.' : 'Register your credentials to authenticate a new sensor array.'}
                  </p>

                  <div className="space-y-5">
                    {!isSignInMode && (
                      <div className="grid grid-cols-2 gap-5">
                        <div className="relative group">
                          <input type="text" id="fname" className="peer w-full bg-surface-variant/30 border border-outline-variant/50 rounded-xl px-4 py-3.5 pt-6 text-black focus:border-primary focus:bg-surface-variant/50 outline-none transition-all placeholder-transparent" placeholder="First Name" />
                          <label htmlFor="fname" className="absolute left-4 top-2 text-[10px] font-bold text-primary tracking-wider uppercase transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-on-surface-variant peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">First Name</label>
                        </div>
                        <div className="relative group">
                          <input type="text" id="lname" className="peer w-full bg-surface-variant/30 border border-outline-variant/50 rounded-xl px-4 py-3.5 pt-6 text-black focus:border-primary focus:bg-surface-variant/50 outline-none transition-all placeholder-transparent" placeholder="Last Name" />
                          <label htmlFor="lname" className="absolute left-4 top-2 text-[10px] font-bold text-primary tracking-wider uppercase transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-on-surface-variant peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">Last Name</label>
                        </div>
                      </div>
                    )}
                    
                    <div className="relative group">
                      <input type="email" id="email" className="peer w-full bg-surface-variant/30 border border-outline-variant/50 rounded-xl px-4 py-3.5 pt-6 text-black focus:border-primary focus:bg-surface-variant/50 outline-none transition-all placeholder-transparent" placeholder="Official Email" />
                      <label htmlFor="email" className="absolute left-4 top-2 text-[10px] font-bold text-primary tracking-wider uppercase transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-on-surface-variant peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">Official Email</label>
                    </div>

                    <div className="relative group">
                      <input type="password" id="pass" className="peer w-full bg-surface-variant/30 border border-outline-variant/50 rounded-xl px-4 py-3.5 pt-6 text-black focus:border-primary focus:bg-surface-variant/50 outline-none transition-all placeholder-transparent" placeholder="Access Key" />
                      <label htmlFor="pass" className="absolute left-4 top-2 text-[10px] font-bold text-primary tracking-wider uppercase transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-on-surface-variant peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary pointer-events-none">Access Key (Password)</label>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant cursor-pointer hover:text-primary text-sm">visibility</span>
                    </div>
                  </div>

                  <button className="w-full mt-8 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-xl shadow-[0_4px_14px_0_rgba(2,132,199,0.39)] hover:shadow-[0_6px_20px_rgba(2,132,199,0.23)] hover:scale-[1.02] transition-all duration-200 uppercase tracking-widest text-sm" onClick={() => setShowRegistration(false)}>
                    {isSignInMode ? 'Authenticate' : 'Authenticate & Register'}
                  </button>
                  
                  <div className="mt-6 text-center">
                    <span className="text-on-surface-variant text-sm">
                      {isSignInMode ? 'Need authorization? ' : 'Already an operative? '}
                    </span>
                    <button 
                      className="text-primary font-bold hover:underline cursor-pointer" 
                      onClick={() => setIsSignInMode(!isSignInMode)}
                    >
                      {isSignInMode ? 'Sign Up' : 'Sign In'}
                    </button>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* Ambient Background Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[150px]"></div>
      </div>
      
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-white/10 shadow-[0_0_12px_rgba(47,217,244,0.15)] flex justify-between items-center px-6 md:px-12 h-16">
        <div className="font-headline-md text-headline-md font-bold tracking-tight text-primary">
            VayuMitra X | Differential Optical AirSense
        </div>
        <div className="flex items-center gap-4">
            <button onClick={() => document.documentElement.classList.toggle('dark')} className="text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95 transition-transform flex items-center justify-center p-2 rounded-full" title="Toggle Day/Night Mode">
                <span className="material-symbols-outlined">light_mode</span>
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95 transition-transform flex items-center justify-center p-2 rounded-full"><span className="material-symbols-outlined">sensors</span></button>
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95 transition-transform flex items-center justify-center p-2 rounded-full"><span className="material-symbols-outlined">visibility</span></button>
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer active:scale-95 transition-transform flex items-center justify-center p-2 rounded-full hidden sm:block"><span className="material-symbols-outlined">schedule</span></button>
            <button 
              onClick={() => {
                setIsSignInMode(true);
                setShowRegistration(true);
              }} 
              className="bg-primary/20 text-primary border border-primary/50 px-4 py-1.5 rounded-full font-label-mono text-sm ml-2 hover:bg-primary/30 transition-colors hidden sm:block"
            >
              LOGIN
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow z-10 flex flex-col items-center justify-center pt-24 pb-12 px-6 md:px-12 relative">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 relative z-20">
            <h1 className="font-display-lg text-display-lg text-primary mb-6 drop-shadow-[0_0_8px_rgba(138,235,255,0.4)]">
                VayuMitra X
            </h1>
            <p className="font-headline-md text-headline-md text-on-surface-variant mb-10 max-w-2xl mx-auto">
                See the invisible. Understand the atmosphere.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button onClick={() => handleLaunch(false)} className="bg-primary text-on-primary px-8 py-4 rounded-lg font-label-mono text-label-mono uppercase tracking-wider hover:bg-primary-container transition-all active:scale-95 glow-active flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                    Launch Dashboard
                </button>
                <button onClick={() => handleLaunch(false)} className="glass-panel border-primary/50 text-primary px-8 py-4 rounded-lg font-label-mono text-label-mono uppercase tracking-wider hover:bg-primary/10 transition-all active:scale-95 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">sensors</span>
                    Start Live Sensor
                </button>
                <button onClick={() => handleLaunch(true)} className="glass-panel border-outline text-on-surface px-8 py-4 rounded-lg font-label-mono text-label-mono uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">explore</span>
                    Explore Demo
                </button>
            </div>
        </div>

        {/* Conceptual Diagram Area */}
        <div className="w-full max-w-6xl mx-auto glass-panel rounded-xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>
            <div className="relative z-10 w-full text-center">
                <p className="font-label-mono text-label-mono text-primary/70 uppercase tracking-widest mb-8">System Architecture Diagram</p>
                
                {/* Diagram */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full">
                    {/* Node 1: Laser */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full border border-primary bg-primary/10 flex items-center justify-center mb-4 relative">
                            <div className="absolute inset-0 rounded-full border border-primary animate-[ping_3s_ease-in-out_infinite]"></div>
                            <span className="material-symbols-outlined text-primary text-[32px]">highlight</span>
                        </div>
                        <span className="font-label-mono text-caption text-on-surface-variant uppercase">Laser Emitter</span>
                    </div>
                    
                    {/* Connector */}
                    <div className="hidden md:flex h-px w-16 bg-gradient-to-r from-primary to-secondary relative">
                        <div className="absolute w-2 h-2 bg-white rounded-full top-1/2 -translate-y-1/2 animate-[ping_1.5s_linear_infinite]"></div>
                    </div>
                    <div className="md:hidden w-px h-8 bg-gradient-to-b from-primary to-secondary"></div>
                    
                    {/* Node 2: Air Path */}
                    <div class="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-xl border border-secondary bg-secondary/10 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-secondary text-[32px]">air</span>
                        </div>
                        <span className="font-label-mono text-caption text-on-surface-variant uppercase">Air Path</span>
                    </div>
                    
                    {/* Connector */}
                    <div className="hidden md:flex h-px w-16 bg-gradient-to-r from-secondary to-tertiary relative">
                        <div className="absolute w-2 h-2 bg-white rounded-full top-1/2 -translate-y-1/2 animate-[ping_1.5s_linear_infinite] delay-300"></div>
                    </div>
                    <div className="md:hidden w-px h-8 bg-gradient-to-b from-secondary to-tertiary"></div>
                    
                    {/* Node 3: Camera */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-xl border border-tertiary bg-tertiary/10 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-tertiary text-[32px]">photo_camera</span>
                        </div>
                        <span className="font-label-mono text-caption text-on-surface-variant uppercase">Optical Sensor</span>
                    </div>
                    
                    {/* Connector */}
                    <div className="hidden md:flex h-px w-16 bg-gradient-to-r from-tertiary to-primary-container relative">
                        <div className="absolute w-2 h-2 bg-white rounded-full top-1/2 -translate-y-1/2 animate-[ping_1.5s_linear_infinite] delay-500"></div>
                    </div>
                    <div className="md:hidden w-px h-8 bg-gradient-to-b from-tertiary to-primary-container"></div>
                    
                    {/* Node 4: AI */}
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full border-2 border-primary-container bg-primary-container/20 flex items-center justify-center mb-4 glow-active">
                            <span className="material-symbols-outlined text-primary-container text-[40px]">memory</span>
                        </div>
                        <span className="font-label-mono text-caption text-primary uppercase font-bold">Fusion AI</span>
                    </div>
                </div>

                <div className="mt-12 max-w-3xl mx-auto p-4 rounded-lg bg-surface/50 border border-white/5 inline-block">
                    <p className="font-body-md text-on-surface text-center">
                         Continuous volumetric analysis extracting particulate density and compositional indices in real-time.
                    </p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
