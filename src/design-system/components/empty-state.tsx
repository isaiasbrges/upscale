import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, icon, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center p-12 border border-dashed border-border rounded-md bg-surface/50",
          className
        )}
        {...props}
      >
        {icon && (
          <div className="mb-4 text-foreground-muted">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-foreground-secondary max-w-md mx-auto mb-6">
          {description}
        </p>
        {action && (
          <div>{action}</div>
        )}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";
