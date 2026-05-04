import React from "react";
import { cn } from "../../utils/cn";

export function Card({ className, children, variant = "default", ...props }) {
  return (
    <div
      className={cn(
        "rounded-lg border-[0.5px] transition-all",
        {
          "bg-surface-card border-border-subtle shadow-sm": variant === "default",
          "bg-accent-50 border-accent-200 shadow-sm": variant === "award",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn(
        "text-base font-medium leading-none tracking-tight text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p
      className={cn("text-sm text-text-secondary", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("px-5 pb-5 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn("flex items-center p-5 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  );
}

