import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "../../utils/cn";
import { useShell } from "../shell/ShellContext";
import { ScopeTag } from "./Badge";
import instituteLogo from "../../assets/logo/institute-logo.webp";

/**
 * Breadcrumbs (§4.7): up to 4 levels; separators mirror in Arabic.
 * `items` = [{ label, to? }]; the last item is the current page.
 */
export function Breadcrumbs({ items }) {
  if (!items?.length) return null;
  return (
    <nav aria-label="مسار التنقل" className="min-w-0">
      <ol className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm text-text-secondary">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
              {item.to && !last ? (
                <Link to={item.to} className="truncate hover:text-text-primary hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className="truncate" aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!last ? (
                // ChevronLeft points "forward" in RTL reading order.
                <ChevronLeft className="size-4 shrink-0 text-text-tertiary" aria-hidden="true" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Page header (§4.7): breadcrumb, title (heading-2), scope tag, one meta line,
 * actions at the inline-end. Breadcrumb and scope tag come from the shell
 * unless passed explicitly. The Institute monogram appears only in Institute
 * page headers.
 */
export function PageHeader({
  title,
  description,
  meta,
  actions,
  breadcrumbs,
  scopeTag,
  status,
  className,
}) {
  const { section, current, scope, scopeLabel } = useShell();
  const crumbs =
    breadcrumbs ??
    (section
      ? [
          section,
          ...(current && current.groupLabel && current.to !== section.to
            ? [{ label: current.groupLabel }]
            : []),
          { label: title },
        ].filter((c, i, arr) => i === 0 || c.label !== arr[i - 1].label)
      : null);
  const tag = scopeTag === undefined ? scopeLabel : scopeTag;
  return (
    <header className={cn("mb-6 space-y-2", className)}>
      {crumbs && crumbs.length > 1 ? <Breadcrumbs items={crumbs} /> : null}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {scope === "institute" ? (
              <img src={instituteLogo} alt="" width="37" height="36" className="h-9 w-auto shrink-0" />
            ) : null}
            <h1 className="font-display text-[22px] font-semibold leading-[34px] text-text-primary sm:text-heading-2">
              {title}
            </h1>
            {tag ? <ScopeTag>{tag}</ScopeTag> : null}
            {status}
          </div>
          {description || meta ? (
            <p className="reading mt-1 text-sm text-text-tertiary">{meta || description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 max-sm:w-full max-sm:[&>*]:flex-1">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default PageHeader;
