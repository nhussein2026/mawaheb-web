import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Outlet,
  Navigate,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { GraduationCap, X, Menu, User, LogOut, ChevronDown } from "lucide-react";
import { cn } from "../utils/cn";
import { logout } from "../features/user/authSlice";
import { INSTITUTE_STUDENT_NAV, isInstituteStudentUser } from "../constants/institute";

// Layout shell for the Institute student portal (spec §6 "student face").
// Access is limited to users whose instituteRole is "student". Self-contained
// sidebar + header (no admin chrome, no academic-year switcher).
const InstituteStudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth?.user || {});
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isInstituteStudentUser(user)) return <Navigate to="/" replace />;

  const currentTitle = () => {
    const path = location.pathname;
    const match = [...INSTITUTE_STUDENT_NAV]
      .filter((n) => (n.end ? path === n.to : path.startsWith(n.to)))
      .sort((a, b) => b.to.length - a.to.length)[0];
    return match ? match.label : "بوابة المعهد";
  };

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  const avatarSrc =
    user?.imageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "Student"
    )}&background=EAF3EC&color=1A3A2A`;

  return (
    <div className="flex h-[100dvh] min-h-0 bg-surface-page text-text-primary" dir="rtl" lang="ar">
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-[var(--color-surface-overlay)] lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          "fixed inset-y-0 start-0 flex w-64 flex-col bg-surface-nav transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0",
          sidebarOpen ? "z-[60] translate-x-0" : "z-30 translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-brand-800 px-5">
          <NavLink to="/institute-portal" end className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-800">
              <GraduationCap className="h-5 w-5 text-accent-400" aria-hidden="true" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-medium text-text-inverse">بوابة الطالب</span>
              <span className="text-[11px] font-medium tracking-[0.03em] text-brand-200">
                معهد حضرموت للموهوبين
              </span>
            </div>
          </NavLink>
          <button
            type="button"
            className="rounded-md p-1.5 text-brand-200 hover:bg-brand-800 hover:text-text-inverse lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="custom-scrollbar flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.07em] text-brand-200">القائمة</p>
          {INSTITUTE_STUDENT_NAV.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-e-2 border-e-accent-400 bg-brand-800 text-text-inverse"
                    : "border-e-2 border-e-transparent text-brand-200 hover:bg-brand-800 hover:text-brand-100"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-text-inverse" : "text-brand-400 group-hover:text-brand-100"
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-brand-800 p-4">
          <NavLink
            to="/"
            className="flex w-full items-center justify-center rounded-md border-[0.5px] border-brand-200 bg-brand-800 px-4 py-2 text-sm font-medium text-brand-50 transition-colors hover:bg-brand-600 hover:text-text-inverse"
            onClick={() => setSidebarOpen(false)}
          >
            العودة إلى الموقع
          </NavLink>
        </div>
      </div>

      {/* Main column */}
      <div className="relative z-40 flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-[70] flex h-16 shrink-0 items-center justify-between gap-3 border-b-[0.5px] border-brand-800 bg-surface-header px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              className="shrink-0 rounded-md p-2 text-brand-200 hover:bg-brand-800 hover:text-text-inverse lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">فتح القائمة</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-medium text-text-inverse">{currentTitle()}</h2>
              <p className="truncate text-[11px] text-brand-200">معهد حضرموت للموهوبين</p>
            </div>
          </div>

          <div ref={wrapRef} className="relative shrink-0">
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border-[0.5px] border-brand-600 p-0.5 pe-1 hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <span className="inline-flex h-9 w-9 overflow-hidden rounded-full">
                <img className="h-full w-full object-cover" src={avatarSrc} alt="" />
              </span>
              <ChevronDown className="hidden h-4 w-4 text-brand-200 sm:block" aria-hidden="true" />
            </button>
            {menuOpen && (
              <div className="absolute end-0 top-full z-[80] mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-lg border-[0.5px] border-border-subtle bg-surface-card py-2 shadow-sm">
                <div className="border-b-[0.5px] border-border-subtle px-4 py-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-text-muted">الحساب</p>
                  <p className="truncate text-sm text-text-primary">{user?.name}</p>
                  <p className="truncate text-xs text-text-secondary">{user?.email}</p>
                </div>
                <NavLink
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-brand-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="h-4 w-4 shrink-0" />
                  الملف الشخصي
                </NavLink>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-start text-sm text-error-text hover:bg-error-bg"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstituteStudentLayout;
