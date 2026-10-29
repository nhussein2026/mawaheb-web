import React from "react";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/Badge";
import { EmptyState, SkeletonRows } from "../../components/ui/Feedback";
import { useResource } from "../../hooks/useResource";
import instituteApi from "../../services/api/instituteApi";
import { courseStatusLabel, COURSE_STATUS_TONE } from "../../constants/institute";
import { formatDate } from "../../utils/format";

function Section({ title, status, reload, empty, failed, children, count }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {status === "loading" ? (
          <SkeletonRows rows={3} />
        ) : status === "failed" ? (
          <EmptyState kind="failed" compact title={failed} onRetry={reload} />
        ) : count === 0 ? (
          <EmptyState kind="first-use" compact title={empty} />
        ) : (
          <ul className="divide-y divide-border-subtle">{children}</ul>
        )}
      </CardContent>
    </Card>
  );
}

const Courses = () => {
  const courses = useResource(() => instituteApi.getMyCourses(), [], { initial: [] });
  const certs = useResource(() => instituteApi.getMyCertificates(), [], { initial: [] });

  return (
    <div className="space-y-6">
      <PageHeader title="الدورات والشهادات" description="الدورات التدريبية المسجّل بها وشهاداتك الممنوحة." />

      <Section
        title="دوراتي"
        status={courses.status}
        reload={courses.reload}
        count={courses.data.length}
        empty="لم تُسجَّل في أي دورة بعد"
        failed="تعذّر تحميل الدورات"
      >
        {courses.data.map((en) => (
          <li key={en._id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
            <div className="min-w-0">
              <p dir="auto" className="font-semibold text-text-primary">
                {en.course?.title || "—"}
              </p>
              <p className="mt-0.5 text-xs text-text-tertiary">{en.course?.periodText || "—"}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {en.course?.status ? (
                <StatusBadge tone={COURSE_STATUS_TONE[en.course.status]}>{courseStatusLabel(en.course.status)}</StatusBadge>
              ) : null}
              {en.certificate ? <StatusBadge tone="success">شهادة صادرة</StatusBadge> : null}
            </div>
          </li>
        ))}
      </Section>

      <Section
        title="شهاداتي"
        status={certs.status}
        reload={certs.reload}
        count={certs.data.length}
        empty="لا توجد شهادات ممنوحة بعد"
        failed="تعذّر تحميل الشهادات"
      >
        {certs.data.map((c) => (
          <li key={c._id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
            <div className="min-w-0">
              <p dir="auto" className="font-semibold text-text-primary">
                {c.certTitleEn || c.title}
              </p>
              <p className="mt-0.5 text-xs text-text-tertiary">
                رقم الشهادة <span className="ltr font-mono">{c.serial || "—"}</span> ·{" "}
                <span className="num">{formatDate(c.issuedAt)}</span>
              </p>
            </div>
            {c.certificate_image || c.certificate_link ? (
              <a
                href={c.certificate_image || c.certificate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-strong underline underline-offset-4"
              >
                عرض الشهادة
                <ExternalLink className="icon-dir size-4" aria-hidden="true" />
                <span className="sr-only">(يفتح في نافذة جديدة)</span>
              </a>
            ) : null}
          </li>
        ))}
      </Section>
    </div>
  );
};

export default Courses;
