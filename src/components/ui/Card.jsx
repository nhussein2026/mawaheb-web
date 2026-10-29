import React from "react";
import { cn } from "../../utils/cn";

// Card (§4.7): white, 1 px border.default, radius-lg, 24 px padding (16 on
// phones). No shadow — elevation is reserved for things that float.
export function Card({ className, children, variant = "default", as = "div", ...props }) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "min-w-0 rounded-lg border",
        variant === "award"
          ? "border-accent-200 bg-brand-accent-subtle"
          : "border-border-default bg-surface",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ className, children, actions, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 px-4 pb-3 pt-4 sm:px-6 sm:pt-5",
        className
      )}
      {...props}
    >
      <div className="min-w-0 flex-1 space-y-0.5">{children}</div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

// Card titles are heading-3 (Kufi, 20 px). Pass as="h3"/"h2" to fit the outline.
export function CardTitle({ className, children, as = "h2", ...props }) {
  const Tag = as;
  return (
    <Tag
      className={cn("font-display text-heading-3 text-text-primary", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("text-sm text-text-tertiary", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("px-4 pb-4 pt-2 sm:px-6 sm:pb-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle px-4 py-3 text-xs text-text-tertiary sm:px-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
