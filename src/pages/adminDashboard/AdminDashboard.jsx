import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { StatTile, StatTiles } from "../../components/ui/StatTile";
import { StatusBadge } from "../../components/ui/Badge";
import { BarList } from "../../components/ui/BarList";
import { EmptyState, SkeletonTiles, SkeletonCard } from "../../components/ui/Feedback";
import { formatRoleAr } from "../../components/admin/adminCopy";
import { useAdminStats } from "../../hooks/useAdminStats";
import { formatNumber } from "../../utils/format";

const ROLE_ORDER = ["Scholarship Student", "Institute Student", "Employee", "Admin", "User"];

// Workspace overview for the administrator: tiles first, then what needs
// attention, then the people on the platform. Every number opens its list.
export default function AdminDashboard() {
  const { stats, pendingRoleRequests, financialCount, status, reload } = useAdminStats();

  const roles = useMemo(() => {
    const entries = Object.entries(stats?.user_statistics || {});
    return entries
      .sort((a, b) => {
        const ia = ROLE_ORDER.indexOf(a[0]);
        const ib = ROLE_ORDER.indexOf(b[0]);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      })
      .map(([role, data]) => ({ label: formatRoleAr(role), value: data?.count || 0, to: "/admin-dashboard/users" }));
  }, [stats]);

  const students =
    (stats?.user_statistics?.["Scholarship Student"]?.count || 0) + (stats?.user_statistics?.["Institute Student"]?.count || 0);

  const attention = [
    pendingRoleRequests > 0 && {
      key: "roles",
      count: pendingRoleRequests,
      label: "طلبات أدوار بانتظار المراجعة",
      to: "/admin-dashboard/role-requests",
      tone: "warning",
    },
  ].filter(Boolean);

  const loadingAll = Object.values(status).every((s) => s === "loading");

  return (
    <div className="space-y-6">
      <PageHeader title="نظرة عامة" description="المستخدمون وطلبات الأدوار والسجلات المالية في المنصة." />

      {loadingAll ? (
        <SkeletonTiles />
      ) : status.stats === "failed" ? (
        <Card>
          <EmptyState kind="failed" compact title="تعذّر تحميل إحصاءات المستخدمين" onRetry={reload} />
        </Card>
      ) : (
        <StatTiles>
          <StatTile label="إجمالي المستخدمين" value={stats?.total_users ?? 0} hint="جميع الأدوار" to="/admin-dashboard/users" />
          <StatTile label="الطلاب" value={students} hint="طلاب المنح وطلاب المعهد" to="/admin-dashboard/reports" />
          <StatTile
            label="طلبات الأدوار"
            value={status.roles === "failed" ? "—" : pendingRoleRequests ?? 0}
            hint={status.roles === "failed" ? "تعذّر التحميل" : "بانتظار المراجعة"}
            to="/admin-dashboard/role-requests"
          />
          <StatTile
            label="السجلات المالية"
            value={status.financial === "failed" ? "—" : financialCount ?? 0}
            hint={status.financial === "failed" ? "تعذّر التحميل" : "تقارير مسجّلة"}
            to="/admin-dashboard/financial"
          />
        </StatTiles>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>المستخدمون حسب الدور</CardTitle>
            <CardDescription>عدد الحسابات في كل دور</CardDescription>
          </CardHeader>
          <CardContent>
            {status.stats === "loading" ? (
              <SkeletonCard className="border-0 p-0 sm:p-0" lines={5} />
            ) : status.stats === "failed" ? (
              <EmptyState kind="failed" compact title="تعذّر تحميل التوزيع" onRetry={reload} />
            ) : roles.length ? (
              <BarList rows={roles} label="المستخدمون حسب الدور" />
            ) : (
              <EmptyState kind="first-use" compact title="لا يوجد مستخدمون بعد" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>بحاجة إلى متابعة</CardTitle>
          </CardHeader>
          <CardContent>
            {status.roles === "failed" ? (
              <EmptyState kind="failed" compact title="تعذّر تحميل طلبات الأدوار" onRetry={reload} />
            ) : attention.length ? (
              <ul className="divide-y divide-border-subtle">
                {attention.map((a) => (
                  <li key={a.key}>
                    <Link to={a.to} className="flex min-h-12 items-center gap-3 rounded-md px-1 hover:bg-subtle">
                      <StatusBadge tone={a.tone}>{formatNumber(a.count)}</StatusBadge>
                      <span className="min-w-0 flex-1 text-sm text-text-primary">{a.label}</span>
                      <ChevronLeft className="size-4 shrink-0 text-text-tertiary" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState kind="all-done" compact title="لا توجد عناصر بحاجة إلى متابعة" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
