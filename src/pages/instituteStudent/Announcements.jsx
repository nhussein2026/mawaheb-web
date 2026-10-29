import React from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Chip } from "../../components/ui/Badge";
import { EmptyState, SkeletonRows } from "../../components/ui/Feedback";
import { useResource } from "../../hooks/useResource";
import instituteApi from "../../services/api/instituteApi";
import { announcementScopeLabel } from "../../constants/institute";
import { formatDate } from "../../utils/format";

const Announcements = () => {
  const { data: rows, status, reload } = useResource(() => instituteApi.getMyAnnouncements(), [], { initial: [] });

  return (
    <div className="space-y-6">
      <PageHeader title="الإعلانات والتوجيهات" description="الإعلانات الموجهة إليك ضمن فترة النشر الحالية." />
      <Card>
        {status === "loading" ? (
          <SkeletonRows rows={4} />
        ) : status === "failed" ? (
          <EmptyState kind="failed" title="تعذّر تحميل الإعلانات" onRetry={reload} />
        ) : rows.length === 0 ? (
          <EmptyState kind="all-done" title="لا توجد إعلانات حاليًا" />
        ) : (
          <ul className="divide-y divide-border-subtle">
            {rows.map((a) => (
              <li key={a._id} className="px-4 py-4 sm:px-6">
                <article>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 dir="auto" className="text-heading-4 text-text-primary">
                      {a.title}
                    </h2>
                    <Chip>{announcementScopeLabel(a.targetScope)}</Chip>
                  </div>
                  <p dir="auto" className="reading mt-2 whitespace-pre-wrap text-sm text-text-secondary">
                    {a.content}
                  </p>
                  <p className="num mt-2 text-xs text-text-tertiary">
                    من {formatDate(a.publishStart)} إلى {formatDate(a.publishEnd)}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default Announcements;
