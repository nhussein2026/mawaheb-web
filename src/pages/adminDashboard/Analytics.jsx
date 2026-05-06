import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  BookOpen,
  Award,
  FileText,
  AlertTriangle,
  Calendar,
  Wallet,
  Ticket,
  Star,
  TrendingUp,
  BarChart3,
} from "lucide-react";

// ─── Category Config ────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    key: "courses",
    label: "الدورات",
    countField: "courseCount",
    color: "var(--color-brand-600)",
    bg: "var(--color-brand-50)",
    icon: BookOpen,
  },
  {
    key: "certificates",
    label: "الشهادات",
    countField: "certificateCount",
    color: "var(--color-award-text)",
    bg: "var(--color-award-bg)",
    icon: Award,
  },
  {
    key: "reports",
    label: "التقارير",
    countField: "reportCount",
    color: "var(--color-brand-400)",
    bg: "var(--color-brand-50)",
    icon: FileText,
  },
  {
    key: "difficulties",
    label: "الصعوبات",
    countField: "difficultyCount",
    color: "var(--color-error-text)",
    bg: "var(--color-error-bg)",
    icon: AlertTriangle,
  },
  {
    key: "events",
    label: "الفعاليات",
    countField: "eventCount",
    color: "var(--color-accent-400)",
    bg: "var(--color-accent-50)",
    icon: Calendar,
  },
  {
    key: "financialReports",
    label: "التقارير المالية",
    countField: "financialReportCount",
    color: "var(--color-success-text)",
    bg: "var(--color-success-bg)",
    icon: Wallet,
  },
  {
    key: "tickets",
    label: "التذاكر",
    countField: "ticketCount",
    color: "var(--color-warning-text)",
    bg: "var(--color-warning-bg)",
    icon: Ticket,
  },
  {
    key: "userAchievements",
    label: "الإنجازات",
    countField: "achievementCount",
    color: "var(--color-accent-600)",
    bg: "var(--color-accent-50)",
    icon: Star,
  },
];

// ─── Tooltip Styles ──────────────────────────────────────────────────────────
const tooltipStyles = {
  borderRadius: "var(--radius-md)",
  border: "0.5px solid var(--border-subtle)",
  background: "var(--surface-card)",
  direction: "rtl",
  fontSize: "12px",
  color: "var(--text-primary)",
};

// ─── Skeleton ────────────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded bg-[var(--color-neutral-200)] ${className}`}
  />
);

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, count, icon: Icon, color, bg, loading, rank }) => (
  <div
    className="relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-md"
    style={{
      borderColor: "var(--border-subtle)",
      background: "var(--surface-card)",
    }}
  >
    {/* rank badge */}
    {rank === 1 && (
      <div className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent-50)] text-[10px] font-bold text-[var(--color-accent-600)] border border-[var(--color-accent-200)]">
        #1
      </div>
    )}
    <div className="flex items-start justify-between gap-3" dir="rtl">
      <div className="flex flex-col gap-1">
        <span
          className="text-[11px] font-medium uppercase tracking-[0.07em]"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <span className="text-2xl font-black tabular-nums text-[var(--text-primary)]">
            {count.toLocaleString("en-US")}
          </span>
        )}
      </div>
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ background: bg, color: color }}
      >
        <Icon size={20} />
      </div>
    </div>
  </div>
);

// ─── Top Users Table ──────────────────────────────────────────────────────────
const TopUsersTable = ({ users, countField, color, bg, loading }) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }
  if (!users || users.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-text-secondary">
        لا توجد بيانات
      </p>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" dir="rtl">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] text-right text-[11px] font-medium uppercase tracking-[0.07em] text-[var(--text-muted)]">
            <th className="pb-3 pr-2">#</th>
            <th className="pb-3">الاسم</th>
            <th className="pb-3">البريد</th>
            <th className="pb-3 text-left">العدد</th>
          </tr>
        </thead>
        <tbody>
          {users.slice(0, 5).map((u, i) => (
            <tr
              key={u._id}
              className="border-b border-dashed border-[var(--border-subtle)] last:border-0 hover:bg-[var(--color-brand-50)] transition-colors"
            >
              <td className="py-3 pr-2 text-[var(--text-secondary)]">{i + 1}</td>
              <td className="py-3 font-medium text-[var(--text-primary)]">
                {u.name || "—"}
              </td>
              <td className="py-3 text-[var(--text-secondary)]">{u.email || "—"}</td>
              <td className="py-3 text-left">
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: bg, color: color }}
                >
                  {(u[countField] || 0).toLocaleString("en-US")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Main Analytics Page ──────────────────────────────────────────────────────
export default function Analytics() {
  const token = useSelector((state) => state.auth.token);

  const [categoryData, setCategoryData] = useState({}); // { [key]: { total, users } }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key);
  const [activeTab, setActiveTab] = useState("overview"); // overview | detail

  // ── Fetch all categories in parallel ────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(
        CATEGORIES.map(async (cat) => {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/user/summary?category=${cat.key}&limit=100`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!res.ok) throw new Error(`فشل تحميل: ${cat.label}`);
          const json = await res.json();
          const users = json.result ?? [];
          const total = users.reduce(
            (acc, u) => acc + (u[cat.countField] || 0),
            0
          );
          return { key: cat.key, total, users };
        })
      );

      const map = {};
      results.forEach(({ key, total, users }) => {
        map[key] = { total, users };
      });
      setCategoryData(map);
    } catch (err) {
      console.error("[Analytics]", err.message);
      setError("تعذّر تحميل بعض البيانات. تحقق من الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const barData = CATEGORIES.map((cat) => ({
    name: cat.label,
    العدد: categoryData[cat.key]?.total ?? 0,
    fill: cat.color,
  }));

  const radarData = CATEGORIES.map((cat) => ({
    subject: cat.label,
    A: categoryData[cat.key]?.total ?? 0,
  }));

  const activeCat = CATEGORIES.find((c) => c.key === activeCategory);
  const activeUsers = categoryData[activeCategory]?.users ?? [];
  const sortedUsers = [...activeUsers].sort(
    (a, b) => (b[activeCat?.countField] || 0) - (a[activeCat?.countField] || 0)
  );

  // sorted stat cards by total desc
  const sortedCards = [...CATEGORIES].sort(
    (a, b) =>
      (categoryData[b.key]?.total ?? 0) - (categoryData[a.key]?.total ?? 0)
  );

  const grandTotal = CATEGORIES.reduce(
    (acc, cat) => acc + (categoryData[cat.key]?.total ?? 0),
    0
  );

  // ── Tabs ─────────────────────────────────────────────────────────────────
  const tabs = [
    { key: "overview", label: "نظرة عامة" },
    { key: "detail", label: "تفصيل حسب الفئة" },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="التحليلات"
        description="تحليل شامل لتفاعل المستخدمين عبر جميع الفئات"
      />

      {/* Error Banner */}
      {error && (
        <div className="rounded-md border-e-[3px] border-e-[var(--color-error-border)] bg-[var(--color-error-bg)] px-4 py-3 text-sm text-[var(--color-error-text)]">
          {error}
          <button
            onClick={fetchAll}
            className="mr-3 underline underline-offset-2"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Grand Total Banner */}
      <div className="flex items-center justify-between rounded-2xl border border-[var(--color-brand-100)] bg-gradient-to-l from-[var(--color-brand-50)] to-transparent px-6 py-5 shadow-sm">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[var(--color-brand-600)]">
            إجمالي التفاعلات عبر المنصة
          </p>
          {loading ? (
            <Skeleton className="mt-1 h-9 w-32" />
          ) : (
            <p className="text-4xl font-black tabular-nums text-[var(--color-brand-800)]">
              {grandTotal.toLocaleString("en-US")}
            </p>
          )}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-brand-100)] text-[var(--color-brand-600)]">
          <BarChart3 size={32} />
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === t.key
                ? "bg-[var(--color-brand-600)] text-[var(--text-inverse)] shadow-sm"
                : "text-[var(--text-secondary)] hover:bg-[var(--color-brand-50)]"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ OVERVIEW TAB ══════════════════════════════════════════════════ */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {sortedCards.map((cat, i) => (
              <StatCard
                key={cat.key}
                label={cat.label}
                icon={cat.icon}
                color={cat.color}
                bg={cat.bg}
                count={categoryData[cat.key]?.total ?? 0}
                loading={loading}
                rank={i + 1}
              />
            ))}
          </div>

          {/* Bar Chart — Totals */}
          <Card>
            <CardHeader>
              <CardTitle>مقارنة الإجماليات</CardTitle>
              <CardDescription>
                مجموع التفاعلات لكل فئة عبر جميع المستخدمين
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                  جاري التحميل…
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{ top: 16, right: 8, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--color-border-subtle)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "var(--color-text-muted)", fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: "var(--color-text-muted)", fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip contentStyle={tooltipStyles} />
                    <Bar
                      dataKey="العدد"
                      radius={[6, 6, 0, 0]}
                      isAnimationActive
                    >
                      {barData.map((entry, index) => (
                        <rect key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>مخطط الرادار</CardTitle>
              <CardDescription>
                توزيع التفاعلات النسبي بين جميع الفئات
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                  جاري التحميل…
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--color-border-subtle)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "var(--color-text-muted)", fontSize: 10 }}
                    />
                    <PolarRadiusAxis tick={false} axisLine={false} />
                    <Radar
                      name="الإجمالي"
                      dataKey="A"
                      stroke="var(--color-brand-600)"
                      fill="var(--color-brand-600)"
                      fillOpacity={0.2}
                    />
                    <Tooltip contentStyle={tooltipStyles} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══ DETAIL TAB ════════════════════════════════════════════════════ */}
      {activeTab === "detail" && (
        <div className="space-y-5">
          {/* Category Selector */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all ${activeCategory === cat.key
                    ? "border-transparent text-[var(--text-inverse)] shadow-sm"
                    : "border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--color-brand-400)]"
                  }`}
                style={
                  activeCategory === cat.key
                    ? { background: cat.color }
                    : { "--hover-color": cat.color }
                }
              >
                <cat.icon size={14} />
                {cat.label}
                <span
                  className="rounded-full px-2 py-0.5 text-[10px]"
                  style={{
                    background:
                      activeCategory === cat.key ? "rgba(255,255,255,0.2)" : cat.bg,
                  }}
                >
                  {(categoryData[cat.key]?.total ?? 0).toLocaleString("en-US")}
                </span>
              </button>
            ))}
          </div>

          {/* Detail Cards Row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "إجمالي التفاعلات",
                value: (categoryData[activeCategory]?.total ?? 0).toLocaleString("en-US"),
              },
              {
                label: "المستخدمون النشطون",
                value: activeUsers.length.toLocaleString("en-US"),
              },
              {
                label: "المتوسط / مستخدم",
                value: activeUsers.length
                  ? (
                    (categoryData[activeCategory]?.total ?? 0) /
                    activeUsers.length
                  ).toFixed(1)
                  : "0",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 text-center"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[var(--text-muted)]">{item.label}</p>
                {loading ? (
                  <Skeleton className="mx-auto mt-1 h-7 w-16" />
                ) : (
                  <p
                    className="text-2xl font-black tabular-nums"
                    style={{ color: activeCat?.color }}
                  >
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Top Users Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <activeCat.icon size={20} className="text-[var(--color-brand-600)]" />
                أعلى المستخدمين — {activeCat?.label}
              </CardTitle>
              <CardDescription>
                المستخدمون الخمسة الأوائل حسب العدد
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                  جاري التحميل…
                </div>
              ) : sortedUsers.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                  لا توجد بيانات
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sortedUsers.slice(0, 5).map((u) => ({
                      name: u.name || u.email || "مستخدم",
                      العدد: u[activeCat?.countField] || 0,
                    }))}
                    layout="vertical"
                    margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="var(--color-border-subtle)"
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: "var(--color-text-muted)", fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "var(--color-text-muted)", fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      width={80}
                    />
                    <Tooltip contentStyle={tooltipStyles} />
                    <Bar
                      dataKey="العدد"
                      fill={activeCat?.color}
                      radius={[0, 6, 6, 0]}
                      isAnimationActive
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Full Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <activeCat.icon size={20} className="text-[var(--color-brand-600)]" />
                جدول المستخدمين — {activeCat?.label}
              </CardTitle>
              <CardDescription>
                جميع المستخدمين مرتبين تنازلياً
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopUsersTable
                users={sortedUsers}
                countField={activeCat?.countField}
                color={activeCat?.color}
                bg={activeCat?.bg}
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}