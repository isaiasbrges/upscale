"use client";

import type { OfferConfig } from "@/lib/blocks/offer";
import { Button } from "@/components/ui/button";

export function OfferBlock({ config, preview = false }: { config: OfferConfig; preview?: boolean }) {
  const { title, description, originalPrice, currentPrice, discountBadge, benefits, ctaText, ctaUrl, accentColor } = config;
  
  const benefitsList = benefits ? benefits.split("\n").filter(Boolean) : [];

  return (
    <div className="w-full bg-zinc-950 py-16 px-4">
      <div className="max-w-xl mx-auto bg-zinc-900 rounded-2xl border border-zinc-800 p-8 relative shadow-2xl">
        {discountBadge && (
          <div 
            className="absolute -top-4 -right-4 px-4 py-1.5 rounded-full text-white font-bold text-sm shadow-lg transform rotate-3"
            style={{ backgroundColor: accentColor || "#8b5cf6" }}
          >
            {discountBadge}
          </div>
        )}
        
        <div className="text-center mb-8">
          {title && <h2 className="text-3xl font-extrabold text-white mb-3">{title}</h2>}
          {description && <p className="text-zinc-400">{description}</p>}
        </div>

        <div className="text-center mb-8">
          {originalPrice && <p className="text-zinc-500 line-through mb-1">{originalPrice}</p>}
          {currentPrice && (
            <p className="text-5xl font-black" style={{ color: accentColor || "#8b5cf6" }}>
              {currentPrice}
            </p>
          )}
        </div>

        {benefitsList.length > 0 && (
          <ul className="space-y-3 mb-8">
            {benefitsList.map((benefit, i) => (
              <li key={i} className="flex items-start text-zinc-300">
                <svg className="w-5 h-5 mr-3 mt-0.5 shrink-0" style={{ color: accentColor || "#8b5cf6" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        {ctaText && (
          <Button 
            className="w-full h-14 text-lg font-bold text-white transition-transform hover:scale-[1.02]"
            style={{ backgroundColor: accentColor || "#8b5cf6" }}
            onClick={() => { if (!preview && ctaUrl) window.location.href = ctaUrl; }}
          >
            {ctaText}
          </Button>
        )}
      </div>
    </div>
  );
}
