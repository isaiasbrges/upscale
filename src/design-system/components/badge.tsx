import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "neutral" | "success" | "warning" | "danger" | "info";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "neutral", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2",
          variant === "neutral" && "border-border bg-surface-elevated text-foreground",
          variant === "success" && "border-success/20 bg-success/10 text-success",
          variant === "warning" && "border-warning/20 bg-warning/10 text-warning",
          variant === "danger" && "border-danger/20 bg-danger/10 text-danger",
          variant === "info" && "border-info/20 bg-info/10 text-info",
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
