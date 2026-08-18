"use client";

import { useState } from "react";
import type { FaqConfig } from "@/lib/blocks/faq";
import { cn } from "@/lib/utils";

export function FaqBlock({ config, preview = false }: { config: FaqConfig; preview?: boolean }) {
  const { title, items = [] } = config;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-zinc-950 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {title && <h2 className="text-3xl font-bold text-white text-center mb-10">{title}</h2>}
        
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggle(index)}
              >
                <span className="font-semibold text-zinc-100">{item.question}</span>
                <svg 
                  className={cn("w-5 h-5 text-zinc-400 transition-transform duration-200", openIndex === index ? "rotate-180" : "")} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div 
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-6 pb-4 pt-2 text-zinc-400">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center text-zinc-500">No FAQ items added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
