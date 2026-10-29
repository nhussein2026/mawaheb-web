import React from "react";
import { useSelector } from "react-redux";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardContent } from "../components/ui/Card";
import { EmptyState, SkeletonCard } from "../components/ui/Feedback";
import { useResource } from "../hooks/useResource";
import { API_BASE_URL } from "../services/api/config";
import { formatNumber } from "../utils/format";

// University details for a scholarship student. The backend has no
// /university endpoint yet (API report H8), so the page shows its
// "unavailable" state until one exists.
const UniversityDetails = ({ universityId }) => {
  const token = useSelector((state) => state.auth.token);
  const { data, status, reload } = useResource(
    async () => {
      if (!universityId) throw new Error("no university");
      const res = await fetch(`${API_BASE_URL}/university/${universityId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    },
    [universityId, token],
    { initial: null, select: (d) => d }
  );

  return (
    <div className="space-y-6">
      <PageHeader title="بيانات الجامعة" />
      {status === "loading" ? (
        <SkeletonCard />
      ) : status === "failed" || !data ? (
        <Card>
          <EmptyState
            kind="failed"
            title="بيانات الجامعة غير متاحة حاليًا"
            description="لم نتمكن من جلب بيانات الجامعة. يمكنك مراجعة الفصول الدراسية من السجل الأكاديمي."
            onRetry={universityId ? reload : undefined}
          />
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-5 sm:pt-6">
            <dl className="divide-y divide-border-subtle">
              {[
                ["اسم الجامعة", data.universityName],
                ["نوع الجامعة", data.universityType],
                ["المعدل التراكمي", data.totalGPA != null ? formatNumber(data.totalGPA) : null],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-0.5 py-3 md:grid-cols-[35%_1fr]">
                  <dt className="text-sm text-text-tertiary">{label}</dt>
                  <dd className="num text-sm text-text-primary" dir="auto">
                    {value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UniversityDetails;
