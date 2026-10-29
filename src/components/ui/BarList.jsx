import React from "react";
import { Link } from "react-router-dom";
import { formatNumber } from "../../utils/format";

/**
 * Single-series horizontal bars (§4.7 "Charts"): one hue (chart.scope),
 * bars grow from the inline-start edge, values and labels in text colors, and
 * the exact numbers are always visible as text — so no separate table view
 * is needed. Rows with `to` link to the list they count.
 */
export function BarList({ rows, label }) {
  const max = Math.max(1, ...rows.map((r) => r.value || 0));
  return (
    <ul aria-label={label} className="space-y-3">
      {rows.map((r) => {
        const body = (
          <>
            <span className="truncate text-text-secondary">{r.label}</span>
            <span className="h-3.5" aria-hidden="true">
              <span
                className="block h-full rounded-e-sm bg-chart-scope"
                style={{ width: `${((r.value || 0) / max) * 100}%`, minWidth: r.value ? 4 : 0 }}
              />
            </span>
            <span className="num text-end text-text-secondary">{formatNumber(r.value || 0)}</span>
          </>
        );
        const cls = "grid grid-cols-[minmax(0,120px)_1fr_48px] items-center gap-3 text-sm sm:grid-cols-[minmax(0,180px)_1fr_56px]";
        return (
          <li key={r.label}>
            {r.to ? (
              <Link to={r.to} className={`${cls} -mx-1 rounded-md px-1 py-0.5 hover:bg-subtle`}>
                {body}
              </Link>
            ) : (
              <div className={cls}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default BarList;
