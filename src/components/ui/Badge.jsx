import React from "react";
import { BadgeCheck } from "lucide-react";
import { cn } from "../../utils/cn";

// Status badges and scope tags look deliberately different, so state is
// never confused with identity (§4.7).

const STATUS_TONES = {
  success: "bg-success-50 text-success-700 before:bg-success-600",
  warning: "bg-warning-50 text-warning-700 before:bg-warning-600",
  danger: "bg-danger-50 text-danger-700 before:bg-danger-600",
  info: "bg-info-50 text-info-700 before:bg-info-600",
  neutral: "bg-neutral-100 text-text-secondary before:bg-neutral-500",
  hidden: "border border-dashed border-neutral-500 bg-transparent text-text-secondary before:bg-neutral-400",
};

// 24 px, radius-sm, status background, 8 px dot, status text.
export function StatusBadge({ tone = "neutral", children, className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 max-w-full items-center gap-1.5 whitespace-nowrap rounded-sm px-2 text-label-sm",
        "before:size-2 before:shrink-0 before:rounded-full before:content-['']",
        STATUS_TONES[tone] || STATUS_TONES.neutral,
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
    </span>
  );
}

// Outline in the scope's brand.border with a small square glyph. Pass
// scope="institute" to render it in Institute colors anywhere.
export function ScopeTag({ scope, children, className }) {
  return (
    <span
      data-scope={scope}
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-sm border border-brand-border bg-surface px-2 text-label-sm text-brand-text",
        "before:size-2 before:shrink-0 before:rounded-[2px] before:bg-brand-strong before:content-['']",
        className
      )}
    >
      {children}
    </span>
  );
}

// "Verified by Mawaheb" — the one fixed use of gold, in both scopes.
export function HonorBadge({ children = "موثّق من مواهب", className }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-sm bg-honor-bg px-2 text-label-sm text-honor-fg",
        className
      )}
    >
      <BadgeCheck className="size-4" aria-hidden="true" />
      {children}
    </span>
  );
}

// Count pill: minimum 20 px, brand.strong fill. Caps at "99+".
export function Count({ value, className, label }) {
  if (value == null) return null;
  const text = value > 99 ? "99+" : String(value);
  return (
    <span
      aria-label={label}
      className={cn(
        "num inline-grid h-5 min-w-5 place-items-center rounded-full bg-brand-strong px-1.5 text-xs font-semibold leading-5 text-brand-on-strong",
        className
      )}
    >
      {text}
    </span>
  );
}

// Neutral chip for categories and skills (not a status).
export function Chip({ children, className }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center whitespace-nowrap rounded-sm bg-subtle px-2.5 text-[13px] text-text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
}
