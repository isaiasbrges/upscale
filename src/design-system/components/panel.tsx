import React from "react";
import { cn } from "@/lib/utils";

export const Panel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border bg-surface text-foreground shadow-floating flex flex-col backdrop-blur-xl backdrop-saturate-150 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]", // rounded-lg maps to 20px
          className
        )}
        {...props}
      />
    );
  }
);
Panel.displayName = "Panel";

export const PanelHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between p-4 border-b border-border bg-surface/40 rounded-t-lg", className)} {...props} />
  )
);
PanelHeader.displayName = "PanelHeader";

export const PanelContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 overflow-auto p-4 sm:p-6", className)} {...props} />
  )
);
PanelContent.displayName = "PanelContent";

export const PanelFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col items-stretch gap-2 border-t border-border bg-surface/40 p-4 rounded-b-lg sm:flex-row sm:items-center [&_button]:w-full sm:[&_button]:w-auto", className)} {...props} />
  )
);
PanelFooter.displayName = "PanelFooter";
