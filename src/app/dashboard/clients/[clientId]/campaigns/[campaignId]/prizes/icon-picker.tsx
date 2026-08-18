"use client";

import React, { useState } from "react";
import { Check, getPrizeIcon, prizeIconNames } from "@/components/prizes/prize-icons";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  name: string;
  value?: string;
  onChange?: (iconName: string) => void;
}

export function IconPicker({ name, value, onChange }: IconPickerProps) {
  const [selected, setSelected] = useState(value || "Gift");

  const handleSelect = (iconName: string) => {
    setSelected(iconName);
    if (onChange) onChange(iconName);
  };

  return (
    <div className="space-y-3">
      {/* Hidden input to submit with forms */}
      <input type="hidden" name={name} value={selected} />
      
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-2 border border-border rounded-md bg-surface-elevated">
        {prizeIconNames.map((iconName) => {
          const IconComponent = getPrizeIcon(iconName);
          
          const isSelected = selected === iconName;
          
          return (
            <button
              key={iconName}
              type="button"
              onClick={() => handleSelect(iconName)}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-md border transition-all",
                isSelected 
                  ? "border-primary bg-[rgba(24,60,202,.1)] text-primary" 
                  : "border-transparent text-foreground-secondary hover:bg-surface hover:text-foreground"
              )}
              title={iconName}
            >
              <IconComponent className="h-5 w-5" />
              {isSelected && (
                <div className="absolute -right-1 -top-1 rounded-full bg-primary p-[2px] text-background">
                  <Check className="h-2 w-2 stroke-[4]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
