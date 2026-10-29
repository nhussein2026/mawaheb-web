import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { useShell } from "../shell/ShellContext";

/**
 * Drawer (§4.7): 480 or 640 px from the inline-end edge (left in Arabic),
 * for quick views and short tasks — never long forms. Focus moves in, Esc
 * closes, focus returns to the trigger.
 */
export function Drawer({ open, onClose, title, children, footer, size = "md" }) {
  const panelRef = useRef(null);
  const titleId = useId();
  // Portaled to <body>, so carry the page's brand scope explicitly.
  const { scope } = useShell();
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return undefined;
    const trigger = document.activeElement;
    panelRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCloseRef.current?.();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      trigger?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[1200]" dir="rtl" data-scope={scope}>
      <div className="absolute inset-0 bg-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "absolute inset-y-0 end-0 flex w-full flex-col bg-surface shadow-modal outline-none",
          "animate-[mw-fade-in_240ms_var(--ease-enter)]",
          size === "lg" ? "sm:max-w-[640px]" : "sm:max-w-[480px]"
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border-subtle px-4 py-3 sm:px-6">
          <h2 id={titleId} className="font-display text-heading-3 text-text-primary">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            title="إغلاق"
            className="-me-2 grid size-10 place-items-center rounded-md text-text-secondary hover:bg-subtle"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">{children}</div>
        {footer ? <div className="flex shrink-0 justify-end gap-2 border-t border-border-subtle px-4 py-3 sm:px-6">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
}

export default Drawer;
