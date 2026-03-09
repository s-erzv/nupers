import Link from 'next/link';
import { Home, ShieldAlert, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-zinc-950 overflow-hidden relative">
      {/* HUD Elements */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-sky-500/10 to-transparent pointer-events-none" />
      
      {/* Animated Scanline */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-[2px] bg-sky-500/20 animate-scan shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg w-full">
        {/* Error Code */}
        <div className="relative group">
          <div className="absolute inset-0 blur-[60px] bg-sky-500/30 rounded-full scale-150 animate-pulse" />
          <h1 className="relative text-8xl sm:text-9xl font-black text-white tracking-tighter opacity-20 group-hover:opacity-40 transition-opacity duration-700">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldAlert size={48} className="text-sky-500 animate-bounce" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-sky-500/50" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.5em] text-sky-500">System Critical</span>
            <div className="h-px w-8 bg-sky-500/50" />
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            COORDINATES_INVALID
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed px-4">
            The requested intelligence stream has been decoupled from the mainframe. Redirecting protocols recommended.
          </p>
        </div>

        {/* Action Terminal */}
        <div className="w-full bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
            <Terminal size={14} className="text-sky-500" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Protocol Recovery</span>
          </div>
          
          <Link 
            href="/"
            className="group relative flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-sky-500 text-white text-xs font-black tracking-[0.2em] hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98]"
          >
            <Home size={16} />
            RESTORE_MAIN_FEED
            <div className="absolute inset-0 rounded-xl border border-white/20 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all" />
          </Link>
        </div>

        {/* Footer HUD */}
        <div className="flex items-center gap-6 text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
            Sector_Offline
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-500/50 animate-pulse" />
            Auto_Recover_Active
          </div>
        </div>
      </div>
    </div>
  );
}