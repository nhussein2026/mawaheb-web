import React from "react";
import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";

// Person cell (§4.7 "Data table"): 32 px avatar, name (a real link when
// `to` is given), one secondary line.
export function PersonCell({ name, secondary, src, to, secondaryLtr = false }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar name={name} src={src} size={32} />
      <div className="min-w-0">
        {to ? (
          <Link to={to} className="block truncate font-semibold text-text-primary hover:text-brand-strong hover:underline">
            {name || "—"}
          </Link>
        ) : (
          <span className="block truncate font-semibold text-text-primary">{name || "—"}</span>
        )}
        {secondary ? (
          <span className="block truncate text-xs text-text-tertiary">
            {secondaryLtr ? <bdi>{secondary}</bdi> : secondary}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default PersonCell;
