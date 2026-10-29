import React, { useEffect, useId, useRef, useState } from "react";
import { cn } from "../../utils/cn";

/**
 * Menu (§4.7): opens under its trigger, aligned to the inline-start edge
 * (or `align="end"`). Arrow keys, Home and End move focus; Esc closes and
 * returns focus to the trigger. Destructive items sit last after a divider.
 *
 *   <Menu trigger={(props) => <button {...props}>…</button>} label="…">
 *     <MenuItem onSelect={…}>…</MenuItem>
 *   </Menu>
 */
export function Menu({ trigger, children, align = "end", className, width = "w-64", header }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const listRef = useRef(null);
  const btnRef = useRef(null);
  const id = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    listRef.current?.querySelector('[role="menuitem"]')?.focus();
    return () => {
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) btnRef.current?.focus();
  };

  const onKeyDown = (e) => {
    const items = [...(listRef.current?.querySelectorAll('[role="menuitem"]') || [])];
    const i = items.indexOf(document.activeElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      {trigger({
        ref: btnRef,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? id : undefined,
        onClick: () => setOpen((o) => !o),
      })}
      {open ? (
        <div
          id={id}
          ref={listRef}
          role="menu"
          onKeyDown={onKeyDown}
          onClick={(e) => {
            if (e.target.closest('[role="menuitem"]')) close(false);
          }}
          className={cn(
            "absolute top-full z-[1000] mt-2 max-w-[calc(100vw-2rem)] rounded-lg border border-border-default bg-surface py-1.5 shadow-overlay",
            "animate-[mw-fade-in_160ms_var(--ease-enter)]",
            align === "end" ? "end-0" : "start-0",
            width,
            className
          )}
        >
          {header}
          {children}
        </div>
      ) : null}
    </div>
  );
}

export const MenuItem = React.forwardRef(
  ({ as = "button", icon: Icon, danger, className, children, onSelect, ...props }, ref) => {
    const Tag = as;
    return (
    <Tag
      ref={ref}
      role="menuitem"
      tabIndex={-1}
      type={Tag === "button" ? "button" : undefined}
      onClick={onSelect}
      className={cn(
        "flex min-h-10 w-full items-center gap-3 px-4 text-start text-sm outline-none",
        "focus-visible:bg-subtle hover:bg-subtle",
        danger ? "text-danger-700" : "text-text-primary",
        className
      )}
      {...props}
    >
      {Icon ? <Icon className={cn("size-4 shrink-0", danger ? "" : "text-text-secondary")} aria-hidden="true" /> : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </Tag>
    );
  }
);
MenuItem.displayName = "MenuItem";

export function MenuDivider() {
  return <div role="separator" className="my-1.5 h-px bg-border-subtle" />;
}
