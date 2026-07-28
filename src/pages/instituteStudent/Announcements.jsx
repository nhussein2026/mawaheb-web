import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import instituteApi from "../../services/api/instituteApi";
import { announcementScopeLabel } from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleDateString("ar") : "—");

const Announcements = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    instituteApi
      .getMyAnnouncements()
      .then((res) => setRows(res.data?.data || []))
      .catch(() => toast.error("تعذر تحميل الإعلانات"));
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="الإعلانات والتوجيهات" description="الإعلانات الموجهة إليك ضمن فترة النشر الحالية." />
      <div className="space-y-3">
        {rows.map((a) => (
          <Card key={a._id} className="border-none shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-text-primary">{a.title}</p>
                <span className="shrink-0 rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                  {announcementScopeLabel(a.targetScope)}
                </span>
              </div>
              <p className="mt-2 text-sm text-text-secondary">{a.content}</p>
              <p className="mt-2 text-xs text-text-muted">
                النشر: {dt(a.publishStart)} — {dt(a.publishEnd)}
              </p>
            </CardContent>
          </Card>
        ))}
        {!rows.length && (
          <Card className="border-none shadow-sm">
            <CardContent className="py-10 text-center text-text-secondary">لا توجد إعلانات حالياً.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Announcements;
