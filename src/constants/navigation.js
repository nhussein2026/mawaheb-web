// Sidebar navigation per role (§2.2, §4.7 "Sidebar"). Each entry is a group
// { key, label?, scope?, items: [{ key, label, to, icon, end?, countKey? }] }.
// Groups appear only to users with access to them; a group with
// scope "institute" carries the teal scope marker.

import {
  LayoutDashboard,
  BarChart3,
  Users,
  UserPlus,
  ShieldCheck,
  FileText,
  MessageSquare,
  Layers,
  Wallet,
  Plane,
  School,
  BookOpen,
  CalendarDays,
  LifeBuoy,
  StickyNote,
  Trophy,
  ScrollText,
  TriangleAlert,
  CreditCard,
  ListOrdered,
  UserRound,
} from "lucide-react";
import { INSTITUTE_NAV, INSTITUTE_STUDENT_NAV } from "./institute";

const filterGroups = (groups) =>
  groups
    .map((g) => ({ ...g, items: g.items.filter(Boolean) }))
    .filter((g) => g.items.length > 0);

// ── Workspace (platform Admin and Employee = Foundation-wide staff) ──────────
export function workspaceNav(user) {
  const isAdmin = user?.role === "Admin";
  const base = isAdmin ? "/admin-dashboard" : "/employee-dashboard";
  return filterGroups([
    {
      key: "home",
      items: [
        { key: "overview", label: "نظرة عامة", to: base, icon: LayoutDashboard, end: true },
      ],
    },
    {
      key: "students",
      label: "الطلاب والمتابعة",
      items: [
        { key: "reports", label: "تقارير الطلاب", to: `${base}/reports`, icon: FileText },
        { key: "tickets", label: "التذاكر", to: `${base}/tickets`, icon: MessageSquare },
      ],
    },
    {
      key: "programs",
      label: "البرامج والابتعاث",
      items: [
        { key: "programs", label: "البرامج والمحتوى", to: `${base}/programs`, icon: Layers },
        isAdmin && { key: "scholarship", label: "عمليات المنح", to: `${base}/scholarship`, icon: Plane },
        isAdmin && { key: "financial", label: "السجلات المالية", to: `${base}/financial`, icon: Wallet },
      ],
    },
    {
      key: "institute",
      label: "المعهد",
      scope: "institute",
      items: [
        isAdmin && { key: "institute", label: "بوابة المعهد", to: "/institute-admin", icon: School },
      ],
    },
    {
      key: "insights",
      label: "التقارير",
      items: [isAdmin && { key: "analytics", label: "التحليلات", to: `${base}/analytics`, icon: BarChart3 }],
    },
    {
      key: "settings",
      label: "الإعدادات",
      items: [
        { key: "users", label: "المستخدمون", to: `${base}/users`, icon: Users },
        isAdmin && {
          key: "role-requests",
          label: "طلبات الأدوار",
          to: `${base}/role-requests`,
          icon: UserPlus,
          countKey: "roleRequests",
        },
        isAdmin && { key: "roles", label: "الأدوار والصلاحيات", to: `${base}/roles`, icon: ShieldCheck },
      ],
    },
  ]);
}

// ── Institute staff portal (Institute scope) ─────────────────────────────────
const INSTITUTE_GROUPS = [
  { key: "institute", label: "المعهد" },
  { key: "learning", label: "التعلّم والتقويم" },
  { key: "care", label: "شؤون الطلاب" },
  { key: "comms", label: "التواصل" },
];

export function instituteNav(user, items = INSTITUTE_NAV) {
  const groups = INSTITUTE_GROUPS.map((g) => ({
    ...g,
    scope: "institute",
    items: items.filter((n) => n.group === g.key),
  }));
  if (user?.role === "Admin") {
    groups.push({
      key: "workspace",
      label: "المؤسسة",
      items: [{ key: "workspace", label: "مساحة العمل", to: "/admin-dashboard", icon: LayoutDashboard }],
    });
  }
  return filterGroups(groups);
}

// ── Student portal (Scholarship Student, User) — Foundation scope ────────────
export function studentNav(user) {
  const role = user?.role;
  const isScholar = role === "Scholarship Student";
  const isStudent = isScholar || role === "Institute Student";
  return filterGroups([
    {
      key: "home",
      items: [{ key: "home", label: "الرئيسية", to: "/student-dashboard", icon: LayoutDashboard, end: true }],
    },
    {
      key: "scholarship",
      label: "الابتعاث",
      items: [
        isScholar && { key: "scholarship-form", label: "بيانات المنحة", to: "/student/scholarship-student-form", icon: UserRound },
        isStudent && { key: "semesters", label: "السجل الأكاديمي", to: "/semester-list", icon: ListOrdered },
        isScholar && { key: "report", label: "تقرير الطالب", to: "/student-report", icon: FileText },
        isScholar && { key: "financial", label: "التقرير المالي", to: "/student/financial-report", icon: CreditCard },
        isScholar && { key: "difficulties", label: "الصعوبات والتحديات", to: "/student/difficulties", icon: TriangleAlert },
      ],
    },
    {
      key: "activity",
      label: "أنشطتي",
      items: [
        isStudent && { key: "courses", label: "الدورات التدريبية", to: "/student/courses", icon: BookOpen },
        isStudent && { key: "events", label: "الفعاليات والأنشطة", to: "/student/events", icon: CalendarDays },
        isStudent && { key: "achievements", label: "إنجازاتي", to: "/student/achievements", icon: Trophy },
        isStudent && { key: "certificates", label: "الشهادات المهنية", to: "/student/certificates", icon: ScrollText },
        isStudent && { key: "notes", label: "الملاحظات", to: "/notes", icon: StickyNote },
      ],
    },
    {
      key: "support",
      label: "الدعم",
      items: [{ key: "tickets", label: "التذاكر والدعم", to: "/student/tickets", icon: LifeBuoy }],
    },
  ]);
}

// ── Institute student portal — Foundation scope (student-facing) ─────────────
const IS_GROUPS = [
  { key: "home" },
  { key: "study", label: "دراستي" },
  { key: "activity", label: "أنشطتي" },
  { key: "requests", label: "طلباتي" },
  { key: "comms", label: "التواصل" },
];

export function instituteStudentNav() {
  return filterGroups(
    IS_GROUPS.map((g) => ({ ...g, items: INSTITUTE_STUDENT_NAV.filter((n) => n.group === g.key) }))
  );
}
