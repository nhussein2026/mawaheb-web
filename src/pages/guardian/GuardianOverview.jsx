import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ClipboardList, FileBarChart, ScrollText, Bell } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import StatGrid from "../../components/institute/StatGrid";
import guardianApi, { getGuardianStudent } from "../../services/api/guardianApi";
import { levelLabel } from "../../constants/institute";

const GuardianOverview = () => {
  const [counts, setCounts] = useState({});
  const student = getGuardianStudent() || {};

  useEffect(() => {
    guardianApi
      .getOverview()
      .then((res) => setCounts(res.data?.data?.counts || {}))
      .catch(() => toast.error("تعذر تحميل البيانات"));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-brand-800 p-6 text-neutral-50">
        <h1 className="text-xl font-bold">متابعة الطالب: {student.studentName}</h1>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {student.academicNumber && (
            <span className="rounded-full bg-brand-700 px-3 py-1">الرقم الأكاديمي: {student.academicNumber}</span>
          )}
          {student.batch && <span className="rounded-full bg-brand-700 px-3 py-1">الدفعة {student.batch}</span>}
          {student.level && <span className="rounded-full bg-brand-700 px-3 py-1">{levelLabel(student.level)}</span>}
        </div>
      </div>

      <StatGrid
        stats={[
          { label: "النتائج المتاحة", value: counts.results ?? 0, icon: ClipboardList, tone: "brand" },
          { label: "تقارير التقويم", value: counts.evaluations ?? 0, icon: FileBarChart, tone: "accent" },
          { label: "السجلات السلوكية", value: counts.behavior ?? 0, icon: ScrollText, tone: "neutral" },
          { label: "بانتظار اطلاعك", value: counts.unseen ?? 0, icon: Bell, tone: "danger" },
        ]}
      />

      <Card className="border-none shadow-sm">
        <CardContent className="py-4 text-sm text-text-secondary">
          استخدم التبويبات بالأعلى لاستعراض النتائج الدراسية وتقارير التقويم والسجل السلوكي وحالة الرسوم.
        </CardContent>
      </Card>
    </div>
  );
};

export default GuardianOverview;
