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

// ─── Category Config ────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    key: "courses",
    label: "الدورات",
    countField: "courseCount",
    color: "#6366f1",
    icon: "📚",
  },
  {
    key: "certificates",
    label: "الشهادات",
    countField: "certificateCount",
    color: "#10b981",
    icon: "🏆",
  },
  {
    key: "reports",
    label: "التقارير",
    countField: "reportCount",
    color: "#f59e0b",
    icon: "📋",
  },
  {
    key: "difficulties",
    label: "الصعوبات",
    countField: "difficultyCount",
    color: "#ef4444",
    icon: "⚠️",
  },
  {
    key: "events",
    label: "الفعاليات",
    countField: "eventCount",
    color: "#8b5cf6",
    icon: "🎯",
  },
  {
    key: "financialReports",
    label: "التقارير المالية",
    countField: "financialReportCount",
    color: "#14b8a6",
    icon: "💰",
  },
  {
    key: "tickets",
    label: "التذاكر",
    countField: "ticketCount",
    color: "#f97316",
    icon: "🎫",
  },
  {
    key: "userAchievements",
    label: "الإنجازات",
    countField: "achievementCount",
    color: "#ec4899",
    icon: "⭐",
  },
];

// ─── Tooltip Styles ──────────────────────────────────────────────────────────
const tooltipStyles = {
  borderRadius: "var(--radius-md)",
  border: "0.5px solid var(--color-border-subtle)",
  background: "var(--color-surface-card)",
  direction: "rtl",
};

// ─── Skeleton ────────────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
  />
);

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, count, icon, color, loading, rank }) => (
  <div
    className="relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-md"
    style={{
      borderColor: `${color}30`,
      background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`,
    }}
  >
    {/* rank badge */}
    {rank === 1 && (
      <span className="absolute left-3 top-3 text-xs font-bold text-amber-500">
        #1
      </span>
    )}
    <div className="flex items-start justify-between gap-3" dir="rtl">
      <div className="flex flex-col gap-1">
        <span
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color }}
        >
          {label}
        </span>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <span className="text-3xl font-black tabular-nums text-text-primary">
            {count.toLocaleString("ar-EG")}
          </span>
        )}
      </div>
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
        style={{ background: `${color}18` }}
      >
        {icon}
      </div>
    </div>
  </div>
);

// ─── Top Users Table ──────────────────────────────────────────────────────────
const TopUsersTable = ({ users, countField, color, loading }) => {
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
          <tr className="border-b text-right text-xs text-text-secondary">
            <th className="pb-2 pr-2 font-medium">#</th>
            <th className="pb-2 font-medium">الاسم</th>
            <th className="pb-2 font-medium">البريد</th>
            <th className="pb-2 text-left font-medium">العدد</th>
          </tr>
        </thead>
        <tbody>
          {users.slice(0, 5).map((u, i) => (
            <tr
              key={u._id}
              className="border-b border-dashed last:border-0 hover:bg-surface-hover"
            >
              <td className="py-2 pr-2 text-text-secondary">{i + 1}</td>
              <td className="py-2 font-medium text-text-primary">
                {u.name || "—"}
              </td>
              <td className="py-2 text-text-secondary">{u.email || "—"}</td>
              <td className="py-2 text-left">
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{ background: `${color}20`, color }}
                >
                  {(u[countField] || 0).toLocaleString("ar-EG")}
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
        <div className="rounded-md border-e-[3px] border-e-red-400 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
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
      <div className="flex items-center justify-between rounded-2xl border border-indigo-200 bg-gradient-to-l from-indigo-50 to-transparent px-6 py-4 dark:border-indigo-800 dark:from-indigo-950">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
            إجمالي التفاعلات
          </p>
          {loading ? (
            <Skeleton className="mt-1 h-9 w-32" />
          ) : (
            <p className="text-4xl font-black tabular-nums text-indigo-700 dark:text-indigo-300">
              {grandTotal.toLocaleString("ar-EG")}
            </p>
          )}
        </div>
        <div className="text-5xl opacity-20">📊</div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 rounded-xl border bg-surface-card p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeTab === t.key
                ? "bg-indigo-600 text-white shadow"
                : "text-text-secondary hover:text-text-primary"
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
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.25}
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
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${activeCategory === cat.key
                    ? "border-transparent text-white shadow-md"
                    : "border-border text-text-secondary hover:border-current"
                  }`}
                style={
                  activeCategory === cat.key
                    ? { background: cat.color }
                    : { color: cat.color }
                }
              >
                <span>{cat.icon}</span>
                {cat.label}
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px]"
                  style={{
                    background:
                      activeCategory === cat.key ? "rgba(255,255,255,0.25)" : `${cat.color}18`,
                  }}
                >
                  {(categoryData[cat.key]?.total ?? 0).toLocaleString("ar-EG")}
                </span>
              </button>
            ))}
          </div>

          {/* Detail Cards Row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "الإجمالي",
                value: (categoryData[activeCategory]?.total ?? 0).toLocaleString("ar-EG"),
              },
              {
                label: "عدد المستخدمين",
                value: activeUsers.length.toLocaleString("ar-EG"),
              },
              {
                label: "المتوسط لكل مستخدم",
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
                className="rounded-xl border p-4 text-center"
                style={{ borderColor: `${activeCat?.color}30` }}
              >
                <p className="text-xs text-text-secondary">{item.label}</p>
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
              <CardTitle>
                أعلى المستخدمين — {activeCat?.icon} {activeCat?.label}
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
              <CardTitle>
                جدول المستخدمين — {activeCat?.icon} {activeCat?.label}
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
                loading={loading}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}