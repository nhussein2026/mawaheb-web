import React from "react";
import { Card } from "../../components/ui/Card";
import { Chip } from "../../components/ui/Badge";
import { Callout, EmptyState } from "../../components/ui/Feedback";
import StatGrid from "../../components/institute/StatGrid";
import guardianApi, { getGuardianStudent } from "../../services/api/guardianApi";
import { levelLabel } from "../../constants/institute";
import { useResource } from "../../hooks/useResource";

const GuardianOverview = () => {
  const student = getGuardianStudent() || {};
  const { data, status, reload: load } = useResource(() => guardianApi.getOverview(), [], {
    initial: {},
    select: (res) => res?.data?.data?.counts || {},
  });
  const counts = data;

  const facts = [
    student.academicNumber && `الرقم الأكاديمي ${student.academicNumber}`,
    student.batch && `الدفعة ${student.batch}`,
    student.level && levelLabel(student.level),
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-[22px] font-semibold leading-[34px] text-text-primary sm:text-heading-2">
          متابعة <bdi>{student.studentName || "الطالب"}</bdi>
        </h1>
        {facts.length ? (
          <ul className="flex flex-wrap gap-2" aria-label="بيانات الطالب">
            {facts.map((f) => (
              <li key={f}>
                <Chip className="num">{f}</Chip>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      {status === "failed" ? (
        <Card>
          <EmptyState kind="failed" title="تعذّر تحميل بيانات الطالب" onRetry={load} />
        </Card>
      ) : (
        <>
          {counts.unseen > 0 ? (
            <Callout tone="info" title={`لديك ${counts.unseen} عناصر جديدة لم تطّلع عليها بعد`}>
              تجدها في تبويبات النتائج والتقويم والسلوك.
            </Callout>
          ) : null}
          <StatGrid
            stats={[
              { label: "النتائج المتاحة", value: counts.results ?? 0, to: "/guardian/results" },
              { label: "تقارير التقويم", value: counts.evaluations ?? 0, to: "/guardian/evaluations" },
              { label: "السجلات السلوكية", value: counts.behavior ?? 0, to: "/guardian/behavior" },
              { label: "بانتظار اطلاعك", value: counts.unseen ?? 0 },
            ]}
          />
        </>
      )}
    </div>
  );
};

export default GuardianOverview;
