import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { useShell } from "../shell/ShellContext";
import { Button } from "./Button";
import { Input } from "./Input";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const SIZES = {
  sm: "sm:max-w-[400px]",
  md: "sm:max-w-[560px]",
  lg: "sm:max-w-[720px]",
  xl: "sm:max-w-[960px]",
};

/**
 * Dialog (§4.7): small 400, medium 560, large 720; a full-screen sheet on
 * phones. Focus moves in and returns to the trigger; Tab is held inside; Esc
 * closes unless work is in progress (`busy`).
 */
export function Dialog({
  open = true,
  onClose,
  title,
  description,
  size = "md",
  busy = false,
  initialFocusRef,
  footer,
  children,
  className,
}) {
  const panelRef = useRef(null);
  const titleId = useId();
  const descId = useId();
  // Portaled to <body>, so carry the page's brand scope explicitly.
  const { scope } = useShell();
  const onCloseRef = useRef(onClose);
  const busyRef = useRef(busy);

  useEffect(() => {
    onCloseRef.current = onClose;
    busyRef.current = busy;
  });

  useEffect(() => {
    if (!open) return undefined;
    const trigger = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Focus the first field of a form dialog; otherwise the requested
    // element, or the dialog itself so its title is announced and a stray
    // Enter cannot confirm anything.
    const focusFirst = () => {
      const target =
        initialFocusRef?.current ||
        panelRef.current?.querySelector("[data-autofocus]") ||
        panelRef.current?.querySelector(
          'input:not([disabled]):not([type="hidden"]):not([type="file"]), select:not([disabled]), textarea:not([disabled])'
        );
      (target || panelRef.current)?.focus();
    };
    focusFirst();

    const onKey = (e) => {
      if (e.key === "Escape" && !busyRef.current) {
        e.stopPropagation();
        onCloseRef.current?.();
      }
      if (e.key === "Tab" && panelRef.current) {
        const items = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter(
          (el) => el.offsetParent !== null
        );
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (trigger && typeof trigger.focus === "function") trigger.focus();
    };
  }, [open, initialFocusRef]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1300] flex items-stretch justify-center bg-backdrop sm:items-start sm:overflow-y-auto sm:p-6 md:p-10"
      dir="rtl"
      data-scope={scope}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose?.();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "flex w-full flex-col bg-surface shadow-modal outline-none",
          "animate-[mw-rise-in_240ms_var(--ease-enter)] motion-reduce:animate-[mw-fade-in_100ms]",
          "max-h-[100dvh] sm:my-auto sm:max-h-[calc(100dvh-5rem)] sm:rounded-xl",
          SIZES[size] || SIZES.md,
          className
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border-subtle px-4 py-4 sm:px-6">
          <div className="min-w-0">
            {title ? (
              <h2 id={titleId} className="font-display text-heading-3 text-text-primary">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p id={descId} className="mt-1 text-sm text-text-secondary">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => !busy && onClose?.()}
            disabled={busy}
            aria-label="إغلاق"
            title="إغلاق"
            className="-me-2 grid size-10 shrink-0 place-items-center rounded-md text-text-secondary hover:bg-subtle disabled:opacity-50"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">{children}</div>
        {footer ? (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border-subtle px-4 py-3 sm:px-6 [&>button]:flex-1 sm:[&>button]:flex-none">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}

/**
 * Confirmation dialog for tier 2 (significant) and tier 3 (irreversible)
 * actions (§4.8). The title is the action as a question, the body states the
 * consequence, the confirm button names the action. A destructive dialog opens
 * with focus on Cancel. Pass `typedConfirmation` to require typing a phrase.
 */
export function ConfirmDialog({
  open = true,
  title,
  children,
  confirmLabel,
  cancelLabel = "إلغاء",
  onConfirm,
  onClose,
  destructive = false,
  busy = false,
  typedConfirmation,
  size = "sm",
}) {
  const cancelRef = useRef(null);
  const [typed, setTyped] = useState("");
  const typedOk = !typedConfirmation || typed.trim() === typedConfirmation;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      size={size}
      busy={busy}
      initialFocusRef={destructive ? cancelRef : undefined}
      footer={
        <>
          <Button ref={cancelRef} variant="secondary" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "danger" : "primary"}
            onClick={onConfirm}
            loading={busy}
            disabled={!typedOk}
            aria-disabled={!typedOk || undefined}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-sm text-text-secondary">
        {children}
        {typedConfirmation ? (
          <div className="grid gap-1">
            <label className="text-label-md text-text-primary" htmlFor="typed-confirm">
              للتأكيد، يُرجى كتابة <bdi className="font-semibold">{typedConfirmation}</bdi>
            </label>
            <Input
              id="typed-confirm"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
            />
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}

export default Dialog;
