import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import instituteApi from "../../services/api/instituteApi";
import { behaviorTypeLabel } from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleString("ar") : "—");

const Behavior = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    instituteApi
      .getMyBehavior()
      .then((res) => setRows(res.data?.data || []))
      .catch(() => toast.error("تعذر تحميل السجل"));
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="السجل السلوكي" description="ملاحظاتك السلوكية المسجلة من قبل المشرفين." />
      <div className="space-y-2">
        {rows.map((en) => (
          <Card key={en._id} className="border-none shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    en.type === "positive" ? "bg-success-bg text-success-text" : "bg-error-bg text-error-text"
                  }`}
                >
                  {behaviorTypeLabel(en.type)}
                </span>
                <span className="font-medium text-text-primary">{en.title}</span>
              </div>
              <p className="mt-1 text-sm text-text-secondary">{en.description}</p>
              <p className="mt-1 text-xs text-text-muted">
                {dt(en.createdAt)}
                {en.attachmentUrl && (
                  <>
                    {" · "}
                    <a href={en.attachmentUrl} target="_blank" rel="noreferrer" className="text-brand-600 underline">
                      المرفق
                    </a>
                  </>
                )}
              </p>
            </CardContent>
          </Card>
        ))}
        {!rows.length && (
          <Card className="border-none shadow-sm">
            <CardContent className="py-10 text-center text-text-secondary">لا توجد سجلات.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Behavior;
