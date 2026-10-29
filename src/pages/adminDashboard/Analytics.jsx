import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { StatTile, StatTiles } from "../../components/ui/StatTile";
import { BarList } from "../../components/ui/BarList";
import { Tabs } from "../../components/ui/Tabs";
import { PersonCell } from "../../components/ui/PersonCell";
import { EmptyState, SkeletonCard, SkeletonTiles } from "../../components/ui/Feedback";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableStateRow } from "../../components/ui/DataTable";
import { useResource } from "../../hooks/useResource";
import { API_BASE_URL } from "../../services/api/config";
import { formatNumber } from "../../utils/format";

const CATEGORIES = [
  { key: "courses", label: "الدورات", countField: "courseCount" },
  { key: "certificates", label: "الشهادات", countField: "certificateCount" },
  { key: "reports", label: "التقارير", countField: "reportCount" },
  { key: "difficulties", label: "الصعوبات", countField: "difficultyCount" },
  { key: "events", label: "الفعاليات", countField: "eventCount" },
  { key: "financialReports", label: "التقارير المالية", countField: "financialReportCount" },
  { key: "tickets", label: "التذاكر", countField: "ticketCount" },
  { key: "userAchievements", label: "الإنجازات", countField: "achievementCount" },
];

const formatAvg = new Intl.NumberFormat("ar-YE-u-nu-latn", { maximumFractionDigits: 1 });

// Engagement across content types: an overview of totals, and per-category
// detail with the most active users. The view and category live in the URL.
export default function Analytics() {
  const token = useSelector((state) => state.auth.token);
  const [params, setParams] = useSearchParams();
  const view = params.get("view") === "detail" ? "detail" : "overview";
  const activeKey = CATEGORIES.some((c) => c.key === params.get("category")) ? params.get("category") : CATEGORIES[0].key;
  const activeCat = CATEGORIES.find((c) => c.key === activeKey);

  // Each category loads on its own; a failed one shows "—" instead of zero.
  const { data, status, reload } = useResource(
    async () => {
      const entries = await Promise.all(
        CATEGORIES.map(async (cat) => {
          try {
            const res = await fetch(`${API_BASE_URL}/user/summary?category=${cat.key}&limit=100`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) return [cat.key, null];
            const json = await res.json();
            const users = json.result ?? [];
            return [cat.key, { users, total: users.reduce((acc, u) => acc + (u[cat.countField] || 0), 0) }];
          } catch {
            return [cat.key, null];
          }
        })
      );
      const map = Object.fromEntries(entries);
      if (Object.values(map).every((v) => v === null)) throw new Error("all failed");
      return map;
    },
    [token],
    { initial: {}, select: (d) => d }
  );

  const failedCount = CATEGORIES.filter((c) => data[c.key] === null).length;
  const grandTotal = CATEGORIES.reduce((acc, c) => acc + (data[c.key]?.total ?? 0), 0);
  const overviewRows = useMemo(
    () =>
      CATEGORIES.filter((c) => data[c.key])
        .map((c) => ({ label: c.label, value: data[c.key].total }))
        .sort((a, b) => b.value - a.value),
    [data]
  );

  const activeUsers = useMemo(
    () => [...(data[activeKey]?.users ?? [])].sort((a, b) => (b[activeCat.countField] || 0) - (a[activeCat.countField] || 0)),
    [data, activeKey, activeCat]
  );
  const activeTotal = data[activeKey]?.total ?? 0;

  const setView = (v) => setParams(v === "overview" ? {} : { view: v, category: activeKey }, { replace: true });

  return (
    <div className="space-y-6">
      <PageHeader title="التحليلات" description="تفاعل المستخدمين مع أنواع المحتوى في المنصة." />

      <Tabs
        label="عرض التحليلات"
        value={view}
        onChange={setView}
        items={[
          { value: "overview", label: "نظرة عامة" },
          { value: "detail", label: "تفصيل حسب الفئة" },
        ]}
      />

      {status === "loading" ? (
        <div className="space-y-6">
          <SkeletonTiles />
          <SkeletonCard lines={8} />
        </div>
      ) : status === "failed" ? (
        <Card>
          <EmptyState kind="failed" title="تعذّر تحميل التحليلات" onRetry={reload} />
        </Card>
      ) : view === "overview" ? (
        <div className="space-y-6">
          {failedCount ? (
            <p role="status" className="text-sm text-warning-700">
              تعذّر تحميل {formatNumber(failedCount)} من الفئات، فلم تُحتسب في الإجمالي.{" "}
              <button type="button" onClick={reload} className="font-semibold underline underline-offset-4">
                إعادة المحاولة
              </button>
            </p>
          ) : null}
          <StatTiles>
            <StatTile label="إجمالي السجلات" value={grandTotal} hint="في جميع الفئات" />
            {overviewRows.slice(0, 3).map((r) => {
              const cat = CATEGORIES.find((c) => c.label === r.label);
              return (
                <StatTile
                  key={r.label}
                  label={r.label}
                  value={r.value}
                  to={`?view=detail&category=${cat.key}`}
                />
              );
            })}
          </StatTiles>
          <Card>
            <CardHeader>
              <CardTitle>
                {overviewRows[0]?.value ? `${overviewRows[0].label} الأكثر تسجيلًا` : "السجلات حسب الفئة"}
              </CardTitle>
              <CardDescription>عدد السجلات في كل فئة لجميع المستخدمين</CardDescription>
            </CardHeader>
            <CardContent>
              <BarList
                label="السجلات حسب الفئة"
                rows={overviewRows.map((r) => ({
                  ...r,
                  to: `?view=detail&category=${CATEGORIES.find((c) => c.label === r.label).key}`,
                }))}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Tabs
            label="الفئة"
            value={activeKey}
            onChange={(k) => setParams({ view: "detail", category: k }, { replace: true })}
            items={CATEGORIES.map((c) => ({ value: c.key, label: c.label }))}
          />
          {data[activeKey] === null ? (
            <Card>
              <EmptyState kind="failed" title={`تعذّر تحميل بيانات ${activeCat.label}`} onRetry={reload} />
            </Card>
          ) : (
            <>
              <StatTiles cols={3}>
                <StatTile label={`إجمالي ${activeCat.label}`} value={activeTotal} />
                <StatTile label="المستخدمون المشاركون" value={activeUsers.length} />
                <StatTile
                  label="المتوسط لكل مستخدم"
                  value={activeUsers.length ? formatAvg.format(activeTotal / activeUsers.length) : 0}
                />
              </StatTiles>

              <Card>
                <CardHeader>
                  <CardTitle>الأكثر نشاطًا في {activeCat.label}</CardTitle>
                  <CardDescription>أعلى خمسة مستخدمين حسب العدد</CardDescription>
                </CardHeader>
                <CardContent>
                  {activeUsers.length ? (
                    <BarList
                      label={`الأكثر نشاطًا في ${activeCat.label}`}
                      rows={activeUsers.slice(0, 5).map((u) => ({ label: u.name || u.email || "مستخدم", value: u[activeCat.countField] || 0 }))}
                    />
                  ) : (
                    <EmptyState kind="first-use" compact title="لا توجد بيانات في هذه الفئة" />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>جميع المستخدمين</CardTitle>
                  <CardDescription>مرتبون من الأكثر إلى الأقل</CardDescription>
                </CardHeader>
                <Table caption={`المستخدمون في ${activeCat.label}`}>
                  <TableHeader>
                    <TableRow>
                      <TableHead numeric>#</TableHead>
                      <TableHead>المستخدم</TableHead>
                      <TableHead numeric>العدد</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeUsers.length === 0 ? (
                      <TableStateRow colSpan={3}>
                        <EmptyState kind="first-use" compact title="لا توجد بيانات" />
                      </TableStateRow>
                    ) : (
                      activeUsers.map((u, i) => (
                        <TableRow key={u._id}>
                          <TableCell numeric className="w-12 text-text-tertiary">
                            {i + 1}
                          </TableCell>
                          <TableCell>
                            <PersonCell name={u.name} secondary={u.email} secondaryLtr />
                          </TableCell>
                          <TableCell numeric className="font-semibold">
                            {formatNumber(u[activeCat.countField] || 0)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}
