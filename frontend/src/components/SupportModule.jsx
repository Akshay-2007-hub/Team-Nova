import React, { useState } from 'react';

export default function SupportModule() {
  const [ticketSent, setTicketSent] = useState(false);

  const handleSendTicket = (e) => {
    e.preventDefault();
    setTicketSent(true);
    setTimeout(() => setTicketSent(false), 3000);
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      
      <div className="glass-panel !bg-slate-900 !border-slate-700 p-8 flex flex-col relative overflow-hidden group">
        <h2 className="font-headline-md text-2xl font-bold !text-slate-100 flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary text-3xl">contact_support</span>
          Technical Support
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div className="space-y-6">
            <h3 className="font-bold text-slate-300 uppercase tracking-widest text-sm border-b border-slate-700 pb-2">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
               <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                 <div className="font-bold text-primary mb-1 flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">psychology</span> How is the Risk Score calculated?
                 </div>
                 <div className="text-sm text-slate-400">
                   The system uses an MOG2 optical background subtractor to detect anomalies (particles) in the video feed. This optical score is fused with live meteorological wind-speed data to calculate a synthesized Risk Score out of 100.
                 </div>
               </div>

               <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                 <div className="font-bold text-primary mb-1 flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">videocam_off</span> Why is my camera feed black?
                 </div>
                 <div className="text-sm text-slate-400">
                   Ensure that no other applications (like Zoom or Teams) are using your webcam. The Python backend script requires exclusive access to `cv2.VideoCapture(0)`.
                 </div>
               </div>

               <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                 <div className="font-bold text-primary mb-1 flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">tune</span> Can I adjust the AI sensitivity?
                 </div>
                 <div className="text-sm text-slate-400">
                   Yes, navigate to the **System Settings** module or the **Optical Sensor** module to dynamically adjust the MOG2 threshold and sensitivity sliders while the engine is running.
                 </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-slate-300 uppercase tracking-widest text-sm border-b border-slate-700 pb-2">Open a Diagnostics Ticket</h3>
            
            <form onSubmit={handleSendTicket} className="space-y-4 bg-slate-800/30 p-6 rounded-xl border border-slate-700">
               <div>
                 <label className="block text-xs font-bold text-slate-400 mb-1">Issue Category</label>
                 <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:border-primary outline-none">
                   <option>Camera / Optical Engine Error</option>
                   <option>Meteorological API Disconnection</option>
                   <option>Frontend UI Glitch</option>
                   <option>Other...</option>
                 </select>
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-400 mb-1">Description</label>
                 <textarea 
                   className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-sm focus:border-primary outline-none" 
                   rows="4" 
                   placeholder="Describe what went wrong..."
                   required
                 ></textarea>
               </div>

               <div>
                 <label className="flex items-center gap-2 text-sm text-slate-400">
                   <input type="checkbox" className="accent-primary" defaultChecked />
                   Include latest telemetry snapshot log
                 </label>
               </div>

               <button 
                 type="submit" 
                 className={`w-full py-3 rounded font-bold transition-all ${ticketSent ? 'bg-green-500 text-white' : 'bg-primary text-on-primary hover:bg-primary-fixed'}`}
               >
                 {ticketSent ? 'Ticket Submitted Successfully!' : 'Submit Support Ticket'}
               </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
