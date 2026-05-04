import React from "react";
import { cn } from "../../utils/cn";

/**
 * Page title block for admin views — follows Mawaheb type scale (display / body / caption).
 */
export function AdminPageHeader({ title, description, className, actions = null }) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-text-primary sm:text-[24px] sm:leading-[1.3]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-text-secondary">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
