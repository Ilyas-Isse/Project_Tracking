"use client";

import React, { useState, useEffect } from "react";

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
);

const PauseIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
);

const RotateIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);

export default function Focus() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play a sound or show notification here in future
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  if (!mounted) return null;

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4">
      <div className="glass rounded-[3rem] p-12 flex flex-col items-center shadow-2xl relative animate-slide-up">
        
        {/* Animated Background Ring */}
        <div className="absolute inset-0 rounded-[3rem] border-[6px] border-[hsl(var(--primary))]/10 pointer-events-none"></div>

        <h1 className="text-2xl font-bold mb-12 text-zinc-600 dark:text-zinc-300 tracking-widest uppercase">Deep Focus</h1>
        
        <div className="relative w-64 h-64 flex items-center justify-center mb-12">
          {/* Progress Circle SVG */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-200 dark:text-zinc-800/40" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" 
              strokeDasharray="283" 
              strokeDashoffset={283 - (283 * progress) / 100} 
              strokeLinecap="round"
              className="text-[hsl(var(--primary))] transition-all duration-1000 ease-linear" 
            />
          </svg>
          <div className="text-6xl font-black text-zinc-900 dark:text-white tabular-nums tracking-tighter">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={resetTimer}
            className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm hover:shadow-md"
          >
            <RotateIcon className="w-6 h-6" />
          </button>
          
          <button 
            onClick={toggleTimer}
            className="p-6 rounded-2xl bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary-hover))] transition-all shadow-lg shadow-[hsl(var(--primary))]/30 hover:scale-105 active:scale-95"
          >
            {isActive ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8 ml-1" />}
          </button>
        </div>

      </div>
    </div>
  );
}
