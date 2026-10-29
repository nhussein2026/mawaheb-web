import React, { Suspense } from "react";
import Loading from "../components/ui/Loading";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { LogOut, ClipboardList, FileBarChart, ScrollText, Wallet, LayoutDashboard } from "lucide-react";
import { LinkTabs } from "../components/ui/Tabs";
import {
  isGuardianLoggedIn,
  getGuardianStudent,
  guardianLogout,
} from "../services/api/guardianApi";
import foundationLogo from "../assets/logo/drklogo.webp";

const NAV = [
  { to: "/guardian", end: true, label: "الرئيسية", icon: LayoutDashboard },
  { to: "/guardian/results", label: "النتائج", icon: ClipboardList },
  { to: "/guardian/evaluations", label: "التقويم", icon: FileBarChart },
  { to: "/guardian/behavior", label: "السلوك", icon: ScrollText },
  { to: "/guardian/fees", label: "الرسوم", icon: Wallet },
];

// Minimal read-only shell for guardians — no workspace chrome. Designed for
// phones first; navigation is a row of tabs that scrolls sideways.
const GuardianLayout = () => {
  const navigate = useNavigate();
  const student = getGuardianStudent();

  if (!isGuardianLoggedIn()) return <Navigate to="/guardian/login" replace />;

  const logout = () => {
    guardianLogout();
    navigate("/guardian/login", { replace: true });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-text-primary" dir="rtl" lang="ar" data-scope="foundation">
      <a
        href="#main"
        className="sr-only z-[1500] rounded-md bg-surface px-4 py-2 text-sm font-semibold text-brand-strong focus:not-sr-only focus:fixed focus:start-4 focus:top-3"
      >
        تخطي إلى المحتوى
      </a>
      <header className="sticky top-0 z-[200] border-b border-border-default bg-surface">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 pt-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <img src={foundationLogo} alt="مؤسسة مواهب" width="36" height="40" className="h-10 w-auto shrink-0" />
            <div className="min-w-0 leading-tight">
              <p className="text-sm font-semibold text-text-primary">بوابة ولي الأمر</p>
              <p className="truncate text-xs text-text-tertiary">
                الطالب: <bdi>{student?.studentName || "—"}</bdi>
                {student?.academicNumber ? (
                  <>
                    {" · "}
                    <span className="num ltr">{student.academicNumber}</span>
                  </>
                ) : null}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold text-danger-700 hover:bg-danger-50"
          >
            <LogOut className="size-4" aria-hidden="true" />
            تسجيل الخروج
          </button>
        </div>
        <LinkTabs items={NAV} label="أقسام بوابة ولي الأمر" className="mx-auto mt-1 max-w-4xl border-b-0 px-2 sm:px-4" />
      </header>

      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 outline-none sm:px-6">
        <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
      </main>
    </div>
  );
};

export default GuardianLayout;
