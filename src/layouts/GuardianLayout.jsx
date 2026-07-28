import React from "react";
import { Outlet, Navigate, NavLink, useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut, ClipboardList, FileBarChart, ScrollText, Wallet, LayoutDashboard } from "lucide-react";
import { cn } from "../utils/cn";
import {
  isGuardianLoggedIn,
  getGuardianStudent,
  guardianLogout,
} from "../services/api/guardianApi";

const NAV = [
  { to: "/guardian", end: true, label: "الرئيسية", icon: LayoutDashboard },
  { to: "/guardian/results", label: "النتائج", icon: ClipboardList },
  { to: "/guardian/evaluations", label: "التقويم", icon: FileBarChart },
  { to: "/guardian/behavior", label: "السلوك", icon: ScrollText },
  { to: "/guardian/fees", label: "الرسوم", icon: Wallet },
];

// Minimal read-only shell for guardians (spec §6.15) — no admin chrome.
const GuardianLayout = () => {
  const navigate = useNavigate();
  const student = getGuardianStudent();

  if (!isGuardianLoggedIn()) return <Navigate to="/guardian/login" replace />;

  const logout = () => {
    guardianLogout();
    navigate("/guardian/login", { replace: true });
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-surface-page text-text-primary" dir="rtl" lang="ar">
      <header className="border-b-[0.5px] border-border-subtle bg-surface-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-800">
              <ShieldCheck className="h-5 w-5 text-accent-400" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium text-text-primary">بوابة ولي الأمر</p>
              <p className="text-[11px] text-text-secondary">
                الطالب: {student?.studentName || "—"}
                {student?.academicNumber ? ` · ${student.academicNumber}` : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-error-text hover:bg-error-bg"
          >
            <LogOut className="h-4 w-4" /> خروج
          </button>
        </div>
        <nav className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-2 sm:px-6">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-b-brand-600 text-brand-700"
                    : "border-b-transparent text-text-secondary hover:text-text-primary"
                )
              }
            >
              <n.icon className="h-4 w-4" aria-hidden="true" />
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default GuardianLayout;
