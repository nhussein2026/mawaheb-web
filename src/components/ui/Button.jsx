import React from "react";
import { cn } from "../../utils/cn";
import { Spinner } from "./Feedback";

// Button variants (§4.7). One primary per page region; danger (solid) is only
// for the confirm button of a destructive dialog — use danger-secondary to
// start a destructive flow on a page. Legacy variant names are mapped so older
// call sites keep working.
const VARIANT_ALIASES = {
  default: "primary",
  dark: "primary",
  outline: "secondary",
  accent: "secondary",
  gold: "secondary",
  ghost: "tertiary",
  destructive: "danger-secondary",
};

const VARIANTS = {
  primary:
    "border-transparent bg-brand-strong text-brand-on-strong hover:bg-brand-strong-hover active:bg-brand-strong-pressed",
  secondary:
    "border-border-control bg-surface text-text-primary hover:bg-subtle active:bg-muted",
  tertiary:
    "border-transparent bg-transparent text-brand-strong hover:bg-brand-subtle active:bg-brand-subtle-hover",
  danger:
    "border-transparent bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-800",
  "danger-secondary":
    "border-danger-600 bg-surface text-danger-700 hover:bg-danger-50 active:bg-danger-100",
  link:
    "h-auto min-w-0 border-transparent bg-transparent px-0 text-brand-strong underline underline-offset-4 hover:text-brand-strong-hover",
};

const SIZES = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10 px-0",
  "icon-sm": "h-8 w-8 px-0",
};

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      type = "button",
      children,
      ...props
    },
    ref
  ) => {
    const v = VARIANTS[VARIANT_ALIASES[variant] || variant] || VARIANTS.primary;
    const s = SIZES[size === "default" ? "md" : size] || SIZES.md;
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(
          "relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-md border font-semibold leading-[22px] transition-colors duration-100 ease-[var(--ease-standard)]",
          "pointer-coarse:min-h-11",
          !loading && "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-neutral-100 disabled:text-text-disabled",
          size === "sm" ? "[&_svg]:size-4 [&_svg]:shrink-0" : "[&_svg]:size-5 [&_svg]:shrink-0",
          // Loading keeps the label and swaps the leading icon for a spinner
          loading && "cursor-progress [&>svg]:hidden",
          s,
          v,
          className
        )}
        {...props}
      >
        {loading ? <Spinner className="size-4" /> : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// Square, tertiary-look button for toolbars and row actions. Always pass a
// `label`: it becomes the accessible name and the tooltip.
export const IconButton = React.forwardRef(
  ({ label, className, size = "md", tone = "neutral", children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-md transition-colors duration-100 pointer-coarse:min-h-11 pointer-coarse:min-w-11",
        "disabled:cursor-not-allowed disabled:text-text-disabled",
        size === "sm" ? "h-8 w-8 [&_svg]:size-4" : "h-10 w-10 [&_svg]:size-5",
        tone === "danger"
          ? "text-danger-700 hover:bg-danger-50"
          : tone === "brand"
            ? "text-brand-strong hover:bg-brand-subtle"
            : "text-text-secondary hover:bg-subtle hover:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
IconButton.displayName = "IconButton";

export default Button;
