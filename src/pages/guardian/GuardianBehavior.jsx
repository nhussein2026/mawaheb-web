import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent } from "../../components/ui/Card";
import guardianApi from "../../services/api/guardianApi";
import { behaviorTypeLabel } from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleString("ar") : "—");

const GuardianBehavior = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    guardianApi
      .getBehavior()
      .then((res) => setRows(res.data?.data || []))
      .catch(() => toast.error("تعذر تحميل السجل"));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-text-primary">السجل السلوكي</h1>
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
              <p className="mt-1 text-xs text-text-muted">{dt(en.createdAt)}</p>
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

export default GuardianBehavior;
