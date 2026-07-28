import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BadgeCheck, BookOpen } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import instituteApi from "../../services/api/instituteApi";
import { courseStatusLabel } from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleDateString("ar") : "—");

const Courses = () => {
  const [rows, setRows] = useState([]);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    instituteApi
      .getMyCourses()
      .then((res) => setRows(res.data?.data || []))
      .catch(() => toast.error("تعذر تحميل الدورات"));
    instituteApi
      .getMyCertificates()
      .then((res) => setCerts(res.data?.data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="الدورات والشهادات" description="الدورات التدريبية المسجّل بها وشهاداتك الممنوحة." />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-brand-600" /> دوراتي المسجلة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.map((en) => (
            <div key={en._id} className="flex items-center justify-between rounded-lg border-[0.5px] border-border-subtle p-3">
              <div className="min-w-0">
                <p className="font-medium text-text-primary">📘 {en.course?.title || "—"}</p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {en.course?.periodText || "—"} · {courseStatusLabel(en.course?.status)}
                  {en.completed ? " · ✔️ مكتملة" : ""}
                </p>
              </div>
              {en.certificate && (
                <span className="shrink-0 rounded-full bg-success-bg px-2 py-0.5 text-xs text-success-text">شهادة صادرة</span>
              )}
            </div>
          ))}
          {!rows.length && <p className="py-8 text-center text-text-secondary">لا توجد دورات مسجلة.</p>}
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BadgeCheck className="h-4 w-4 text-success-text" /> شهاداتي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {certs.map((c) => (
            <div key={c._id} className="flex items-center justify-between rounded-lg border-[0.5px] border-border-subtle p-3">
              <div className="min-w-0">
                <p className="font-medium text-text-primary">🎖️ {c.certTitleEn || c.title}</p>
                <p className="mt-0.5 text-xs text-text-muted">
                  رقم الشهادة: {c.serial || "—"} · {dt(c.issuedAt)}
                </p>
              </div>
              {(c.certificate_image || c.certificate_link) && (
                <a
                  href={c.certificate_image || c.certificate_link}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-sm text-brand-600 underline"
                >
                  تحميل
                </a>
              )}
            </div>
          ))}
          {!certs.length && <p className="py-8 text-center text-text-secondary">لا توجد شهادات ممنوحة بعد.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Courses;
