import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronLeft, FileText, CalendarPlus, ScrollText, LifeBuoy } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { StatTile, StatTiles } from "../../components/ui/StatTile";
import { EmptyState, SkeletonTiles } from "../../components/ui/Feedback";
import { useResource } from "../../hooks/useResource";
import { API_BASE_URL } from "../../services/api/config";

const NEXT_STEPS = [
  { to: "/semester-create", label: "إضافة فصل دراسي", icon: CalendarPlus },
  { to: "/student/certificates", label: "إضافة شهادة", icon: ScrollText },
  { to: "/my-reports", label: "تقاريري السابقة", icon: FileText },
  { to: "/create-ticket", label: "طلب مساعدة من فريق الابتعاث", icon: LifeBuoy },
];

// Home for scholarship students: what they have recorded so far and the
// next things to do. The one primary action is submitting a term report.
const ScholarshipStudentDashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const { data, status, reload } = useResource(
    async () => {
      const response = await fetch(`${API_BASE_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    },
    [token],
    { initial: null, select: (d) => d }
  );
  const stats = data?.statistics || {};

  return (
    <div className="space-y-6">
      <PageHeader
        title={`أهلًا بك، ${user?.name || ""}`}
        description="تابع سجلك الأكاديمي وقدّم تقاريرك الفصلية."
        breadcrumbs={null}
        actions={
          <Link
            to="/student-report"
            className="inline-flex h-10 items-center justify-center rounded-md bg-brand-strong px-4 text-sm font-semibold text-brand-on-strong hover:bg-brand-strong-hover"
          >
            تقديم تقرير فصلي
          </Link>
        }
      />

      {status === "loading" ? (
        <SkeletonTiles />
      ) : status === "failed" ? (
        <Card>
          <EmptyState kind="failed" title="تعذّر تحميل ملخص حسابك" onRetry={reload} />
        </Card>
      ) : (
        <StatTiles>
          <StatTile label="التقارير المقدمة" value={stats.studentReports || 0} to="/my-reports" />
          <StatTile label="الفصول الدراسية" value={stats.semesters || 0} to="/semester-list" />
          <StatTile label="الإنجازات" value={stats.achievements || 0} to="/student/achievements" />
          <StatTile label="الشهادات" value={stats.certificates || 0} to="/student/certificates" />
        </StatTiles>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>الخطوات التالية</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border-subtle">
              {NEXT_STEPS.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="flex min-h-12 items-center gap-3 rounded-md px-1 text-sm text-text-primary hover:bg-subtle">
                    <s.icon className="size-5 text-text-tertiary" aria-hidden="true" />
                    <span className="flex-1">{s.label}</span>
                    <ChevronLeft className="size-4 text-text-tertiary" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {status === "ready" ? (
          <Card>
            <CardHeader>
              <CardTitle>نشاطي</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-border-subtle">
                {[
                  ["الدورات التدريبية", stats.courses, "/student/courses"],
                  ["الفعاليات", stats.events, "/student/events"],
                  ["التذاكر", stats.tickets, "/student/tickets"],
                  ["التقارير المالية", stats.financialReports, "/student/financial-report"],
                ].map(([label, value, to]) => (
                  <div key={label} className="flex items-center justify-between gap-3 py-3">
                    <dt className="text-sm text-text-secondary">{label}</dt>
                    <dd>
                      <Link to={to} className="num font-semibold text-text-primary underline-offset-4 hover:underline">
                        {value || 0}
                      </Link>
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
};

export default ScholarshipStudentDashboard;
