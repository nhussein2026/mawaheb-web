import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { StatTile, StatTiles } from "../../components/ui/StatTile";
import { EmptyState, SkeletonPage } from "../../components/ui/Feedback";
import { StatusBadge } from "../../components/ui/Badge";
import { BarList } from "../../components/ui/BarList";
import instituteApi from "../../services/api/instituteApi";
import { navForUser, roleLabel } from "../../constants/institute";
import { formatNumber } from "../../utils/format";

// Institute dashboard (§5.1): tiles first, then what needs attention, then
// the detailed figures. Every number links to the list it counts when the
// viewer's rank may open that list.
const InstituteDashboard = () => {
  const user = useSelector((s) => s.auth?.user || {});
  const selectedYearId = useSelector((s) => s.academicYear.selectedYearId);
  const years = useSelector((s) => s.academicYear.years);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");

  const allowed = new Set(navForUser(user).map((n) => n.key));
  const linkTo = (key) => (allowed.has(key) ? `/institute-admin/${key}` : undefined);

  const load = useCallback(() => {
    let active = true;
    instituteApi
      .getDashboard(selectedYearId)
      .then((res) => {
        if (!active) return;
        setData(res.data?.data || {});
        setStatus("ready");
      })
      .catch(() => active && setStatus("failed"));
    return () => {
      active = false;
    };
  }, [selectedYearId]);

  useEffect(() => load(), [load]);

  const yearName =
    selectedYearId === "all" ? "جميع الأعوام (تراكمي)" : years.find((y) => y._id === selectedYearId)?.name;

  const header = (
    <PageHeader
      title="لوحة المعهد"
      meta={`${yearName ? `العام الدراسي ${yearName}` : "العام الدراسي المحدد"} · ${user?.name || ""}${
        user?.instituteRole ? ` · ${roleLabel(user.instituteRole)}` : ""
      }`}
    />
  );

  if (status === "loading" && !data) {
    return (
      <>
        {header}
        <SkeletonPage />
      </>
    );
  }

  if (status === "failed") {
    return (
      <>
        {header}
        <Card>
          <EmptyState
            kind="failed"
            title="تعذّر تحميل لوحة المعهد"
            description="لم نتمكن من جلب الإحصائيات. يُرجى المحاولة مرة أخرى."
            onRetry={load}
          />
        </Card>
      </>
    );
  }

  const s = data || {};
  const online = s.online || {};
  const platform = s.platform || {};
  const students = s.students || {};
  const seats = s.seats || {};

  const attention = [
    { key: "overdue1", count: seats.overdueFirstInstallment, label: "متأخرون عن القسط الأول", to: linkTo("fees"), tone: "warning" },
    { key: "overdue2", count: seats.overdueSecondInstallment, label: "متأخرون عن القسط الثاني", to: linkTo("fees"), tone: "warning" },
    { key: "messages", count: platform.openMessages, label: "رسائل مفتوحة بانتظار الرد", to: linkTo("correspondence"), tone: "info" },
  ].filter((a) => a.count > 0);

  return (
    <div className="space-y-6" aria-busy={status === "loading"}>
      {header}

      <StatTiles>
        <StatTile label="الطلاب المسجلون" value={students.registered ?? 0} to={linkTo("academic")} />
        <StatTile label="الرسائل المفتوحة" value={platform.openMessages ?? 0} to={linkTo("correspondence")} />
        <StatTile label="الإنجازات المعتمدة" value={platform.approvedAchievements ?? 0} to={linkTo("achievements")} />
        <StatTile label="الأفكار المعتمدة" value={platform.approvedIdeas ?? 0} to={linkTo("ideas")} />
      </StatTiles>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>الطلاب حسب المرحلة</CardTitle>
            <CardDescription>عدد الطلاب في كل مرحلة للعام المحدد</CardDescription>
          </CardHeader>
          <CardContent>
            <BarList
              label="الطلاب حسب المرحلة"
              rows={[
                { label: "المرحلة الثانوية", value: students.secondary ?? 0 },
                { label: "المرحلة الجامعية", value: students.university ?? 0 },
                { label: "الخريجون", value: students.graduated ?? 0 },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>بحاجة إلى متابعة</CardTitle>
          </CardHeader>
          <CardContent>
            {attention.length ? (
              <ul className="divide-y divide-border-subtle">
                {attention.map((a) => (
                  <li key={a.key}>
                    <AttentionRow {...a} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState kind="all-done" compact title="لا توجد عناصر بحاجة إلى متابعة" />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>المقاعد والرسوم</CardTitle>
          <CardDescription>توزيع المقاعد وحالة سداد الأقساط</CardDescription>
        </CardHeader>
        <CardContent>
          <StatTiles cols={3}>
            <StatTile label="المقاعد المجانية" value={seats.freeSeats ?? 0} />
            <StatTile label="المقاعد المدفوعة" value={seats.paidSeats ?? 0} to={linkTo("fees")} />
            <StatTile label="سددوا القسط الأول" value={seats.paidFirstInstallment ?? 0} to={linkTo("fees")} />
            <StatTile label="سددوا القسط الثاني" value={seats.paidSecondInstallment ?? 0} to={linkTo("fees")} />
            <StatTile label="متأخرون عن القسط الأول" value={seats.overdueFirstInstallment ?? 0} to={linkTo("fees")} />
            <StatTile label="متأخرون عن القسط الثاني" value={seats.overdueSecondInstallment ?? 0} to={linkTo("fees")} />
          </StatTiles>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>المتصلون الآن</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <OnlineFact label="المشرفون" value={online.supervisorsOnline} />
            <OnlineFact label="الطلاب" value={online.studentsOnline} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

function AttentionRow({ count, label, to, tone }) {
  const body = (
    <>
      <StatusBadge tone={tone}>{formatNumber(count)}</StatusBadge>
      <span className="min-w-0 flex-1 text-sm text-text-primary">{label}</span>
      {to ? <ChevronLeft className="size-4 shrink-0 text-text-tertiary" aria-hidden="true" /> : null}
    </>
  );
  return to ? (
    <Link to={to} className="flex min-h-12 items-center gap-3 rounded-md px-1 hover:bg-subtle">
      {body}
    </Link>
  ) : (
    <div className="flex min-h-12 items-center gap-3 px-1">{body}</div>
  );
}

function OnlineFact({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-subtle px-4 py-3">
      <dt className="text-sm text-text-secondary">{label}</dt>
      <dd className="num font-display text-xl font-bold text-text-primary">{formatNumber(value ?? 0)}</dd>
    </div>
  );
}

export default InstituteDashboard;
