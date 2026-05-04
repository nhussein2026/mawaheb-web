import React from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { BookMarked, GraduationCap, ListChecks, Building2, FileText, ArrowUpLeft } from "lucide-react";

const links = [
  {
    title: "ملف طالب المنحة",
    description: "إنشاء أو تحديث بيانات المنحة المنظّمة",
    href: "/student/scholarship-student-form",
    icon: GraduationCap,
  },
  {
    title: "الفصول الدراسية",
    description: "إعداد الفصول الأكاديمية",
    href: "/semester-list",
    icon: ListChecks,
  },
  {
    title: "الجامعات",
    description: "بيانات مرجعية للمؤسسات",
    href: "/universityDetails",
    icon: Building2,
  },
  {
    title: "تقارير الطلاب (إعداد)",
    description: "محرّر التقرير الطويل",
    href: "/try-report",
    icon: FileText,
  },
];

export default function AdminScholarshipHub() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="عمليات المنح"
          description="اختصارات لمسارات المنح الموجودة في التطبيق. لا توجد نماذج مكررة هنا — هذه الصفحة للتنقّل فقط."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.href}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className="h-5 w-5 text-brand-600" />
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    to={item.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-text-brand hover:underline"
                  >
                    فتح
                    <ArrowUpLeft className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card variant="award">
          <CardContent className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <BookMarked className="h-6 w-6 shrink-0 text-text-accent" />
              <div>
                <p className="text-sm font-medium text-accent-900">واجهات مرتبطة بالتميّز</p>
                <p className="text-xs text-text-accent">
                  الأسطح الذهبية تُستخدم لسياق الإنجاز — باعتدال وفق نظام ألوان مواهب.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
