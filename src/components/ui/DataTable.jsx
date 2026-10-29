import React, { useEffect, useRef } from "react";
import { cn } from "../../utils/cn";

// Data table (§4.7): bg.subtle sticky header in label-sm, 44 px rows divided
// by border.subtle, no zebra stripes, neutral-50 hover. Tables scroll
// sideways inside their own container, never the page.
// On phones each row becomes a card (§4.7). Cells are labelled from the
// header row automatically; a header with no visible text (e.g. actions)
// leaves its cells unlabelled. Pass cards={false} for wide grids such as
// matrices that must keep their columns.
function useCardLabels(ref, enabled) {
  useEffect(() => {
    const root = ref.current;
    if (!enabled || !root) return undefined;
    const apply = () => {
      const heads = [...root.querySelectorAll("thead tr:last-child th")].map((th) =>
        th.querySelector(".sr-only") ? "" : th.textContent.trim()
      );
      root.querySelectorAll("tbody tr").forEach((tr) => {
        if (tr.hasAttribute("data-state")) return;
        [...tr.children].forEach((td, i) => {
          // The first column identifies the row and leads the card unlabelled.
          if (td.colSpan > 1 || i === 0) return;
          const label = heads[i];
          if (label && !td.hasAttribute("data-label")) td.setAttribute("data-label", label);
        });
      });
    };
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(root, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, [ref, enabled]);
}

export function Table({ className, wrapperClassName, caption, cards = true, children, ...props }) {
  const ref = useRef(null);
  useCardLabels(ref, cards);
  return (
    <div
      ref={ref}
      className={cn("relative w-full overflow-x-auto", cards && "mw-cards", wrapperClassName)}
      tabIndex={0}
      role="region"
      aria-label={caption || "جدول"}
    >
      <table className={cn("w-full border-collapse text-sm", className)} {...props}>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn("sticky top-0 z-[1] bg-subtle", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableFooter({ className, ...props }) {
  return (
    <tfoot
      className={cn("border-t border-border-default bg-subtle font-semibold", className)}
      {...props}
    />
  );
}

export function TableRow({ className, selected, ...props }) {
  return (
    <tr
      aria-selected={selected || undefined}
      className={cn(
        "border-b border-border-subtle transition-colors duration-100",
        selected
          ? "bg-brand-subtle [&>td:first-child]:shadow-[inset_-3px_0_0_var(--brand-strong)]"
          : "hover:bg-neutral-50",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, numeric, ...props }) {
  return (
    <th
      scope="col"
      className={cn(
        "h-10 whitespace-nowrap border-b border-border-default px-4 text-start align-middle text-label-sm text-text-secondary",
        numeric && "text-end",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, numeric, label, ...props }) {
  return (
    <td
      data-label={label}
      className={cn(
        "h-11 px-4 py-2 align-middle text-sm text-text-primary",
        numeric && "num text-end",
        className
      )}
      {...props}
    />
  );
}

// Full-width row for loading, empty and failed states inside a table body.
export function TableStateRow({ colSpan, children }) {
  return (
    <tr data-state="">
      <td colSpan={colSpan} className="p-0">
        {children}
      </td>
    </tr>
  );
}
