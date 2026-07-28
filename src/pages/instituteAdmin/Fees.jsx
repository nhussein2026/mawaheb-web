import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Wallet, Users, CheckCircle2, AlertTriangle, Save } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/DataTable";
import StatGrid from "../../components/institute/StatGrid";
import instituteApi from "../../services/api/instituteApi";

const fmt = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "—");

const InstallmentCell = ({ inst, onToggle }) => {
  if (!inst) return <TableCell className="text-text-muted">—</TableCell>;
  return (
    <TableCell>
      <div className="space-y-1">
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs ${
            inst.isPaid ? "bg-success-bg text-success-text" : "bg-error-bg text-error-text"
          }`}
        >
          {inst.isPaid ? "✔️ مدفوع" : "❌ غير مدفوع"} ({inst.amount})
        </span>
        <p className="text-xs text-text-muted">الاستحقاق: {fmt(inst.dueDate)}</p>
        <button
          onClick={() => onToggle(inst)}
          className={`rounded px-2 py-1 text-xs ${
            inst.isPaid
              ? "bg-error-bg text-error-text hover:opacity-80"
              : "bg-success-bg text-success-text hover:opacity-80"
          }`}
        >
          {inst.isPaid ? "❌ إلغاء السداد" : "✔️ إثبات السداد"}
        </button>
      </div>
    </TableCell>
  );
};

const Fees = () => {
  const year = useSelector((s) => s.academicYear.selectedYearId);
  const [stats, setStats] = useState({});
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState({}); // studentId -> editable total

  const load = async () => {
    try {
      const [st, list] = await Promise.all([
        instituteApi.getFeeStats(year),
        instituteApi.listFees(year),
      ]);
      setStats(st.data?.data || {});
      const data = list.data?.data || [];
      setRows(data);
      const t = {};
      data.forEach((r) => (t[r.student._id] = r.fee?.totalAnnual ?? 0));
      setTotals(t);
    } catch {
      toast.error("تعذر تحميل بيانات الرسوم");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  const saveTotal = async (studentId) => {
    try {
      await instituteApi.setFeeTotal(studentId, { totalAnnual: totals[studentId] });
      toast.success("تم تحديث إجمالي الرسوم");
      load();
    } catch {
      toast.error("تعذر تحديث الرسوم");
    }
  };

  const toggle = async (inst) => {
    const verb = inst.isPaid ? "إلغاء سداد" : "إثبات سداد";
    if (!window.confirm(`تأكيد ${verb} هذا القسط؟`)) return;
    try {
      await instituteApi.toggleInstallment(inst._id);
      toast.success("تم تحديث حالة السداد");
      load();
    } catch {
      toast.error("تعذر تحديث حالة السداد");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="الرسوم والأقساط"
        description="متابعة الرسوم السنوية لطلاب المقاعد المدفوعة على قسطين، وتحديث حالة السداد."
      />

      <StatGrid
        cols={3}
        stats={[
          { label: "طلاب المقاعد المدفوعة", value: stats.paidSeatStudents ?? 0, icon: Users, tone: "brand" },
          { label: "سدّدوا آخر قسط مستحق", value: stats.paidLatest ?? 0, icon: CheckCircle2, tone: "success" },
          { label: "لم يسددوا آخر قسط", value: stats.unpaidLatest ?? 0, icon: AlertTriangle, tone: "danger" },
        ]}
      />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-4 w-4 text-accent-600" /> جدول الرسوم والأقساط
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم الطالب</TableHead>
                <TableHead>إجمالي الرسوم السنوية</TableHead>
                <TableHead>القسط الأول (50%)</TableHead>
                <TableHead>القسط الثاني (50%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const inst1 = r.installments?.find((i) => i.seq === 1);
                const inst2 = r.installments?.find((i) => i.seq === 2);
                return (
                  <TableRow key={r.student._id}>
                    <TableCell className="font-medium text-text-primary">{r.student.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min={0}
                          value={totals[r.student._id] ?? 0}
                          onChange={(e) => setTotals((t) => ({ ...t, [r.student._id]: e.target.value }))}
                          className="h-8 w-24"
                          dir="ltr"
                        />
                        <button onClick={() => saveTotal(r.student._id)} className="rounded p-1.5 text-brand-600 hover:bg-brand-50" aria-label="حفظ">
                          <Save className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                    <InstallmentCell inst={inst1} onToggle={toggle} />
                    <InstallmentCell inst={inst2} onToggle={toggle} />
                  </TableRow>
                );
              })}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-text-secondary">
                    لا يوجد طلاب مقاعد مدفوعة.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Fees;
