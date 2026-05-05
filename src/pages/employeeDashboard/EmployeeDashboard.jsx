/**
 * Mawaheb Foundation — Employee Dashboard
 * ─────────────────────────────────────────
 * Aligned to /employee controller:
 *   GET /employee              → getAllEmployees (paginated, filterable)
 *   GET /employee/:id          → getEmployeeById
 *   GET /employee/user/:userId → getEmployeeByUserId
 *   POST /employee             → createEmployee
 *   PUT /employee/:id          → updateEmployee
 *   DELETE /employee/:id       → deleteEmployee
 *
 * Response shape from getAllEmployees:
 *   { total, page, pages, employees: [{ _id, job_title, hire_date,
 *     bank_account_number, social_security_number,
 *     user: { name, email, phone_number, role } }] }
 */

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../components/layout/Sidebar";
import Loading from "../../components/ui/Loading";
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  CalendarDays,
  Phone,
  ShieldCheck,
  AlertCircle,
  X,
} from "lucide-react";

/* ─── Design-system tokens ──────────────────────────────── */
const t = {
  surfacePage: "#F5F3EE",
  surfaceCard: "#FAFAF7",
  surfaceNav: "#0D2018",
  surfaceHeader: "#1A3A2A",

  brand50: "#EAF3EC",
  brand100: "#C2DFC8",
  brand200: "#92C49C",
  brand400: "#4E9963",
  brand600: "#296E42",
  brand800: "#1A3A2A",
  brand900: "#0D2018",

  accent50: "#FDF6E3",
  accent100: "#F9E4A0",
  accent200: "#F0C95A",
  accent400: "#D4A843",
  accent600: "#B07A1A",
  accent900: "#3D2D04",

  neutral50: "#FAFAF7",
  neutral100: "#F5F3EE",
  neutral200: "#E8E4D8",
  neutral300: "#C8C3B2",
  neutral500: "#9A9588",
  neutral700: "#5E5A52",
  neutral900: "#2E2C28",

  textPrimary: "#2E2C28",
  textSecondary: "#5E5A52",
  textMuted: "#9A9588",
  textInverse: "#FAFAF7",
  textBrand: "#296E42",
  textAccent: "#B07A1A",

  borderSubtle: "#E8E4D8",
  borderDefault: "#C8C3B2",
  borderBrand: "#296E42",
  borderAccent: "#D4A843",

  errorBg: "#FDECEC",
  errorBorder: "#F0BABA",
  errorText: "#C03030",
  errorDark: "#5A1010",
};

/* ─── Role badge colours ────────────────────────────────── */
const ROLE_STYLES = {
  Admin: { bg: t.brand800, color: t.textInverse },
  Employee: { bg: t.brand100, color: t.brand800 },
  User: { bg: t.neutral200, color: t.textSecondary },
};
const roleStyle = (role) =>
  ROLE_STYLES[role] ?? { bg: t.neutral200, color: t.textSecondary };

/* ─── Helpers ───────────────────────────────────────────── */
const fmt = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "—";

/* ─── Employee card ─────────────────────────────────────── */
const EmployeeCard = ({ employee, onSelect }) => {
  const { job_title, hire_date, user } = employee;
  const rs = roleStyle(user?.role);

  return (
    <div
      onClick={() => onSelect(employee)}
      style={{
        backgroundColor: t.surfaceCard,
        border: `0.5px solid ${t.borderSubtle}`,
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = t.brand200;
        e.currentTarget.style.boxShadow = `0 2px 12px rgba(41,110,66,0.08)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = t.borderSubtle;
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Avatar + identity */}
      <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div
            style={{
              width: "48px", height: "48px",
              borderRadius: "10px",
              backgroundColor: t.brand800,
              border: `0.5px solid ${t.brand200}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ color: t.textInverse, fontSize: "18px", fontWeight: 500 }}>
                {user?.name?.[0] ?? <User size={20} />}
              </span>
            )}
          </div>
          {/* Role dot */}
          <div style={{
            position: "absolute", bottom: "-2px", right: "-2px",
            width: "10px", height: "10px", borderRadius: "50%",
            backgroundColor: t.brand400,
            border: `1.5px solid ${t.surfaceCard}`,
          }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: "13px", fontWeight: 500, color: t.textPrimary,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {user?.name ?? "—"}
          </div>
          <div style={{
            fontSize: "11px", color: t.textMuted, marginTop: "2px",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {user?.email ?? "—"}
          </div>
        </div>

        {/* Role badge */}
        <span style={{
          fontSize: "10px", fontWeight: 500, padding: "3px 8px",
          borderRadius: "9999px", flexShrink: 0,
          backgroundColor: rs.bg, color: rs.color,
        }}>
          {user?.role ?? "—"}
        </span>
      </div>

      {/* Footer — job title + hire date */}
      <div style={{
        padding: "10px 16px",
        backgroundColor: t.neutral100,
        borderTop: `0.5px solid ${t.borderSubtle}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
          <Briefcase size={12} style={{ color: t.brand400, flexShrink: 0 }} />
          <span style={{
            fontSize: "11px", color: t.textSecondary, fontWeight: 500,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {job_title ?? "—"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
          <CalendarDays size={11} style={{ color: t.textMuted }} />
          <span style={{ fontSize: "11px", color: t.textMuted }}>{fmt(hire_date)}</span>
        </div>
      </div>
    </div>
  );
};

/* ─── Employee detail drawer ────────────────────────────── */
const DetailDrawer = ({ employee, onClose }) => {
  if (!employee) return null;
  const { job_title, hire_date, bank_account_number, social_security_number, user } = employee;

  const Row = ({ icon: Icon, label, value }) => (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "10px",
      padding: "10px 0",
      borderBottom: `0.5px solid ${t.borderSubtle}`,
    }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "7px",
        backgroundColor: t.brand50, border: `0.5px solid ${t.brand100}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <Icon size={13} style={{ color: t.brand600 }} />
      </div>
      <div>
        <div style={{ fontSize: "10px", color: t.textMuted, marginBottom: "2px" }}>{label}</div>
        <div style={{ fontSize: "13px", fontWeight: 500, color: t.textPrimary }}>{value || "—"}</div>
      </div>
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "flex-start", justifyContent: "flex-start",
      backgroundColor: "rgba(13,32,24,0.35)",
      backdropFilter: "blur(2px)",
    }}
      onClick={onClose}
    >
      <div
        style={{
          position: "absolute", top: 0, left: 0, bottom: 0,
          width: "360px", maxWidth: "100vw",
          backgroundColor: t.surfaceCard,
          borderLeft: `0.5px solid ${t.borderSubtle}`,
          overflowY: "auto",
          boxShadow: "4px 0 24px rgba(13,32,24,0.12)",
          display: "flex", flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer header */}
        <div style={{
          padding: "20px 20px 16px",
          backgroundColor: t.brand800,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: "15px", fontWeight: 500, color: t.textInverse }}>
            تفاصيل الموظف
          </span>
          <button
            onClick={onClose}
            style={{
              width: "28px", height: "28px", borderRadius: "6px",
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: t.textInverse,
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Avatar block */}
        <div style={{
          padding: "24px 20px 16px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
          borderBottom: `0.5px solid ${t.borderSubtle}`,
        }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "14px",
            backgroundColor: t.brand800, border: `0.5px solid ${t.brand200}`,
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          }}>
            {user?.photoURL
              ? <img src={user.photoURL} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ color: t.textInverse, fontSize: "26px", fontWeight: 500 }}>{user?.name?.[0] ?? "?"}</span>
            }
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "16px", fontWeight: 500, color: t.textPrimary }}>{user?.name}</div>
            <div style={{ fontSize: "12px", color: t.textMuted, marginTop: "3px" }}>{user?.email}</div>
          </div>
          <span style={{
            fontSize: "11px", fontWeight: 500, padding: "4px 12px",
            borderRadius: "9999px",
            ...roleStyle(user?.role),
          }}>
            {user?.role}
          </span>
        </div>

        {/* Detail rows */}
        <div style={{ padding: "4px 20px 24px" }}>
          <Row icon={Briefcase} label="المسمى الوظيفي" value={job_title} />
          <Row icon={CalendarDays} label="تاريخ التعيين" value={fmt(hire_date)} />
          <Row icon={Phone} label="رقم الهاتف" value={user?.phone_number} />
          <Row icon={ShieldCheck} label="رقم الضمان الاجتماعي" value={social_security_number ? "••••••••" : null} />
          <Row icon={ShieldCheck} label="رقم الحساب البنكي" value={bank_account_number ? "••••••••" : null} />
        </div>
      </div>
    </div>
  );
};

/* ─── Empty state ───────────────────────────────────────── */
const EmptyState = () => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "64px 24px", textAlign: "center", gap: "14px",
  }}>
    <div style={{
      width: "64px", height: "64px", borderRadius: "50%",
      backgroundColor: t.brand50, border: `0.5px solid ${t.brand200}`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Search size={28} style={{ color: t.brand400 }} />
    </div>
    <div style={{ fontSize: "16px", fontWeight: 500, color: t.textPrimary }}>لا توجد نتائج</div>
    <div style={{ fontSize: "13px", color: t.textSecondary }}>
      جرب استخدام كلمات بحث أخرى.
    </div>
  </div>
);

/* ─── Error banner ──────────────────────────────────────── */
const ErrorBanner = ({ message, onRetry }) => (
  <div style={{
    backgroundColor: t.errorBg,
    border: `0.5px solid ${t.errorBorder}`,
    borderRight: `3px solid ${t.errorText}`,
    borderRadius: "8px",
    padding: "14px 16px",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <AlertCircle size={16} style={{ color: t.errorText, flexShrink: 0 }} />
      <span style={{ fontSize: "13px", color: t.errorDark }}>
        خطأ في تحميل البيانات: {message}
      </span>
    </div>
    <button
      onClick={onRetry}
      style={{
        fontSize: "12px", fontWeight: 500, color: t.errorText,
        backgroundColor: "transparent", border: `0.5px solid ${t.errorBorder}`,
        borderRadius: "6px", padding: "4px 10px", cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      إعادة المحاولة
    </button>
  </div>
);

/* ─── Pagination ────────────────────────────────────────── */
const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "8px", paddingTop: "24px",
    }}>
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        style={{
          width: "32px", height: "32px", borderRadius: "8px",
          backgroundColor: page <= 1 ? t.neutral200 : t.brand50,
          border: `0.5px solid ${page <= 1 ? t.borderSubtle : t.brand200}`,
          color: page <= 1 ? t.textMuted : t.brand600,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: page <= 1 ? "default" : "pointer",
        }}
      >
        <ChevronRight size={15} />
      </button>

      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            width: "32px", height: "32px", borderRadius: "8px",
            backgroundColor: p === page ? t.brand800 : t.surfaceCard,
            border: `0.5px solid ${p === page ? t.brand800 : t.borderDefault}`,
            color: p === page ? t.textInverse : t.textSecondary,
            fontSize: "13px", fontWeight: p === page ? 500 : 400,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {p}
        </button>
      ))}

      <button
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        style={{
          width: "32px", height: "32px", borderRadius: "8px",
          backgroundColor: page >= pages ? t.neutral200 : t.brand50,
          border: `0.5px solid ${page >= pages ? t.borderSubtle : t.brand200}`,
          color: page >= pages ? t.textMuted : t.brand600,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: page >= pages ? "default" : "pointer",
        }}
      >
        <ChevronLeft size={15} />
      </button>
    </div>
  );
};

/* ─── Main component ────────────────────────────────────── */
const EmployeeDashboard = () => {
  const token = useSelector((state) => state.auth.token);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  /* Debounce search — 400 ms */
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);           // reset to p1 on new search
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  /* Fetch employees from GET /employee */
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
      });

      /*
       * The controller supports:
       *   ?job_title=   (regex, case-insensitive)
       *   ?user=        (MongoDB ObjectId)
       * We search by job_title since we can't easily pass a userId
       * from a name/email string without a separate lookup.
       * Client-side fallback filters by user.name / user.email
       * from already-fetched data when pages === 1.
       */
      if (debouncedSearch) params.append("job_title", debouncedSearch);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/employee?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      // data: { total, page, pages, employees }
      setEmployees(data.employees ?? []);
      setMeta({ total: data.total, page: data.page, pages: data.pages });
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, token]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  /*
   * Secondary client-side filter by user.name / user.email
   * (the backend only filters by job_title via query param).
   */
  const displayEmployees = debouncedSearch
    ? employees.filter((emp) => {
      const q = debouncedSearch.toLowerCase();
      return (
        emp.job_title?.toLowerCase().includes(q) ||
        emp.user?.name?.toLowerCase().includes(q) ||
        emp.user?.email?.toLowerCase().includes(q)
      );
    })
    : employees;

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

      <main style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* ── Heading ── */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{
              fontSize: "22px", fontWeight: 500, color: t.textPrimary,
              margin: 0, marginBottom: "6px",
            }}>
              لوحة تحكم الموظفين
            </h1>
            <p style={{ fontSize: "13px", color: t.textSecondary, margin: 0 }}>
              مرحباً بك مجدداً. يمكنك هنا مراجعة وإدارة بيانات الموظفين.
            </p>
          </div>

          {/* ── Stats row ── */}
          <div style={{
            display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap",
          }}>
            {[
              { label: "إجمالي الموظفين", value: meta.total, icon: Users, accent: false },
              { label: "الصفحة الحالية", value: `${meta.page} / ${meta.pages}`, icon: CalendarDays, accent: false },
            ].map(({ label, value, icon: Icon, accent }) => (
              <div key={label} style={{
                flex: "1 1 160px",
                backgroundColor: t.surfaceCard,
                border: `0.5px solid ${accent ? t.borderAccent : t.borderSubtle}`,
                borderRadius: "10px",
                padding: "14px 16px",
                display: "flex", alignItems: "center", gap: "12px",
              }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "8px",
                  backgroundColor: accent ? t.accent50 : t.brand50,
                  border: `0.5px solid ${accent ? t.borderAccent : t.brand100}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={16} style={{ color: accent ? t.accent600 : t.brand600 }} />
                </div>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 500, color: t.textPrimary }}>{value}</div>
                  <div style={{ fontSize: "11px", color: t.textMuted, marginTop: "1px" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Search ── */}
          <section style={{ marginBottom: "24px" }}>
            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute", top: "50%", right: "14px",
                  transform: "translateY(-50%)",
                  color: searchFocused ? t.brand600 : t.textMuted,
                  pointerEvents: "none", transition: "color 0.15s",
                }}
              />
              <input
                type="text"
                placeholder="ابحث بالاسم أو البريد الإلكتروني أو المسمى الوظيفي..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  width: "100%",
                  padding: "9px 42px 9px 14px",
                  backgroundColor: t.surfaceCard,
                  border: `${searchFocused ? "2px" : "0.5px"} solid ${searchFocused ? t.borderBrand : t.borderDefault}`,
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
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  style={{
                    position: "absolute", top: "50%", left: "10px",
                    transform: "translateY(-50%)",
                    backgroundColor: "transparent", border: "none",
                    cursor: "pointer", color: t.textMuted, padding: "2px",
                    display: "flex", alignItems: "center",
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </section>

          {/* ── Content ── */}
          <div style={{ minHeight: "400px" }}>
            {loading ? (
              <Loading variant="inline" message="جاري تحميل بيانات الموظفين..." />

            ) : error ? (
              <ErrorBanner message={error} onRetry={fetchEmployees} />

            ) : displayEmployees.length > 0 ? (
              <>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "16px",
                }}>
                  {displayEmployees.map((emp) => (
                    <EmployeeCard
                      key={emp._id}
                      employee={emp}
                      onSelect={setSelectedEmployee}
                    />
                  ))}
                </div>

                <Pagination
                  page={meta.page}
                  pages={meta.pages}
                  onPageChange={(p) => setCurrentPage(p)}
                />
              </>
            ) : (
              <div style={{
                backgroundColor: t.surfaceCard,
                border: `0.5px solid ${t.borderSubtle}`,
                borderRadius: "12px",
              }}>
                <EmptyState />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Slide-in detail drawer ── */}
      <DetailDrawer
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
};

export default EmployeeDashboard;