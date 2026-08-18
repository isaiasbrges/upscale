import { cn } from "@/lib/utils";
import React from "react";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("text-xs font-semibold text-foreground-secondary mb-1.5 block", className)}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";
