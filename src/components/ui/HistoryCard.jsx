import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { EmptyState, SkeletonRows } from "./Feedback";

// A card listing a person's own submissions with loading, failed and empty
// states. Children are <li> rows.
export function HistoryCard({ title, status, onRetry, count, empty, failed, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {status === "loading" ? (
          <SkeletonRows rows={3} />
        ) : status === "failed" ? (
          <EmptyState kind="failed" compact title={failed} onRetry={onRetry} />
        ) : count === 0 ? (
          <EmptyState kind="first-use" compact title={empty} />
        ) : (
          <ul className="divide-y divide-border-subtle">{children}</ul>
        )}
      </CardContent>
    </Card>
  );
}

// One history row: title + status, then body, meta line and an optional reply.
export function HistoryItem({ title, status, children, meta, reply, replyLabel }) {
  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p dir="auto" className="min-w-0 font-semibold text-text-primary">
          {title}
        </p>
        {status}
      </div>
      {children ? (
        <div dir="auto" className="reading mt-1 text-sm text-text-secondary">
          {children}
        </div>
      ) : null}
      {meta ? <p className="mt-1 text-xs text-text-tertiary">{meta}</p> : null}
      {reply ? (
        <div className="mt-2 rounded-md border-s-[3px] border-brand-border bg-subtle px-3 py-2 text-sm">
          <p className="text-label-sm text-text-secondary">{replyLabel}</p>
          <p dir="auto" className="text-text-primary">
            {reply}
          </p>
        </div>
      ) : null}
    </li>
  );
}
