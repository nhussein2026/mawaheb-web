import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, GraduationCap, ListChecks, Building2, FileText } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";

const links = [
  { title: "ملف طالب المنحة", description: "إنشاء بيانات المنحة أو تحديثها", href: "/student/scholarship-student-form", icon: GraduationCap },
  { title: "الفصول الدراسية", description: "الفصول الأكاديمية ومقرراتها", href: "/semester-list", icon: ListChecks },
  { title: "الجامعات", description: "بيانات الجامعة المرتبطة بالمنحة", href: "/universityDetails", icon: Building2 },
  { title: "تقرير الطالب", description: "نموذج التقرير الفصلي", href: "/try-report", icon: FileText },
];

// Shortcuts to the scholarship screens that live in the student portal.
export default function AdminScholarshipHub() {
  return (
    <div className="space-y-6">
      <PageHeader title="عمليات المنح" description="اختصارات إلى صفحات المنح في بوابة الطالب." />
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className="group flex h-full items-center gap-4 rounded-lg border border-border-default bg-surface p-4 transition-shadow hover:shadow-raised sm:p-5"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-brand-subtle text-brand-text">
                <item.icon className="size-6" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-heading-4 text-text-primary group-hover:underline">{item.title}</span>
                <span className="block text-sm text-text-secondary">{item.description}</span>
              </span>
              <ChevronLeft className="size-5 shrink-0 text-text-tertiary" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
