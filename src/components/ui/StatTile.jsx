import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../../utils/cn";

const fmt = new Intl.NumberFormat("ar-YE-u-nu-latn");

const formatValue = (v) => (typeof v === "number" ? fmt.format(v) : v ?? "—");

/**
 * Stat tile (§4.7): label (label-sm), value (display-md, tabular digits), one
 * comparison line in words. The whole tile links to the list it counts
 * ("numbers are doors") when `to` is given.
 * `trend` colors the comparison only when up/down has a clear meaning.
 */
export function StatTile({ label, value, suffix, hint, trend, to, icon: Icon, className }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-label-sm text-text-secondary">{label}</p>
        {Icon ? <Icon className="size-5 shrink-0 text-text-tertiary" aria-hidden="true" /> : null}
      </div>
      <p className="num mt-1 font-display text-[28px] font-bold leading-[42px] text-text-primary sm:text-display-md">
        {formatValue(value)}
        {suffix ? <small className="ms-1 text-lg font-semibold text-text-tertiary">{suffix}</small> : null}
      </p>
      {hint ? (
        <p
          className={cn(
            "flex items-center gap-1 text-[13px] leading-5",
            trend === "up" ? "text-success-700" : trend === "down" ? "text-danger-700" : "text-text-secondary"
          )}
        >
          {trend === "up" ? <ArrowUp className="size-4" aria-hidden="true" /> : null}
          {trend === "down" ? <ArrowDown className="size-4" aria-hidden="true" /> : null}
          {hint}
        </p>
      ) : null}
    </>
  );
  const cls = cn(
    "block min-w-0 rounded-lg border border-border-default bg-surface px-4 py-4 sm:px-6 sm:py-5",
    className
  );
  if (to) {
    return (
      <Link
        to={to}
        className={cn(cls, "transition-shadow duration-150 hover:shadow-raised")}
      >
        {body}
      </Link>
    );
  }
  return <div className={cls}>{body}</div>;
}

// Four per row on desktop, two on tablets, one on phones.
export function StatTiles({ children, cols = 4, className }) {
  const grid =
    {
      2: "sm:grid-cols-2",
      3: "sm:grid-cols-2 lg:grid-cols-3",
      4: "sm:grid-cols-2 xl:grid-cols-4",
      5: "sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5",
      6: "sm:grid-cols-2 lg:grid-cols-3",
    }[cols] || "sm:grid-cols-2 xl:grid-cols-4";
  return <div className={cn("grid grid-cols-1 gap-4", grid, className)}>{children}</div>;
}

export default StatTile;
