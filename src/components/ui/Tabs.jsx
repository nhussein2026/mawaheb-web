import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../utils/cn";
import { Count } from "./Badge";

const tabCls = (active) =>
  cn(
    "relative inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap px-3 text-label-md transition-colors duration-100",
    "after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:content-['']",
    active
      ? "font-semibold text-text-primary after:bg-brand-strong"
      : "font-normal text-text-secondary hover:text-text-primary after:bg-transparent"
  );

/**
 * Underline tabs (§4.7): 44 px high, 2 px brand.strong underline on the active
 * tab, counts where useful, scrolls sideways on overflow. Arrow keys move
 * between tabs (roving tabindex).
 *
 *   <Tabs value={tab} onChange={setTab} items={[{ value, label, count }]} />
 */
export function Tabs({ items, value, onChange, label, className }) {
  const refs = useRef([]);
  const onKeyDown = (e, i) => {
    const dir = document.documentElement.dir === "rtl" ? -1 : 1;
    let next = null;
    if (e.key === "ArrowRight") next = i + dir;
    if (e.key === "ArrowLeft") next = i - dir;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = items.length - 1;
    if (next == null) return;
    e.preventDefault();
    const idx = (next + items.length) % items.length;
    refs.current[idx]?.focus();
    onChange(items[idx].value);
  };
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn("flex overflow-x-auto border-b border-border-default", className)}
    >
      {items.map((t, i) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={tabCls(active)}
          >
            {t.icon ? <t.icon className="size-4" aria-hidden="true" /> : null}
            {t.label}
            {t.count != null ? <Count value={t.count} /> : null}
          </button>
        );
      })}
    </div>
  );
}

// Route-based tabs: each tab is a link, so the selected tab lives in the URL.
export function LinkTabs({ items, label, className }) {
  return (
    <nav aria-label={label} className={cn("flex overflow-x-auto border-b border-border-default", className)}>
      {items.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => tabCls(isActive)}>
          {t.icon ? <t.icon className="size-4" aria-hidden="true" /> : null}
          {t.label}
          {t.count != null ? <Count value={t.count} /> : null}
        </NavLink>
      ))}
    </nav>
  );
}

export default Tabs;
