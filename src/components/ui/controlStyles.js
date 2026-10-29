import { cn } from "../../utils/cn";

// Base classes for text inputs, selects and textareas (§4.7 "Form fields").
export const controlCls = cn(
  "block w-full min-w-0 rounded-md border border-border-control bg-surface px-3 text-base text-text-primary",
  "transition-colors duration-100 placeholder:text-text-tertiary",
  "hover:border-neutral-600",
  "focus:border-brand-strong focus:outline-2 focus:outline-offset-1 focus:outline-brand-strong",
  "disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-text-disabled",
  "[&[readonly]]:border-transparent [&[readonly]]:bg-subtle",
  "aria-[invalid=true]:border-2 aria-[invalid=true]:border-danger-600"
);
