import React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, actions, breadcrumb, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn("mb-6 flex flex-col justify-between gap-4 border-b border-border pb-5 sm:mb-8 sm:pb-6 md:flex-row md:items-center", className)}
        {...props}
      >
        <div className="flex flex-col gap-1.5">
          {breadcrumb && <div className="text-sm text-foreground-muted mb-2">{breadcrumb}</div>}
          <h1 className="text-2xl font-bold text-foreground leading-tight tracking-tight sm:text-[28px] md:text-[32px]">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-foreground-secondary max-w-2xl">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3 md:mt-0 [&_a]:w-full [&_button]:w-full sm:[&_a]:w-auto sm:[&_button]:w-auto">
            {actions}
          </div>
        )}
      </header>
    );
  }
);
PageHeader.displayName = "PageHeader";
