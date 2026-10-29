import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Chip } from "../../components/ui/Badge";
import { Dialog } from "../../components/ui/Dialog";
import { Select } from "../../components/ui/Input";
import { SearchInput } from "../../components/ui/SearchInput";
import { EmptyState, SkeletonRows } from "../../components/ui/Feedback";
import { useResource } from "../../hooks/useResource";
import { API_BASE_URL } from "../../services/api/config";
import { matchesSearch } from "../../utils/arabic";
import { formatDateLong } from "../../utils/format";
import { cn } from "../../utils/cn";

// The records a term report links to, in display order.
const REPORT_SECTIONS = [
  { key: "course", label: "الدورة", image: "course_image" },
  { key: "note", label: "الملاحظة", body: "content" },
  { key: "difficulty", label: "الصعوبة", alt: "difficultiesId" },
  { key: "userAchievement", label: "الإنجاز", image: "achievement_image", meta: "category" },
  { key: "event", label: "الفعالية", image: "photo" },
  { key: "certificate", label: "الشهادة", image: "certificate_image", link: "certificate_link" },
];

const linked = (report, s) => {
  const v = report[`${s.key}Id`] || (s.alt ? report[s.alt] : null);
  return v && typeof v === "object" ? v : null;
};

/**
 * A scholar's submitted term reports: newest first (or by title), searchable,
 * each expanding to show the records it links to. `reloadKey` refreshes it.
 */
export function ReportsList({ searchable = false, reloadKey = 0, emptyAction }) {
  const token = useSelector((s) => s.auth.token);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [open, setOpen] = useState({});
  const [viewing, setViewing] = useState(null);

  const { data: reports, status, reload } = useResource(
    async () => {
      const res = await fetch(`${API_BASE_URL}/studentReports`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    },
    [token, reloadKey],
    { initial: [], select: (d) => d?.studentReports || [] }
  );

  const rows = useMemo(() => {
    const filtered = query
      ? reports.filter((r) => matchesSearch(`${r.title || ""} ${r.courseId?.title || ""}`, query))
      : reports;
    return [...filtered].sort((a, b) =>
      sortBy === "title"
        ? (a.title || "").localeCompare(b.title || "", "ar")
        : new Date(b.date_of_report || 0) - new Date(a.date_of_report || 0)
    );
  }, [reports, query, sortBy]);

  return (
    <Card>
      {searchable ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-border-default px-4 py-3 sm:px-6">
          <SearchInput
            label="بحث في التقارير"
            placeholder="ابحث بعنوان التقرير أو الدورة…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-80"
          />
          <Select aria-label="ترتيب حسب" className="w-full sm:w-48" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">الأحدث أولًا</option>
            <option value="title">العنوان</option>
          </Select>
        </div>
      ) : null}

      {status === "loading" ? (
        <SkeletonRows rows={4} />
      ) : status === "failed" ? (
        <EmptyState kind="failed" title="تعذّر تحميل التقارير" onRetry={reload} />
      ) : rows.length === 0 ? (
        query ? (
          <EmptyState kind="no-results" title={`لا توجد نتائج لـ «${query}»`} />
        ) : (
          <EmptyState kind="first-use" title="لم تقدّم أي تقرير بعد" description="التقرير الفصلي يربط دوراتك وإنجازاتك وملاحظاتك في الفصل." action={emptyAction} />
        )
      ) : (
        <ul className="divide-y divide-border-subtle">
          {rows.map((r) => {
            const isOpen = Boolean(open[r._id]);
            const sections = REPORT_SECTIONS.filter((s) => linked(r, s));
            return (
              <li key={r._id}>
                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [r._id]: !isOpen }))}
                  aria-expanded={isOpen}
                  aria-controls={`report-${r._id}`}
                  className="flex min-h-16 w-full items-center gap-3 px-4 py-3 text-start hover:bg-neutral-50 sm:px-6"
                >
                  <span className="min-w-0 flex-1">
                    <span dir="auto" className="block font-semibold text-text-primary">
                      {r.title || "تقرير بدون عنوان"}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
                      <span className="num">{formatDateLong(r.date_of_report)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{sections.length ? `${sections.length} من 6 أقسام` : "بلا مرفقات"}</span>
                    </span>
                  </span>
                  <ChevronDown className={cn("size-5 shrink-0 text-text-tertiary transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
                </button>
                {isOpen ? (
                  <div id={`report-${r._id}`} className="grid grid-cols-1 gap-3 px-4 pb-4 sm:px-6 md:grid-cols-2">
                    {sections.length === 0 ? <p className="text-sm text-text-secondary">لم يُربط بهذا التقرير أي سجل.</p> : null}
                    {sections.map((s) => {
                      const rec = linked(r, s);
                      const img = s.image ? rec[s.image] : null;
                      return (
                        <section key={s.key} className="rounded-lg border border-border-default p-3" aria-label={s.label}>
                          <p className="text-label-sm text-text-tertiary">{s.label}</p>
                          <p dir="auto" className="font-semibold text-text-primary">
                            {rec.title || "—"}
                          </p>
                          {s.meta && rec[s.meta] ? <Chip className="mt-1">{rec[s.meta]}</Chip> : null}
                          {rec[s.body || "description"] ? (
                            <p dir="auto" className="mt-1 line-clamp-3 text-sm text-text-secondary">
                              {rec[s.body || "description"]}
                            </p>
                          ) : null}
                          {s.link && rec[s.link] ? (
                            <a
                              href={rec[s.link]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-strong underline underline-offset-4"
                            >
                              رابط الشهادة
                              <ExternalLink className="icon-dir size-4" aria-hidden="true" />
                              <span className="sr-only">(يفتح في نافذة جديدة)</span>
                            </a>
                          ) : null}
                          {img ? (
                            <button
                              type="button"
                              onClick={() => setViewing({ src: img, title: rec.title })}
                              className="mt-2 block overflow-hidden rounded-md border border-border-default"
                              aria-label={`عرض صورة ${rec.title || s.label}`}
                            >
                              <img src={img} alt="" loading="lazy" className="h-24 w-40 object-cover" />
                            </button>
                          ) : null}
                        </section>
                      );
                    })}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={Boolean(viewing)} onClose={() => setViewing(null)} title={viewing?.title || "صورة"} size="xl">
        {viewing ? <img src={viewing.src} alt="" className="mx-auto max-h-[70vh] w-auto rounded-lg" /> : null}
      </Dialog>
    </Card>
  );
}

export default ReportsList;
