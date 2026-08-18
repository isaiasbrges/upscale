"use client";

import { useState, useEffect } from "react";
import type { CountdownConfig } from "@/lib/blocks/countdown";

export function CountdownBlock({ config, preview = false }: { config: CountdownConfig; preview?: boolean }) {
  const { message, durationMinutes = 5, backgroundColor, textColor, timerColor } = config;
  
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (preview) {
      setTimeLeft(durationMinutes * 60);
      return;
    }

    const storageKey = "upscale_funnel_timer";
    let targetTime = sessionStorage.getItem(storageKey);
    
    if (!targetTime) {
      targetTime = (Date.now() + durationMinutes * 60 * 1000).toString();
      sessionStorage.setItem(storageKey, targetTime);
    }

    const calculateRemaining = () => {
      return Math.max(0, Math.floor((parseInt(targetTime as string) - Date.now()) / 1000));
    };

    setTimeLeft(calculateRemaining());

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [durationMinutes, preview]);

  const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const s = (timeLeft % 60).toString().padStart(2, "0");

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <div 
      className="w-full sticky top-0 z-50 border-b border-zinc-900 shadow-lg"
      style={{ backgroundColor: backgroundColor || "#080808", color: textColor || "#ffffff" }}
    >
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
        {/* Left Side: Message */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div 
            className="w-2 h-2 rounded-full shrink-0 animate-pulse" 
            style={{ backgroundColor: timerColor || "#E53935", boxShadow: `0 0 8px ${timerColor || "#E53935"}` }}
          />
          <span className="text-xs sm:text-sm font-bold tracking-wide uppercase truncate">
            {message}
          </span>
        </div>

        {/* Right Side: Timer */}
        <div 
          className="text-xl sm:text-2xl font-black tracking-widest shrink-0 ml-4 font-mono"
          style={{ color: timerColor || "#E53935" }}
        >
          {m}:{s}
        </div>
      </div>
    </div>
  );
}
