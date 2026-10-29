import React from "react";
import {
  Info,
  CircleCheck,
  TriangleAlert,
  CircleAlert,
  CircleDashed,
  SearchX,
  Inbox,
  Lock,
  RotateCw,
} from "lucide-react";
import { cn } from "../../utils/cn";

// Feedback layer (§4.8): severity always pairs color with an icon and words.

const SEVERITY = {
  info: { icon: Info, box: "border-info-200 bg-info-50", fg: "text-info-700" },
  success: { icon: CircleCheck, box: "border-success-200 bg-success-50", fg: "text-success-700" },
  warning: { icon: TriangleAlert, box: "border-warning-200 bg-warning-50", fg: "text-warning-700" },
  danger: { icon: CircleAlert, box: "border-danger-200 bg-danger-50", fg: "text-danger-700" },
  neutral: { icon: CircleDashed, box: "border-border-default bg-subtle", fg: "text-text-secondary" },
};

export function Spinner({ className, label }) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label}
      className={cn(
        "inline-block size-4 shrink-0 animate-[mw-spin_1s_linear_infinite] rounded-full border-2 border-current border-e-transparent",
        className
      )}
    />
  );
}

// A condition on this page that affects the work. Danger callouts that block
// the task are announced assertively.
export function Callout({ tone = "info", title, children, action, className, icon }) {
  const s = SEVERITY[tone] || SEVERITY.info;
  const Icon = icon || s.icon;
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-lg border px-4 py-3 text-sm", s.box, className)}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", s.fg)} aria-hidden="true" />
      <div className="min-w-0 flex-1 text-text-primary">
        {title ? <p className={cn("font-semibold", s.fg)}>{title}</p> : null}
        {children ? <div className="text-text-primary">{children}</div> : null}
      </div>
      {action ? <div className="shrink-0 self-center">{action}</div> : null}
    </div>
  );
}

// Empty states never look like errors, and errors never look empty.
const EMPTY_KIND = {
  "first-use": Inbox,
  "no-results": SearchX,
  "all-done": CircleCheck,
  "no-access": Lock,
  failed: CircleAlert,
};

export function EmptyState({
  kind = "first-use",
  title,
  description,
  action,
  onRetry,
  className,
  compact = false,
}) {
  const Icon = EMPTY_KIND[kind] || Inbox;
  const failed = kind === "failed";
  return (
    <div
      role={failed ? "alert" : undefined}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "gap-2 px-4 py-8" : "gap-3 px-6 py-12",
        className
      )}
    >
      <span
        className={cn(
          "grid size-12 place-items-center rounded-lg",
          failed ? "bg-danger-50 text-danger-700" : "bg-subtle text-text-tertiary"
        )}
      >
        <Icon className="size-6" aria-hidden="true" />
      </span>
      {title ? <p className="text-base font-semibold text-text-primary">{title}</p> : null}
      {description ? (
        <p className="max-w-[48ch] text-sm text-text-secondary">{description}</p>
      ) : null}
      {(action || onRetry) && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border-control bg-surface px-4 text-sm font-semibold text-text-primary hover:bg-subtle"
            >
              <RotateCw className="size-4" aria-hidden="true" />
              إعادة المحاولة
            </button>
          ) : null}
          {action}
        </div>
      )}
    </div>
  );
}

export function Skeleton({ className }) {
  return <span aria-hidden="true" className={cn("skeleton block h-4", className)} />;
}

export function SkeletonTiles({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-lg border border-border-default bg-surface px-6 py-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-8 w-16" />
          <Skeleton className="mt-3 h-3 w-32" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonRows({ rows = 8, className }) {
  return (
    <div className={cn("divide-y divide-border-subtle", className)}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="size-8 shrink-0 rounded-[28%]" />
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="hidden h-3 w-24 sm:block" />
          <Skeleton className="hidden h-3 w-16 md:block" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard({ className, lines = 4 }) {
  return (
    <div className={cn("rounded-lg border border-border-default bg-surface p-4 sm:p-6", className)}>
      <Skeleton className="h-5 w-40" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: lines }, (_, i) => (
          <Skeleton key={i} className={cn("h-3", i % 3 === 2 ? "w-2/3" : "w-full")} />
        ))}
      </div>
    </div>
  );
}

// Page-level skeleton: header, tiles and a card, shaped like most pages.
export function SkeletonPage({ tiles = true, label = "جارٍ التحميل…" }) {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <span className="sr-only">{label}</span>
      <div>
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-3 h-7 w-56" />
      </div>
      {tiles ? <SkeletonTiles /> : null}
      <SkeletonCard lines={6} />
    </div>
  );
}
