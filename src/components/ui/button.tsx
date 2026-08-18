import { cn } from "@/lib/utils";
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-semibold transition-all duration-[220ms] ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-[1px] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          size === "sm" && "h-9 px-3 text-xs",
          size === "md" && "h-11 px-4 text-sm", // 44px
          size === "lg" && "h-12 px-6 text-base",
          variant === "primary" &&
            "bg-primary text-background hover:bg-primary-hover shadow-sm",
          variant === "secondary" &&
            "bg-surface text-foreground hover:bg-surface-elevated border border-border",
          variant === "ghost" &&
            "text-foreground-secondary hover:bg-surface hover:text-foreground",
          variant === "danger" &&
            "bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
