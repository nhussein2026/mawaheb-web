import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/cn";
import { formatNumber } from "../../utils/format";

// Page numbers with gaps: 1 … 4 5 6 … 13
function pageList(page, pages) {
  const set = new Set([1, pages, page - 1, page, page + 1]);
  const list = [...set].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const out = [];
  list.forEach((p, i) => {
    if (i && p - list[i - 1] > 1) out.push(`gap-${p}`);
    out.push(p);
  });
  return out;
}

/**
 * Pagination (§4.7): "عرض 1–25 من 312" and numbered pages on desktop;
 * previous, next and "صفحة 2 من 13" on phones. Pass `total` and `pageSize`
 * when known for the range text.
 */
export function Pagination({ page, pages, onChange, total, pageSize, className }) {
  if (!pages || pages <= 1) {
    return total != null ? (
      <div className={cn("px-4 py-3 text-xs text-text-tertiary sm:px-6", className)}>
        <span className="num">{formatNumber(total)}</span> نتيجة
      </div>
    ) : null;
  }
  const from = total != null && pageSize ? (page - 1) * pageSize + 1 : null;
  const to = total != null && pageSize ? Math.min(page * pageSize, total) : null;
  const btn =
    "inline-grid h-8 min-w-8 place-items-center rounded-md border border-transparent px-2 text-label-sm text-text-secondary hover:bg-subtle disabled:cursor-not-allowed disabled:text-text-disabled disabled:hover:bg-transparent pointer-coarse:min-h-11 pointer-coarse:min-w-11";
  return (
    <nav
      aria-label="التنقل بين الصفحات"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle px-4 py-3 sm:px-6",
        className
      )}
    >
      <p className="num text-xs text-text-tertiary">
        {from != null ? `عرض ${from}–${to} من ${formatNumber(total)}` : `صفحة ${page} من ${pages}`}
      </p>
      <div className="flex items-center gap-1">
        <button type="button" className={btn} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="الصفحة السابقة">
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
        <span className="num px-2 text-xs text-text-secondary sm:hidden">
          صفحة {page} من {pages}
        </span>
        {pageList(page, pages).map((p) =>
          typeof p === "string" ? (
            <span key={p} className="hidden px-1 text-text-tertiary sm:inline" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                btn,
                "num hidden sm:inline-grid",
                p === page && "border-brand-border bg-brand-subtle text-brand-text hover:bg-brand-subtle"
              )}
            >
              {p}
            </button>
          )
        )}
        <button type="button" className={btn} disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="الصفحة التالية">
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
