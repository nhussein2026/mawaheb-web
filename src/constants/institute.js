// Institute Portal — shared display maps & nav config (Arabic RTL).
// Machine keys mirror the backend enums in mawaheb-backend/utils/instituteEnums.js.

import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Megaphone,
  Bug,
  ClipboardList,
  FileBarChart,
  BookOpen,
  MessagesSquare,
  ScrollText,
  PlaneTakeoff,
  Trophy,
  Lightbulb,
  Wallet,
} from "lucide-react";

// Membership ranks
export const INSTITUTE_ROLE_LABELS = {
  super_admin: "مشرف عام",
  track_supervisor: "مشرف مسار",
  trainer: "مدرب",
  gate_guard: "حارس بوابة",
  student: "طالب / عضو عادي",
};

export const INSTITUTE_ROLE_OPTIONS = Object.entries(INSTITUTE_ROLE_LABELS).map(
  ([value, label]) => ({ value, label })
);

// Ranks that may access the institute admin portal (mirrors backend guard).
export const INSTITUTE_ADMIN_ROLES = ["super_admin", "track_supervisor"];

// Any institute staff rank (non-student) — may enter the portal (mirrors
// backend `isInstituteStaff`). Sensitive routes stay admin-only server-side.
export const INSTITUTE_STAFF_ROLES = [
  "super_admin",
  "track_supervisor",
  "trainer",
  "gate_guard",
];

// Academic levels (6-level classification)
export const ACADEMIC_LEVEL_LABELS = {
  secondary_1: "ثانوي - السنة الأولى",
  secondary_2: "ثانوي - السنة الثانية",
  secondary_3: "ثانوي - السنة الثالثة",
  post_secondary_training: "الفصل التدريبي بعد الثانوية",
  university: "طلاب مستوى جامعي",
  graduate: "طلاب خريجين",
};

export const ACADEMIC_LEVEL_OPTIONS = Object.entries(ACADEMIC_LEVEL_LABELS).map(
  ([value, label]) => ({ value, label })
);

// Seat types
export const SEAT_TYPE_LABELS = {
  free: "مقعد مجاني",
  paid: "مقعد مدفوع",
};

export const SEAT_TYPE_OPTIONS = Object.entries(SEAT_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
);

// ── Announcements (§4) ────────────────────────────────────────
export const ANNOUNCEMENT_SCOPE_LABELS = {
  all: "إعلان عام لكافة الطلاب والمشرفين",
  level: "إعلان مخصص لمستوى أكاديمي",
  batch: "إعلان مخصص لدفعة أو أكثر",
  supervisors: "إعلان مخصص للمشرفين فقط",
};
export const ANNOUNCEMENT_SCOPE_OPTIONS = Object.entries(
  ANNOUNCEMENT_SCOPE_LABELS
).map(([value, label]) => ({ value, label }));

// ── Academic Results (§6) ─────────────────────────────────────
export const RESULT_TERM_LABELS = {
  term_1: "الفصل الدراسي الأول",
  term_2: "الفصل الدراسي الثاني",
};
export const RESULT_EXAM_TYPE_LABELS = {
  monthly_1: "الاختبار الشهري الأول",
  monthly_2: "الاختبار الشهري الثاني",
  term_end: "اختبار نهاية الفصل الدراسي",
  year_end: "اختبار نهاية العام الدراسي",
};
export const RESULT_CLASSIFICATION_LABELS = {
  monthly: "شهري",
  term: "فصلي",
  final: "نهائي",
};

// ── Evaluation Reports (§7) ───────────────────────────────────
export const EVALUATION_PERIOD_LABELS = {
  period_1: "تقرير الفترة الأولى",
  period_2: "تقرير الفترة الثانية",
  term_1: "تقرير الفصل الدراسي الأول",
  period_3: "تقرير الفترة الثالثة",
  period_4: "تقرير الفترة الرابعة",
  year_end: "تقرير ختام العام الدراسي",
  summer: "تقرير النشاط الصيفي",
};

// ── Behavior Log (§10) ────────────────────────────────────────
export const BEHAVIOR_TYPE_LABELS = {
  positive: "إيجابي (+)",
  negative: "سلبي (-)",
};
export const BEHAVIOR_TYPE_OPTIONS = Object.entries(BEHAVIOR_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
);

// ── Leave Requests (§11) ──────────────────────────────────────
export const LEAVE_STATUS_LABELS = {
  pending: "قيد الانتظار",
  approved: "موافقة واعتماد",
  rejected: "رفض الطلب",
};
export const LEAVE_STATUS_OPTIONS = Object.entries(LEAVE_STATUS_LABELS).map(
  ([value, label]) => ({ value, label })
);

// ── Ideas Bank (§13) ──────────────────────────────────────────
export const IDEA_STATUS_LABELS = {
  under_study: "تحت الدراسة",
  approved: "معتمد ومجاز",
  rejected: "غير معتمد",
};
export const IDEA_STATUS_OPTIONS = Object.entries(IDEA_STATUS_LABELS).map(
  ([value, label]) => ({ value, label })
);

// ── Achievements (§12) — unified review workflow ──────────────
export const ACHIEVEMENT_REVIEW_STATUS_LABELS = {
  none: "—",
  pending: "قيد التحكيم",
  approved: "معتمد ومجاز",
  rejected: "مرفوض",
};

export const ACHIEVEMENT_REVIEW_STATUS_OPTIONS = [
  { value: "pending", label: ACHIEVEMENT_REVIEW_STATUS_LABELS.pending },
  { value: "approved", label: ACHIEVEMENT_REVIEW_STATUS_LABELS.approved },
  { value: "rejected", label: ACHIEVEMENT_REVIEW_STATUS_LABELS.rejected },
];

// ── Courses & Programs (§8) ───────────────────────────────────
export const COURSE_TYPE_LABELS = {
  standalone: "دورة مستقلة",
  program: "دورة ضمن برنامج",
};
export const COURSE_TYPE_OPTIONS = Object.entries(COURSE_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
);

export const COURSE_STATUS_LABELS = {
  ongoing: "جارية",
  completed: "مكتملة",
};
export const COURSE_STATUS_OPTIONS = Object.entries(COURSE_STATUS_LABELS).map(
  ([value, label]) => ({ value, label })
);

// ── Correspondence / Bugs (§5 + §9) ───────────────────────────
export const THREAD_STATUS_LABELS = {
  open: "مفتوحة",
  in_progress: "قيد المتابعة",
  resolved: "تم الحل",
  closed: "مغلقة",
  pending: "بالانتظار",
};

// Portal navigation — every tab is a real deep-linkable route.
// `roles` lists the institute ranks that see the tab (platform Admin sees all,
// see `navForUser`). `ready: true` are built modules.
export const INSTITUTE_NAV = [
  { key: "dashboard", group: "institute", label: "لوحة المعهد", to: "/institute-admin", icon: LayoutDashboard, end: true, ready: true, roles: ["super_admin", "track_supervisor", "trainer", "gate_guard"] },
  { key: "academic", group: "institute", label: "الأعوام والطلاب", to: "/institute-admin/academic", icon: GraduationCap, ready: true, roles: ["super_admin"] },
  { key: "members", group: "institute", label: "الأعضاء والمدربين", to: "/institute-admin/members", icon: Users, ready: true, roles: ["super_admin", "track_supervisor"] },
  { key: "notices", group: "comms", label: "الإعلانات والتوجيهات", to: "/institute-admin/notices", icon: Megaphone, ready: true, roles: ["super_admin", "track_supervisor"] },
  { key: "bugs", group: "comms", label: "المشكلات والأخطاء", to: "/institute-admin/bugs", icon: Bug, ready: true, roles: ["super_admin", "track_supervisor"] },
  { key: "results", group: "learning", label: "النتائج الدراسية", to: "/institute-admin/results", icon: ClipboardList, ready: true, roles: ["super_admin", "track_supervisor", "trainer"] },
  { key: "evaluations", group: "learning", label: "تقارير التقويم", to: "/institute-admin/evaluations", icon: FileBarChart, ready: true, roles: ["super_admin", "track_supervisor", "trainer"] },
  { key: "courses", group: "learning", label: "الدورات والبرامج", to: "/institute-admin/courses", icon: BookOpen, ready: true, roles: ["super_admin", "trainer"] },
  { key: "correspondence", group: "comms", label: "المراسلات والتذاكر", to: "/institute-admin/correspondence", icon: MessagesSquare, ready: true, roles: ["super_admin", "track_supervisor", "trainer"] },
  { key: "behavior", group: "care", label: "السجل السلوكي", to: "/institute-admin/behavior", icon: ScrollText, ready: true, roles: ["super_admin", "track_supervisor"] },
  { key: "leave", group: "care", label: "طلبات الاستئذان", to: "/institute-admin/leave", icon: PlaneTakeoff, ready: true, roles: ["super_admin", "track_supervisor", "gate_guard"] },
  { key: "achievements", group: "learning", label: "إنجازات الطلاب", to: "/institute-admin/achievements", icon: Trophy, ready: true, roles: ["super_admin", "track_supervisor", "trainer"] },
  { key: "ideas", group: "learning", label: "بنك الأفكار", to: "/institute-admin/ideas", icon: Lightbulb, ready: true, roles: ["super_admin", "track_supervisor"] },
  { key: "fees", group: "care", label: "الرسوم والأقساط", to: "/institute-admin/fees", icon: Wallet, ready: true, roles: ["super_admin"] },
];

// Nav tabs visible to a given user. Platform Admin sees everything; institute
// staff see the tabs their rank is listed in.
export const navForUser = (user) => {
  if (user?.role === "Admin") return INSTITUTE_NAV;
  const rank = user?.instituteRole;
  return INSTITUTE_NAV.filter((n) => !n.roles || n.roles.includes(rank));
};

// Institute student portal navigation (spec §6 "student face"). Mirrors the
// admin sidebar but points at the read/submit student routes under /institute-portal.
export const INSTITUTE_STUDENT_NAV = [
  { key: "overview", group: "home", label: "الرئيسية", to: "/institute-portal", icon: LayoutDashboard, end: true },
  { key: "announcements", group: "comms", label: "الإعلانات", to: "/institute-portal/announcements", icon: Megaphone },
  { key: "results", group: "study", label: "النتائج الدراسية", to: "/institute-portal/results", icon: ClipboardList },
  { key: "evaluations", group: "study", label: "تقارير التقويم", to: "/institute-portal/evaluations", icon: FileBarChart },
  { key: "courses", group: "study", label: "الدورات والشهادات", to: "/institute-portal/courses", icon: BookOpen },
  { key: "achievements", group: "activity", label: "إنجازاتي", to: "/institute-portal/achievements", icon: Trophy },
  { key: "ideas", group: "activity", label: "بنك الأفكار", to: "/institute-portal/ideas", icon: Lightbulb },
  { key: "leave", group: "requests", label: "طلبات الاستئذان", to: "/institute-portal/leave", icon: PlaneTakeoff },
  { key: "behavior", group: "activity", label: "السجل السلوكي", to: "/institute-portal/behavior", icon: ScrollText },
  { key: "correspondence", group: "comms", label: "المراسلات", to: "/institute-portal/correspondence", icon: MessagesSquare },
  { key: "bugs", group: "comms", label: "المشكلات والأخطاء", to: "/institute-portal/bugs", icon: Bug },
  { key: "fees", group: "requests", label: "الرسوم والأقساط", to: "/institute-portal/fees", icon: Wallet },
];

// A user counts as an institute student if they carry the institute rank
// `student` OR the platform role "Institute Student" (accounts created before
// the two-field split have only the latter).
export const isInstituteStudentUser = (user) =>
  user?.instituteRole === "student" || user?.role === "Institute Student";

export const roleLabel = (v) => INSTITUTE_ROLE_LABELS[v] || v || "—";
export const levelLabel = (v) => ACADEMIC_LEVEL_LABELS[v] || v || "—";
export const seatLabel = (v) => SEAT_TYPE_LABELS[v] || v || "—";
export const announcementScopeLabel = (v) =>
  ANNOUNCEMENT_SCOPE_LABELS[v] || v || "—";
export const behaviorTypeLabel = (v) => BEHAVIOR_TYPE_LABELS[v] || v || "—";
export const leaveStatusLabel = (v) => LEAVE_STATUS_LABELS[v] || v || "—";
export const ideaStatusLabel = (v) => IDEA_STATUS_LABELS[v] || v || "—";
export const resultTermLabel = (v) => RESULT_TERM_LABELS[v] || v || "—";
export const resultExamTypeLabel = (v) => RESULT_EXAM_TYPE_LABELS[v] || v || "—";
export const evaluationPeriodLabel = (v) =>
  EVALUATION_PERIOD_LABELS[v] || v || "—";
export const threadStatusLabel = (v) => THREAD_STATUS_LABELS[v] || v || "—";
export const courseTypeLabel = (v) => COURSE_TYPE_LABELS[v] || v || "—";
export const courseStatusLabel = (v) => COURSE_STATUS_LABELS[v] || v || "—";
export const achievementReviewLabel = (v) =>
  ACHIEVEMENT_REVIEW_STATUS_LABELS[v] || v || "—";

// Status vocabularies (§4.7 "Badges"): one meaning per color across the
// product. Each maps a backend status to a StatusBadge tone.
export const LEAVE_STATUS_TONE = { pending: "warning", approved: "success", rejected: "danger" };
export const IDEA_STATUS_TONE = { under_study: "info", approved: "success", rejected: "danger" };
export const ACHIEVEMENT_REVIEW_TONE = { none: "neutral", pending: "info", approved: "success", rejected: "danger" };
export const COURSE_STATUS_TONE = { ongoing: "info", completed: "success" };
export const THREAD_STATUS_TONE = {
  open: "info",
  in_progress: "warning",
  resolved: "success",
  closed: "neutral",
  pending: "warning",
};
export const BEHAVIOR_TYPE_TONE = { positive: "success", negative: "danger" };
