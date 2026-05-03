import React from "react";
import { cn } from "../../utils/cn";

export function Table({ className, ...props }) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn("bg-neutral-100 [&_tr]:border-b-border-subtle", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

export function TableFooter({ className, ...props }) {
  return (
    <tfoot
      className={cn(
        "border-t bg-neutral-100 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn(
        "border-b border-border-subtle transition-colors hover:bg-brand-50",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-right align-middle text-[11px] font-medium uppercase tracking-[0.06em] text-neutral-700",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }) {
  return (
    <td
      className={cn("p-4 align-middle text-[13px] text-text-primary", className)}
      {...props}
    />
  );
}

