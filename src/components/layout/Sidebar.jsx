import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  BookOpen,
  Calendar,
  Ticket,
  StickyNote,
  Trophy,
  Award,
  AlertTriangle,
  CreditCard,
  User,
  List,
  Menu,
  X,
  Sparkles,
  LayoutDashboard
} from "lucide-react";
import { cn } from "../../utils/cn";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const user = useSelector((state) => state.auth?.user || {});
  const role = user?.role || "Institute Student";
  
  const isScholarship = role === "Scholarship Student";

  const links = [
    { to: "/", label: "الرئيسية", icon: LayoutDashboard, roles: ["Scholarship Student", "Institute Student", "User"] },
    { to: "/student-report", label: "تقرير الطالب", icon: FileText, roles: ["Scholarship Student"] },
    { to: "/student/courses", label: "الدورات التدريبية", icon: BookOpen, roles: ["Scholarship Student", "Institute Student"] },
    { to: "/student/events", label: "الفعاليات والأنشطة", icon: Calendar, roles: ["Scholarship Student", "Institute Student"] },
    { to: "/student/tickets", label: "التذاكر والدعم", icon: Ticket, roles: ["Scholarship Student", "Institute Student", "User"] },
    { to: "/notes", label: "الملاحظات", icon: StickyNote, roles: ["Scholarship Student", "Institute Student"] },
    { to: "/student/achievements", label: "إنجازاتي", icon: Trophy, roles: ["Scholarship Student", "Institute Student"] },
    { to: "/student/certificates", label: "الشهادات المهنية", icon: Award, roles: ["Scholarship Student", "Institute Student"] },
    { to: "/student/difficulties", label: "الصعوبات والتحديات", icon: AlertTriangle, roles: ["Scholarship Student"] },
    { to: "/student/financial-report", label: "التقرير المالي", icon: CreditCard, roles: ["Scholarship Student"] },
    { to: "/semester-list", label: "السجل الأكاديمي", icon: List, roles: ["Scholarship Student", "Institute Student"] },
    { to: "/student/scholarship-student-form", label: "بيانات المنحة", icon: User, roles: ["Scholarship Student"] },
  ];

  const allowedLinks = links.filter(item => item.roles.includes(role));

  // Dynamic Theme based on Scholarship vs Institute
  const toggleBtnBg = isScholarship ? "bg-accent-400 text-accent-900" : "bg-brand-600 text-brand-50";
  const activeText = isScholarship ? "text-accent-400" : "text-brand-300";
  const activeBorder = isScholarship ? "bg-accent-400 shadow-[0_0_10px_rgba(212,168,67,0.5)]" : "bg-brand-400 shadow-[0_0_10px_rgba(78,153,99,0.5)]";
  const logoAccent = isScholarship ? "text-accent-400" : "text-brand-100";
  const hoverText = isScholarship ? "group-hover:text-accent-200" : "group-hover:text-brand-200";

  return (
    <>
      <button
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-2xl shadow-2xl md:hidden hover:scale-110 transition-transform active:scale-95 ${toggleBtnBg}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={cn(
          "fixed top-0 right-0 w-72 h-full bg-surface-nav transition-all duration-500 ease-in-out flex flex-col border-l border-brand-900/50 shadow-2xl",
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0 md:static"
        )}
      >
        <div className="p-8 border-b border-brand-900/40 flex items-center gap-4 bg-gradient-to-br from-brand-900/20 to-transparent">
          <div className={`w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-900/40 border border-brand-500/20 ${logoAccent}`}>
            <Sparkles size={28} fill="currentColor" fillOpacity={0.2} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-brand-50 tracking-tight">مؤسسة مواهب</span>
            <span className={`text-[10px] uppercase tracking-[2px] font-bold ${activeText}`}>
              {isScholarship ? "Mawaheb Scholarship" : "Mawaheb Platform"}
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {allowedLinks.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <li key={link.to} className="list-none">
                <Link
                  to={link.to}
                  className={cn(
                    "flex items-center gap-4 py-3 px-4 transition-all duration-300 rounded-xl group relative overflow-hidden",
                    isActive
                      ? `bg-brand-800 ${activeText} shadow-lg shadow-brand-900/40`
                      : "text-brand-300 hover:bg-brand-800/40 hover:text-brand-100"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {isActive && (
                    <div className={`absolute right-0 top-0 bottom-0 w-1 rounded-l-full ${activeBorder}`}></div>
                  )}
                  <Icon
                    size={20}
                    className={cn(
                      "transition-all duration-300",
                      isActive ? activeText : `text-brand-500 ${hoverText} group-hover:scale-110`
                    )}
                  />
                  <span className={cn(
                    "text-sm transition-all duration-300",
                    isActive ? "font-bold" : "font-medium"
                  )}>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </nav>

        <div className="p-6">
          <div className="flex items-center gap-4 p-4 bg-brand-900/60 rounded-2xl border border-brand-800/50 backdrop-blur-sm group hover:border-brand-700/50 transition-colors">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl flex items-center justify-center text-brand-50 text-sm font-bold shadow-lg border border-brand-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-brand-50 font-bold">بوابة الطالب</span>
              <span className="text-[10px] text-brand-500 font-medium">النسخة الاحترافية 2.4</span>
            </div>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-surface-overlay backdrop-blur-md z-30 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;

