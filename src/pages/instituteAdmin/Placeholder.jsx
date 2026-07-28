import React from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/Card";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { INSTITUTE_NAV } from "../../constants/institute";
import { Hammer } from "lucide-react";

// Generic "coming soon" screen for institute tabs not yet built (Phase 2+).
const Placeholder = () => {
  const location = useLocation();
  const nav = INSTITUTE_NAV.find((n) => n.to === location.pathname);
  const title = nav?.label || "قيد الإنشاء";

  return (
    <div className="space-y-6">
      <AdminPageHeader title={title} description="هذه الوحدة قيد التطوير وستتوفر في مرحلة لاحقة." />
      <Card className="border-none shadow-sm">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="rounded-2xl bg-accent-50 p-4 text-accent-600">
            <Hammer size={32} />
          </div>
          <p className="text-lg font-semibold text-text-primary">{title}</p>
          <p className="max-w-md text-sm text-text-secondary">
            تم تجهيز هذا القسم في القائمة وسيتم ربطه بالبيانات ضمن المراحل القادمة من بناء بوابة المعهد.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Placeholder;
