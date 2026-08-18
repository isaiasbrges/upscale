"use client";

import type { CtaConfig } from "@/lib/blocks/cta";
import { Button } from "@/components/ui/button";

export function CtaBlock({ config, preview = false }: { config: CtaConfig; preview?: boolean }) {
  const { title, subtitle, buttonText, buttonUrl, backgroundColor, textColor, buttonColor, urgencyText } = config;

  return (
    <div 
      className="w-full py-20 px-4 text-center relative overflow-hidden"
      style={{ backgroundColor: backgroundColor || "#09090b", color: textColor || "#ffffff" }}
    >
      <div className="max-w-3xl mx-auto relative z-10">
        {title && <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">{title}</h2>}
        {subtitle && <p className="text-xl md:text-2xl mb-10 opacity-90">{subtitle}</p>}
        
        {buttonText && (
          <Button 
            className="h-16 px-10 text-xl font-bold text-zinc-950 rounded-full shadow-xl transition-transform hover:scale-105 mb-6"
            style={{ backgroundColor: buttonColor || "#facc15" }}
            onClick={() => { if (!preview && buttonUrl) window.location.href = buttonUrl; }}
          >
            {buttonText}
          </Button>
        )}
        
        {urgencyText && (
          <p className="text-sm font-medium opacity-80 animate-pulse">
            {urgencyText}
          </p>
        )}
      </div>
    </div>
  );
}
