import React from "react";
import { cn } from "../../utils/cn";

/**
 * System pages (§5.3): say what happened and offer a way forward. Rendered
 * inside whichever shell the route lives in, or full-height on its own.
 */
export function SystemPage({ code, title, description, children, standalone = false }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 text-center",
        standalone ? "min-h-dvh bg-canvas" : "min-h-[60vh] py-12"
      )}
    >
      {code ? (
        <p className="num font-display text-display-lg text-brand-strong" aria-hidden="true">
          {code}
        </p>
      ) : null}
      <h1 className="mt-2 font-display text-heading-2 text-text-primary">{title}</h1>
      {description ? <p className="reading mt-2 text-base text-text-secondary">{description}</p> : null}
      {children ? <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{children}</div> : null}
    </div>
  );
}

export default SystemPage;
