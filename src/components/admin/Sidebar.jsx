import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  ShieldAlert,
  X,
  GraduationCap,
  UserPlus,
  FileText,
  MessageSquare,
  Layers,
  Wallet,
  BookMarked,
} from "lucide-react";
import { cn } from "../../utils/cn";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth?.user || {});
  const role = user?.role || "Employee";
  const isAdmin = role === "Admin";

  const navigation = [
    { name: "نظرة عامة", href: isAdmin ? "/admin-dashboard" : "/employee-dashboard", icon: LayoutDashboard, roles: ["Admin", "Employee"] },
    { name: "التحليلات", href: "/admin-dashboard/analytics", icon: BarChart3, roles: ["Admin"] },
    { name: "المستخدمون", href: isAdmin ? "/admin-dashboard/users" : "/employee-dashboard/users", icon: Users, roles: ["Admin", "Employee"] },
    { name: "طلبات الأدوار", href: "/admin-dashboard/role-requests", icon: UserPlus, roles: ["Admin"] },
    { name: "الأدوار والصلاحيات", href: "/admin-dashboard/roles", icon: ShieldAlert, roles: ["Admin"] },
    { name: "تقارير الطلاب", href: isAdmin ? "/admin-dashboard/reports" : "/employee-dashboard/reports", icon: FileText, roles: ["Admin", "Employee"] },
    { name: "التذاكر", href: isAdmin ? "/admin-dashboard/tickets" : "/employee-dashboard/tickets", icon: MessageSquare, roles: ["Admin", "Employee"] },
    { name: "البرامج والمحتوى", href: isAdmin ? "/admin-dashboard/programs" : "/employee-dashboard/programs", icon: Layers, roles: ["Admin", "Employee"] },
    { name: "السجلات المالية", href: "/admin-dashboard/financial", icon: Wallet, roles: ["Admin"] },
    { name: "عمليات المنح", href: "/admin-dashboard/scholarship", icon: BookMarked, roles: ["Admin"] },
  ];

  const allowedNav = navigation.filter(item => item.roles.includes(role));

  // Visual distinction between Admin and Employee
  const sidebarBg = isAdmin ? "bg-surface-nav" : "bg-surface-header";
  const borderColor = isAdmin ? "border-brand-800" : "border-brand-700";
  const hoverBg = isAdmin ? "hover:bg-brand-800" : "hover:bg-brand-700";
  const activeBg = isAdmin ? "bg-brand-800" : "bg-brand-700";
  const iconColor = isAdmin ? "text-brand-400" : "text-brand-200";
  const brandTitleColor = isAdmin ? "text-text-inverse" : "text-brand-50";

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-[var(--color-surface-overlay)] lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          `fixed inset-y-0 start-0 flex w-64 flex-col ${sidebarBg} transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0`,
          sidebarOpen ? "z-[60] translate-x-0" : "z-30 translate-x-full"
        )}
      >
        <div className={`flex h-16 shrink-0 items-center justify-between border-b ${borderColor} px-5`}>
          <Link
            to={isAdmin ? "/admin-dashboard" : "/employee-dashboard"}
            className="flex items-center gap-2.5"
            onClick={() => setSidebarOpen(false)}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-md ${activeBg}`}>
              <GraduationCap className="h-5 w-5 text-accent-400" aria-hidden="true" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className={`text-[15px] font-medium ${brandTitleColor}`}>مواهب</span>
              <span className="text-[11px] font-medium uppercase tracking-[0.07em] text-brand-200">
                {isAdmin ? "لوحة الإدارة الشاملة" : "لوحة الموظفين"}
              </span>
            </div>
          </Link>
          <button
            type="button"
            className={`rounded-md p-1.5 text-brand-200 ${hoverBg} hover:text-text-inverse lg:hidden`}
            onClick={() => setSidebarOpen(false)}
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.07em] text-brand-200">
            القائمة
          </p>
          {allowedNav.map((item) => {
            const isActive =
              location.pathname === item.href ||
              (!["/admin-dashboard", "/employee-dashboard"].includes(item.href) && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? `border-e-2 border-e-accent-400 ${activeBg} text-text-inverse`
                    : `border-e-2 border-e-transparent text-brand-200 ${hoverBg} hover:text-brand-100`
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    isActive ? "text-text-inverse" : `${iconColor} group-hover:text-brand-100`
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className={`shrink-0 border-t ${borderColor} p-4`}>
          <Link
            to="/"
            className={`flex w-full items-center justify-center rounded-md border-[0.5px] border-brand-200 ${activeBg} px-4 py-2 text-sm font-medium text-brand-50 transition-colors hover:bg-brand-600 hover:text-text-inverse`}
            onClick={() => setSidebarOpen(false)}
          >
            العودة إلى الموقع
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

