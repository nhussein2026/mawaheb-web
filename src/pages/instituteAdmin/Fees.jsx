import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Wallet, Users, CheckCircle2, AlertTriangle, Save } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button, IconButton } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableStateRow } from "../../components/ui/DataTable";
import StatGrid from "../../components/institute/StatGrid";
import instituteApi from "../../services/api/instituteApi";

import { StatusBadge } from "../../components/ui/Badge";
import { useConfirm } from "../../components/ui/confirmContext";
import { EmptyState, Callout } from "../../components/ui/Feedback";
import { formatDate } from "../../utils/format";
import { useLoadEffect } from "../../hooks/useLoadEffect";
const fmt = (d) => formatDate(d);

const InstallmentCell = ({ inst, onToggle }) => {
  if (!inst) return <TableCell className="text-text-tertiary">—</TableCell>;
  return (
    <TableCell>
      <div className="flex flex-col items-start gap-1">
        <StatusBadge tone={inst.isPaid ? "success" : "warning"}>
          {inst.isPaid ? "مدفوع" : "غير مدفوع"} · <span className="num">{inst.amount}</span>
        </StatusBadge>
        <span className="num text-xs text-text-tertiary">الاستحقاق: {fmt(inst.dueDate)}</span>
        <Button variant={inst.isPaid ? "tertiary" : "secondary"} size="sm" onClick={() => onToggle(inst)}>
          {inst.isPaid ? "إلغاء إثبات السداد" : "إثبات السداد"}
        </Button>
      </div>
    </TableCell>
  );
};

const Fees = () => {
  const year = useSelector((s) => s.academicYear.selectedYearId);
  const confirm = useConfirm();
  const [loadError, setLoadError] = useState("");  const [stats, setStats] = useState({});
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState({}); // studentId -> editable total

  const load = useCallback(async () => {
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
      setLoadError("");
    } catch {
      setLoadError("تعذّر تحميل بيانات الرسوم");
    }
  }, [year]);

  useLoadEffect(load);

  const saveTotal = async (studentId) => {
    try {
      await instituteApi.setFeeTotal(studentId, { totalAnnual: totals[studentId] });
      toast.success("تم تحديث إجمالي الرسوم");
      load();
    } catch {
      toast.error("تعذّر تحديث الرسوم");
    }
  };

  const toggle = async (inst) => {
    const verb = inst.isPaid ? "إلغاء سداد" : "إثبات سداد";
    if (!(await confirm({ title: `${verb} القسط؟`, body: "يتغير وضع السداد لهذا القسط ويظهر ذلك للطالب ولولي الأمر.", confirmLabel: `${verb} القسط` }))) return;
    try {
      await instituteApi.toggleInstallment(inst._id);
      toast.success("تم تحديث حالة السداد");
      load();
    } catch {
      toast.error("تعذّر تحديث حالة السداد");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="الرسوم والأقساط"
        description="متابعة الرسوم السنوية لطلاب المقاعد المدفوعة على قسطين، وتحديث حالة السداد."
      />
      {loadError ? (
        <Callout tone="danger" title={loadError} action={<Button variant="secondary" size="sm" onClick={() => load()}>إعادة المحاولة</Button>}>
          يُرجى التحقق من الاتصال والمحاولة مرة أخرى.
        </Callout>
      ) : null}

      <StatGrid
        cols={3}
        stats={[
          { label: "طلاب المقاعد المدفوعة", value: stats.paidSeatStudents ?? 0, icon: Users, tone: "brand" },
          { label: "سدّدوا آخر قسط مستحق", value: stats.paidLatest ?? 0, icon: CheckCircle2, tone: "success" },
          { label: "لم يسددوا آخر قسط", value: stats.unpaidLatest ?? 0, icon: AlertTriangle, tone: "danger" },
        ]}
      />

      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="size-5 text-text-tertiary" aria-hidden="true" /> جدول الرسوم والأقساط
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0 sm:px-0 sm:pb-0">
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
                        <IconButton label="حفظ" size="sm" tone="brand" onClick={() => saveTotal(r.student._id)}><Save /></IconButton>
                      </div>
                    </TableCell>
                    <InstallmentCell inst={inst1} onToggle={toggle} />
                    <InstallmentCell inst={inst2} onToggle={toggle} />
                  </TableRow>
                );
              })}
              {!rows.length && (
                <TableStateRow colSpan={4}>
                  <EmptyState compact kind="first-use" title="لا يوجد طلاب مقاعد مدفوعة" />
                </TableStateRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Fees;
