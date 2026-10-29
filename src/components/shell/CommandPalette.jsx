import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Search, CornerDownLeft, History } from "lucide-react";
import { cn } from "../../utils/cn";
import { normalizeSearch } from "../../utils/arabic";

const RECENT_KEY = "mawaheb-palette-recent";

const readRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeRecent = (to) => {
  try {
    const next = [to, ...readRecent().filter((t) => t !== to)].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable: recents are a convenience only */
  }
};

/**
 * Command palette (§4.7): a 640 px dialog opened by Ctrl/⌘ K. Results are
 * grouped (Pages, Actions) and limited to what the user may open; recent
 * pages show before typing. Matching is Arabic-normalized.
 */
export function CommandPalette({ open, onClose, pages, actions = [] }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listId = useId();

  const results = useMemo(() => {
    const q = normalizeSearch(query);
    if (!q) {
      const recent = readRecent()
        .map((to) => pages.find((p) => p.to === to))
        .filter(Boolean)
        .map((p) => ({ ...p, group: "الأخيرة", recent: true }));
      const rest = pages.filter((p) => !recent.some((r) => r.to === p.to)).map((p) => ({ ...p, group: "الصفحات" }));
      return [...recent, ...rest, ...actions.map((a) => ({ ...a, group: "إجراءات" }))];
    }
    const match = (item) => normalizeSearch(`${item.label} ${item.section || ""}`).includes(q);
    return [
      ...pages.filter(match).map((p) => ({ ...p, group: "الصفحات" })),
      ...actions.filter(match).map((a) => ({ ...a, group: "إجراءات" })),
    ];
  }, [query, pages, actions]);

  useEffect(() => {
    if (!open) return undefined;
    const trigger = document.activeElement;
    inputRef.current?.focus();
    return () => {
      setQuery("");
      setActive(0);
      trigger?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  const run = (item) => {
    onClose();
    if (item.to) {
      writeRecent(item.to);
      navigate(item.to);
    } else {
      item.run?.();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Tab") {
      // The input is the only focusable element; keep focus inside the dialog.
      e.preventDefault();
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      run(results[active]);
    }
  };

  let lastGroup = null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1300] flex items-start justify-center bg-backdrop p-0 sm:p-6 sm:pt-[12vh]"
      dir="rtl"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="البحث السريع"
        className="flex h-full w-full flex-col overflow-hidden bg-surface shadow-modal sm:h-auto sm:max-h-[70vh] sm:max-w-[640px] sm:rounded-xl"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-border-default px-4">
          <Search className="size-5 shrink-0 text-text-tertiary" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="ابحث عن صفحة أو إجراء…"
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-tertiary"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            aria-autocomplete="list"
          />
          <kbd className="hidden rounded-sm border border-border-default bg-subtle px-1.5 text-xs text-text-tertiary sm:inline" dir="ltr">
            Esc
          </kbd>
        </div>
        <ul id={listId} role="listbox" aria-label="النتائج" className="min-h-0 flex-1 overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-4 py-10 text-center text-sm text-text-secondary">
              لا توجد نتائج لـ «<bdi>{query}</bdi>». يُرجى تجربة كلمة أقصر.
            </li>
          ) : (
            results.map((item, i) => {
              const header = item.group !== lastGroup ? item.group : null;
              lastGroup = item.group;
              const Icon = item.recent ? History : item.icon;
              return (
                <React.Fragment key={`${item.group}-${item.to || item.key}`}>
                  {header ? (
                    <li role="presentation" className="px-4 pb-1 pt-3 text-label-sm text-text-tertiary">
                      {header}
                    </li>
                  ) : null}
                  <li
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => run(item)}
                    className={cn(
                      "mx-2 flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 text-sm",
                      i === active ? "bg-brand-subtle text-brand-text" : "text-text-primary"
                    )}
                  >
                    {Icon ? <Icon className="size-5 shrink-0 text-text-secondary" aria-hidden="true" /> : null}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.section ? <span className="truncate text-xs text-text-tertiary">{item.section}</span> : null}
                    {i === active ? <CornerDownLeft className="size-4 shrink-0 text-text-tertiary" aria-hidden="true" /> : null}
                  </li>
                </React.Fragment>
              );
            })
          )}
        </ul>
      </div>
    </div>,
    document.body
  );
}

export default CommandPalette;
