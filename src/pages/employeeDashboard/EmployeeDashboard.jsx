/**
 * Mawaheb Foundation — Employee Dashboard
 * ─────────────────────────────────────────
 * All colors, typography, spacing, and component rules
 * sourced from mawaheb-color-system.md v1.0
 *
 * Changes from original:
 * - Removed all indigo / gray / Tailwind dark-mode classes
 * - All surfaces use warm parchment hierarchy
 * - Category pills follow the button / badge system
 * - Search input follows the form-input token rules
 * - User cards follow the card + avatar system
 * - Loading uses the shared <Loading> component
 * - Error banner uses the semantic error alert structure
 * - Empty state follows brand palette (no gray)
 * - RTL dir preserved; directional borders flip correctly
 * - font-weight capped at 500 throughout
 */

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../components/layout/Sidebar";
import AllUsers from "../adminDashboard/AllUsers";
import Loading from "../../components/ui/Loading";
import {
  Users,
  FileText,
  Ticket,
  Award,
  DollarSign,
  Trophy,
  BookOpen,
  Search,
  ChevronLeft,
  User,
} from "lucide-react";

/* ─── Design-system tokens ──────────────────────────────── */
const t = {
  // Surfaces
  surfacePage: "#F5F3EE",
  surfaceCard: "#FAFAF7",
  surfaceNav: "#0D2018",
  surfaceHeader: "#1A3A2A",

  // Brand — Forest Green
  brand50: "#EAF3EC",
  brand100: "#C2DFC8",
  brand200: "#92C49C",
  brand400: "#4E9963",
  brand600: "#296E42",
  brand800: "#1A3A2A",
  brand900: "#0D2018",

  // Accent — Golden Amber
  accent50: "#FDF6E3",
  accent100: "#F9E4A0",
  accent200: "#F0C95A",
  accent400: "#D4A843",
  accent600: "#B07A1A",
  accent900: "#3D2D04",

  // Neutral — Warm Parchment
  neutral50: "#FAFAF7",
  neutral100: "#F5F3EE",
  neutral200: "#E8E4D8",
  neutral300: "#C8C3B2",
  neutral500: "#9A9588",
  neutral700: "#5E5A52",
  neutral900: "#2E2C28",

  // Text roles
  textPrimary: "#2E2C28",
  textSecondary: "#5E5A52",
  textMuted: "#9A9588",
  textInverse: "#FAFAF7",
  textBrand: "#296E42",
  textAccent: "#B07A1A",

  // Borders
  borderSubtle: "#E8E4D8",
  borderDefault: "#C8C3B2",
  borderBrand: "#296E42",
  borderAccent: "#D4A843",

  // Semantic — Error
  errorBg: "#FDECEC",
  errorBorder: "#F0BABA",
  errorText: "#C03030",
  errorDark: "#5A1010",
};

/* ─── Category config ───────────────────────────────────── */
const CATEGORIES = [
  { name: "المستخدمين", value: "users", icon: Users },
  { name: "التقارير", value: "reports", icon: FileText },
  { name: "التذاكر", value: "tickets", icon: Ticket },
  { name: "الشهادات", value: "certificates", icon: Award },
  { name: "التقارير المالية", value: "financialReports", icon: DollarSign },
  { name: "الإنجازات", value: "userAchievements", icon: Trophy },
  { name: "الدورات", value: "courses", icon: BookOpen },
];

/* ─── Category → count field map ───────────────────────── */
const COUNT_KEY = {
  reports: "reportCount",
  tickets: "ticketCount",
  certificates: "certificateCount",
  financialReports: "financialReportCount",
  userAchievements: "achievementCount",
  courses: "courseCount",
};

/* ─── Category pill ─────────────────────────────────────── */
const CategoryPill = ({ category, active, onClick }) => {
  const Icon = category.icon;
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        padding: "7px 16px",
        borderRadius: "9999px",
        border: `0.5px solid ${active ? t.brand600 : t.borderDefault}`,
        backgroundColor: active ? t.brand800 : t.surfaceCard,
        color: active ? t.textInverse : t.textSecondary,
        fontSize: "13px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "background-color 0.15s, border-color 0.15s, color 0.15s",
        fontFamily: "'IBM Plex Sans Arabic', 'Inter', system-ui, sans-serif",
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.backgroundColor = t.brand50;
          e.currentTarget.style.borderColor = t.brand200;
          e.currentTarget.style.color = t.brand800;
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.backgroundColor = t.surfaceCard;
          e.currentTarget.style.borderColor = t.borderDefault;
          e.currentTarget.style.color = t.textSecondary;
        }
      }}
    >
      <Icon
        size={15}
        style={{ color: active ? t.accent400 : t.brand400, flexShrink: 0 }}
      />
      {category.name}
    </button>
  );
};

/* ─── User card ─────────────────────────────────────────── */
const UserCard = ({ user, selectedCategory }) => {
  const countKey = COUNT_KEY[selectedCategory];
  const count = countKey ? user[countKey] ?? 0 : 0;
  const categoryLabel = CATEGORIES.find(c => c.value === selectedCategory)?.name ?? "";

  /* Award variant when category is achievements */
  const isAward = selectedCategory === "userAchievements";

  return (
    <div
      style={{
        backgroundColor: t.surfaceCard,
        border: `0.5px solid ${isAward ? t.borderAccent : t.borderSubtle}`,
        borderRadius: "12px",
        overflow: "hidden",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={e =>
        (e.currentTarget.style.borderColor = isAward ? t.accent200 : t.borderDefault)
      }
      onMouseLeave={e =>
        (e.currentTarget.style.borderColor = isAward ? t.borderAccent : t.borderSubtle)
      }
    >
      {/* Top section — avatar + info */}
      <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              backgroundColor: t.brand800,
              border: `0.5px solid ${t.brand200}`,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{
                  color: t.textInverse,
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                {user.name?.[0] ?? <User size={20} />}
              </span>
            )}
          </div>
          {/* Online dot */}
          <div
            style={{
              position: "absolute",
              bottom: "-2px",
              right: "-2px",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: t.brand400,
              border: `1.5px solid ${t.surfaceCard}`,
            }}
          />
        </div>

        {/* Name + email */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: t.textPrimary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user.name}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: t.textMuted,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginTop: "2px",
            }}
          >
            {user.email}
          </div>
        </div>
      </div>

      {/* Bottom section — count row */}
      <div
        style={{
          padding: "10px 16px",
          backgroundColor: isAward ? t.accent50 : t.neutral100,
          borderTop: `0.5px solid ${isAward ? t.borderAccent : t.borderSubtle}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 500,
            color: isAward ? t.textAccent : t.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          {categoryLabel}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 500,
              color: isAward ? t.accent900 : t.textPrimary,
            }}
          >
            {count}
          </span>
          <button
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              backgroundColor: isAward ? t.accent100 : t.brand50,
              border: `0.5px solid ${isAward ? t.borderAccent : t.brand200}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: isAward ? t.accent600 : t.brand600,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = isAward ? t.accent200 : t.brand100;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = isAward ? t.accent100 : t.brand50;
            }}
          >
            {/* ChevronLeft flips to right in RTL via dir="rtl" on the page */}
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Empty state ───────────────────────────────────────── */
const EmptyState = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "64px 24px",
      textAlign: "center",
      gap: "14px",
    }}
  >
    <div
      style={{
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        backgroundColor: t.brand50,
        border: `0.5px solid ${t.brand200}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Search size={28} style={{ color: t.brand400 }} />
    </div>
    <div
      style={{ fontSize: "16px", fontWeight: 500, color: t.textPrimary }}
    >
      لا توجد نتائج
    </div>
    <div style={{ fontSize: "13px", color: t.textSecondary }}>
      جرب استخدام كلمات بحث أخرى أو فئة مختلفة.
    </div>
  </div>
);

/* ─── Error banner ──────────────────────────────────────── */
const ErrorBanner = ({ message }) => (
  <div
    style={{
      backgroundColor: t.errorBg,
      borderRight: `3px solid ${t.errorText}`, /* RTL: right border */
      borderRadius: "0",
      padding: "10px 14px",
      fontSize: "13px",
      color: t.errorDark,
      borderTopRightRadius: "8px",
      borderBottomRightRadius: "8px",
    }}
  >
    خطأ في تحميل البيانات: {message}
  </div>
);

/* ─── Main component ────────────────────────────────────── */
const EmployeeDashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const [searchTerm, setSelectedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    if (!selectedCategory || selectedCategory === "users") return;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/user/summary?category=${selectedCategory}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setUsers(data.result);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [selectedCategory, token]);

  const filteredUsers =
    users?.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];

  const showAllUsers =
    selectedCategory === "users" || selectedCategory === "";

  return (
    <div
      dir="rtl"
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: t.surfacePage,
        fontFamily: "'IBM Plex Sans Arabic', 'Inter', system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* ── Page heading ── */}
          <div style={{ marginBottom: "32px" }}>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 500,
                color: t.textPrimary,
                margin: 0,
                marginBottom: "6px",
              }}
            >
              لوحة تحكم الموظف
            </h1>
            <p style={{ fontSize: "13px", color: t.textSecondary, margin: 0 }}>
              مرحباً بك مجدداً. يمكنك هنا مراجعة وإدارة أنشطة المستخدمين في المنصة.
            </p>
          </div>

          {/* ── Search + category row ── */}
          <section style={{ marginBottom: "28px" }}>

            {/* Search input */}
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "14px",
                  transform: "translateY(-50%)",
                  color: searchFocused ? t.brand600 : t.textMuted,
                  pointerEvents: "none",
                  transition: "color 0.15s",
                }}
              />
              <input
                type="text"
                placeholder="ابحث عن مستخدم بالاسم أو البريد الإلكتروني..."
                value={searchTerm}
                onChange={(e) => setSelectedSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  width: "100%",
                  padding: "9px 42px 9px 14px",
                  backgroundColor: t.surfaceCard,
                  border: `${searchFocused ? "2px" : "0.5px"} solid ${searchFocused ? t.borderBrand : t.borderDefault
                    }`,
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: t.textPrimary,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s, border-width 0.1s",
                  fontFamily: "inherit",
                  direction: "rtl",
                }}
              />
            </div>

            {/* Category pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {/* "All" pill */}
              <CategoryPill
                category={{ name: "الكل", value: "", icon: Users }}
                active={selectedCategory === ""}
                onClick={() => setSelectedCategory("")}
              />
              {CATEGORIES.map((cat) => (
                <CategoryPill
                  key={cat.value}
                  category={cat}
                  active={selectedCategory === cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                />
              ))}
            </div>
          </section>

          {/* ── Content area ── */}
          <div style={{ minHeight: "400px" }}>

            {loading ? (
              <Loading variant="inline" message="جاري تحميل البيانات..." />

            ) : error ? (
              <ErrorBanner message={error} />

            ) : showAllUsers ? (
              /* AllUsers table — wrapped in a card surface */
              <div
                style={{
                  backgroundColor: t.surfaceCard,
                  border: `0.5px solid ${t.borderSubtle}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <AllUsers />
              </div>

            ) : filteredUsers.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px",
                }}
              >
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    selectedCategory={selectedCategory}
                  />
                ))}
              </div>

            ) : (
              /* Empty state card */
              <div
                style={{
                  backgroundColor: t.surfaceCard,
                  border: `0.5px solid ${t.borderSubtle}`,
                  borderRadius: "12px",
                }}
              >
                <EmptyState />
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;