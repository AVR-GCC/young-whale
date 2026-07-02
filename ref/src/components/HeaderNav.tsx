import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Compass, Orbit, Sparkles } from 'lucide-react';

interface HeaderNavProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  playAudioFeedback: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ 
  soundEnabled, 
  onToggleSound,
  playAudioFeedback 
}) => {
  const [secondsLeft, setSecondsLeft] = useState(7200); // 2 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 7200; // loop back to 2h for prototyping infinity
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    const paddedHrs = String(hrs).padStart(2, '0');
    const paddedMins = String(mins).padStart(2, '0');
    const paddedSecs = String(secs).padStart(2, '0');
    
    return `${paddedHrs}:${paddedMins}:${paddedSecs}`;
  };

  const handleSoundToggleClick = () => {
    onToggleSound();
    // Use setTimeout so the enabled state is captured
    setTimeout(() => {
      playAudioFeedback();
    }, 50);
  };

  return (
    <header className="w-full bg-[#070A10] border-b border-[#1E293B] px-4 py-3 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        
        {/* Left: Sports Smartwatch OS title alignment */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            {/* Minimalistic Pulsing Logo */}
            <div className="relative w-8 h-8 rounded-lg bg-terminal border border-[#1E293B] flex items-center justify-center text-cyan-400">
              <Orbit className="w-5 h-5 animate-spin-slow" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-lg opacity-20" />
            </div>
            
            <div>
              <h1 className="font-oxanium text-lg font-bold text-slate-50 tracking-normal leading-none uppercase">
                youngwhale<span className="text-cyan-400">.io</span>
              </h1>
              <p className="font-mono text-[9px] text-slate-400 tracking-widest uppercase mt-0.5">
                CURATOR_RADAR // VER_04
              </p>
            </div>
          </div>

          {/* Quick Active Signal Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#131A26] border border-[#1E293B] ml-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FA9A] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FA9A]" />
            </span>
            <span className="font-mono text-[10px] font-bold text-[#F8FAFC]">10 LISTED</span>
          </div>
        </div>

        {/* Center: Dynamic human TL;DR sentence */}
        <div className="text-center bg-deep px-4 py-2 rounded-lg border border-[#1E293B]/60 max-w-full md:max-w-md lg:max-w-xl flex items-center justify-center gap-2.5">
          <span className="text-sm font-outfit text-slate-300 tracking-wide font-light">
            🌊 Signals fading. The ocean goes silent in{' '}
            <span className="font-mono font-semibold text-[#00E5D2] px-1 py-0.5 bg-[#070A10]/80 rounded border border-[#1E293B]/40 text-xs">
              {formatCountdown(secondsLeft)}
            </span>
          </span>
        </div>

        {/* Right: Audio and system diagnostics configs */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t border-[#1E293B]/50 pt-3 md:border-none md:pt-0">
          {/* UTC Clock Readout */}
          <div className="flex flex-col text-left md:text-right">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">SYSTEM DATE (UTC)</span>
            <span className="text-xs font-mono text-[#F8FAFC] font-medium">14:07:13 • SECURED</span>
          </div>

          {/* Sonar Audio Feed Toggle */}
          <button
            type="button"
            id="audio-feed-switch"
            onClick={handleSoundToggleClick}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono tracking-wider transition-all cursor-pointer
              ${soundEnabled 
                ? 'bg-cyan-400/10 border-cyan-400/30 text-[#00E5D2] font-semibold' 
                : 'bg-[#131A26] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]'}`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                SONAR ON
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                MUTED
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
