import React from "react";
import { cn } from "../../utils/cn";

export const Input = React.forwardRef(({ className, type, error, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border-[0.5px] bg-neutral-50 px-3 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500",
        error 
          ? "bg-error-bg border-border-error focus-visible:ring-border-error" 
          : "border-border-default focus-visible:ring-brand-600",
        "placeholder:text-neutral-500 text-text-primary",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";
