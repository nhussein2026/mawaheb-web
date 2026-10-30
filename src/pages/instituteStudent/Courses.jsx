import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/Badge";
import { EmptyState, SkeletonRows } from "../../components/ui/Feedback";
import { ContentCollection } from "../../components/content/ContentCollection";
import { courseConfig } from "../../components/content/studentRecords";
import { useResource } from "../../hooks/useResource";
import instituteApi from "../../services/api/instituteApi";
import { courseStatusLabel, COURSE_STATUS_TONE } from "../../constants/institute";

const config = {
  ...courseConfig,
  copy: {
    ...courseConfig.copy,
    description: "دورات المعهد المسجّل بها، والدورات التي التحقت بها خارج المعهد.",
    listTitle: "دوراتي الشخصية",
    empty: "لم تُضف دورات شخصية بعد",
  },
};

// Institute training courses come from the institute portal and are
// read-only here; personal courses are the student's own records.
function InstituteCourses() {
  const { data, status, reload } = useResource(() => instituteApi.getMyCourses(), [], { initial: [] });
  return (
    <Card>
      <CardHeader>
        <CardTitle>دورات المعهد</CardTitle>
        <CardDescription>تسجّلك إدارة المعهد فيها، وتصدر شهاداتها في صفحة «الشهادات».</CardDescription>
      </CardHeader>
      <CardContent>
        {status === "loading" ? (
          <SkeletonRows rows={3} />
        ) : status === "failed" ? (
          <EmptyState kind="failed" compact title="تعذّر تحميل دورات المعهد" onRetry={reload} />
        ) : data.length === 0 ? (
          <EmptyState kind="first-use" compact title="لم تُسجَّل في أي دورة بالمعهد بعد" />
        ) : (
          <ul className="divide-y divide-border-subtle">
            {data.map((en) => (
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
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

const Courses = () => (
  <ContentCollection config={config}>
    <InstituteCourses />
  </ContentCollection>
);

export default Courses;
