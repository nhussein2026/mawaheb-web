import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import instituteApi from "../../services/api/instituteApi";

const dt = (d) => (d ? new Date(d).toLocaleDateString("ar") : "—");

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [installments, setInstallments] = useState([]);

  useEffect(() => {
    instituteApi
      .getMyFees()
      .then((res) => {
        setFees(res.data?.data?.fees || []);
        setInstallments(res.data?.data?.installments || []);
      })
      .catch(() => toast.error("تعذر تحميل الرسوم"));
  }, []);

  const forFee = (feeId) => installments.filter((i) => String(i.fee) === String(feeId)).sort((a, b) => a.seq - b.seq);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="الرسوم والأقساط" description="حالة رسومك السنوية وأقساطها (للاطلاع فقط)." />

      {fees.map((f) => (
        <Card key={f._id} className="border-none shadow-sm">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-text-secondary">إجمالي الرسوم السنوية</span>
              <span className="text-lg font-bold text-text-primary">{f.totalAnnual ?? 0}</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {forFee(f._id).map((i) => (
                <div key={i._id} className="rounded-lg border-[0.5px] border-border-subtle p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">القسط {i.seq} (50%)</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        i.isPaid ? "bg-success-bg text-success-text" : "bg-error-bg text-error-text"
                      }`}
                    >
                      {i.isPaid ? "✔️ مدفوع" : "❌ غير مدفوع"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">المبلغ: {i.amount ?? 0}</p>
                  <p className="text-xs text-text-muted">تاريخ الاستحقاق: {dt(i.dueDate)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {!fees.length && (
        <Card className="border-none shadow-sm">
          <CardContent className="py-10 text-center text-text-secondary">
            لا توجد رسوم مستحقة عليك (مقعد مجاني أو لم تُسجَّل رسوم بعد).
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Fees;
