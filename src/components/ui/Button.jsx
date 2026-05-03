import React from "react";
import { cn } from "../../utils/cn";

export const Button = React.forwardRef(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 disabled:cursor-not-allowed disabled:opacity-50 rounded-xl active:scale-[0.98]",
          {
            /* Primary Variant */
            "bg-brand-800 text-brand-50 hover:bg-brand-700 shadow-md shadow-brand-900/10 border-none":
              variant === "primary" || variant === "default",
            
            /* Secondary Variant */
            "bg-brand-50 text-brand-800 border border-brand-200 hover:bg-brand-100 hover:border-brand-300":
              variant === "secondary" || variant === "outline",
            
            /* Gold / Award Variant */
            "bg-accent-400 text-accent-900 hover:bg-accent-300 shadow-md shadow-accent-900/10 border-none":
              variant === "accent" || variant === "gold",
            
            /* Danger Variant */
            "bg-error-bg text-error-text border border-error-border hover:bg-red-100 hover:border-red-200":
              variant === "danger" || variant === "destructive",
            
            /* Ghost Variant */
            "bg-transparent hover:bg-neutral-100 text-text-secondary hover:text-text-primary":
              variant === "ghost",

            /* Dark Variant */
            "bg-brand-900 text-brand-50 hover:bg-brand-800 border-none":
              variant === "dark",

            /* Sizes */
            "px-6 py-2.5 h-11": size === "default",
            "px-4 py-2 h-9 text-xs": size === "sm",
            "px-8 py-3 h-14 text-base": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

