import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import {
  Users,
  GraduationCap,
  UserPlus,
  Wallet,
  FileText,
  MessageSquare,
  ChevronLeft,
  Layers,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatRoleAr } from "../../components/admin/adminCopy";
import { useAdminStats } from "../../hooks/useAdminStats";

const ROLE_SLICE_FILLS = [
  "var(--color-brand-400)",
  "var(--color-brand-600)",
  "var(--color-brand-200)",
  "var(--color-brand-800)",
  "var(--color-accent-400)",
  "var(--color-neutral-500)",
];

const tooltipStyles = {
  borderRadius: "var(--radius-md)",
  border: "0.5px solid var(--color-border-subtle)",
  background: "var(--color-surface-card)",
};

export default function AdminDashboard() {
  const { stats, pendingRoleRequests, financialCount, loading, error } = useAdminStats();

  const roleDistribution = useMemo(() => {
    if (!stats?.user_statistics) return [];
    return Object.entries(stats.user_statistics).map(([role, data]) => ({
      name: role,
      nameAr: formatRoleAr(role),
      value: data.count,
    }));
  }, [stats]);

  const activeStudents =
    (stats?.user_statistics?.["Scholarship Student"]?.count || 0) +
    (stats?.user_statistics?.["Institute Student"]?.count || 0);

  const barPlaceholder = [
    { name: "الإثنين", users: 12, reports: 4 },
    { name: "الثلاثاء", users: 14, reports: 5 },
    { name: "الأربعاء", users: 11, reports: 6 },
    { name: "الخميس", users: 16, reports: 4 },
    { name: "الجمعة", users: 18, reports: 7 },
    { name: "السبت", users: 15, reports: 5 },
    { name: "الأحد", users: 13, reports: 4 },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-md border-e-[3px] border-e-error-text bg-error-bg px-4 py-3 text-sm text-error-dark"
        role="alert"
      >
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="نظرة عامة"
        description="مؤشرات المستخدمين وطلبات الأدوار والسجلات المالية. تُجلب البيانات من واجهة البرمجة الحية حيثما توفرت."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-[11px] font-medium uppercase tracking-[0.07em] text-text-muted">
              إجمالي المستخدمين
            </CardTitle>
            <Users className="h-4 w-4 text-brand-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium text-text-primary">{stats?.total_users ?? 0}</p>
            <p className="mt-1 text-[11px] text-text-muted">جميع الأدوار في الدليل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-[11px] font-medium uppercase tracking-[0.07em] text-text-muted">
              الطلاب
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-brand-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium text-text-primary">{activeStudents}</p>
            <p className="mt-1 text-[11px] text-text-muted">منحة + معهد</p>
          </CardContent>
        </Card>

        <Card variant="award">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-[11px] font-medium uppercase tracking-[0.07em] text-text-accent">
              طلبات الأدوار
            </CardTitle>
            <UserPlus className="h-4 w-4 text-text-accent" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium text-accent-900">
              {pendingRoleRequests === null ? "—" : pendingRoleRequests}
            </p>
            <p className="mt-1 text-[11px] text-text-accent">في قائمة الانتظار</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-[11px] font-medium uppercase tracking-[0.07em] text-text-muted">
              السجلات المالية
            </CardTitle>
            <Wallet className="h-4 w-4 text-brand-600" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium text-text-primary">
              {financialCount === null ? "—" : financialCount}
            </p>
            <p className="mt-1 text-[11px] text-text-muted">تقارير مسجّلة</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>معاينة النشاط</CardTitle>
            <CardDescription>
              أسبوع تجريبي للتخطيط فقط — أوصل لاحقاً بسلسلة زمنية من الخادم لاستبدال هذا العنصر.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barPlaceholder} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip contentStyle={tooltipStyles} />
                <Bar dataKey="users" fill="var(--color-brand-600)" radius={[6, 6, 0, 0]} name="مستخدمون" />
                <Bar dataKey="reports" fill="var(--color-brand-200)" radius={[6, 6, 0, 0]} name="تقارير" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="relative lg:col-span-3">
          <CardHeader>
            <CardTitle>المستخدمون حسب الدور</CardTitle>
            <CardDescription>حصّة الحسابات لكل دور من إحصاءات الإدارة.</CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-[280px] flex-col items-center justify-center gap-4 sm:flex-row sm:items-center">
            <div className="h-[220px] w-full max-w-[220px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={72}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {roleDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={ROLE_SLICE_FILLS[index % ROLE_SLICE_FILLS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyles} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex w-full max-w-xs flex-col gap-2 text-[12px] text-text-secondary">
              {roleDistribution.map((entry, index) => (
                <li
                  key={entry.name}
                  className="flex items-center justify-between gap-2 border-b-[0.5px] border-border-subtle py-1.5 last:border-0"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: ROLE_SLICE_FILLS[index % ROLE_SLICE_FILLS.length] }}
                    />
                    {entry.nameAr}
                  </span>
                  <span className="font-medium text-text-primary">{entry.value}</span>
                </li>
              ))}
              {roleDistribution.length === 0 ? (
                <li className="text-text-muted">لا توجد إحصاءات أدوار.</li>
              ) : null}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>المراجعة والصلاحيات</CardTitle>
            <CardDescription>قوائم تحتاج عادةً قراراً إدارياً.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link
              to="/admin-dashboard/role-requests"
              className="flex items-center justify-between rounded-md border-[0.5px] border-border-subtle bg-surface-page px-4 py-3 text-sm text-text-primary transition-colors hover:bg-brand-50"
            >
              <span className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-brand-600" />
                طلبات الأدوار
              </span>
              <ChevronLeft className="h-4 w-4 text-text-muted" />
            </Link>
            <Link
              to="/admin-dashboard/roles"
              className="flex items-center justify-between rounded-md border-[0.5px] border-border-subtle bg-surface-page px-4 py-3 text-sm text-text-primary transition-colors hover:bg-brand-50"
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-600" />
                تعيين الأدوار
              </span>
              <ChevronLeft className="h-4 w-4 text-text-muted" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المحتوى والدعم</CardTitle>
            <CardDescription>انتقال سريع إلى أدوات التشغيل.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link
              to="/admin-dashboard/reports"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-brand-200 bg-brand-50 px-4 text-xs font-medium text-brand-800 transition-colors hover:bg-brand-100"
            >
              <FileText className="h-4 w-4" />
              التقارير
            </Link>
            <Link
              to="/admin-dashboard/tickets"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-brand-200 bg-brand-50 px-4 text-xs font-medium text-brand-800 transition-colors hover:bg-brand-100"
            >
              <MessageSquare className="h-4 w-4" />
              التذاكر
            </Link>
            <Link
              to="/admin-dashboard/programs"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-brand-200 bg-brand-50 px-4 text-xs font-medium text-brand-800 transition-colors hover:bg-brand-100"
            >
              <Layers className="h-4 w-4" />
              البرامج
            </Link>
            <Link
              to="/admin-dashboard/financial"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-brand-200 bg-brand-50 px-4 text-xs font-medium text-brand-800 transition-colors hover:bg-brand-100"
            >
              <Wallet className="h-4 w-4" />
              المالية
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
