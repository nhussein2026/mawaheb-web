import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PlaneTakeoff, Scale, Save, LogOut, LogIn, ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/DataTable";
import StatGrid from "../../components/institute/StatGrid";
import Modal from "../../components/institute/Modal";
import { selectCls, labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import {
  LEAVE_STATUS_OPTIONS,
  leaveStatusLabel,
  levelLabel,
} from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleString("ar") : "—");

const Leave = () => {
  const year = useSelector((s) => s.academicYear.selectedYearId);
  const [stats, setStats] = useState({});
  const [rows, setRows] = useState([]);
  const [active, setActive] = useState(null); // request being processed
  const [decision, setDecision] = useState({ status: "approved", supervisorNotes: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [st, list] = await Promise.all([
        instituteApi.getLeaveStats(year),
        instituteApi.listLeave({}, year),
      ]);
      setStats(st.data?.data || {});
      setRows(list.data?.data || []);
    } catch {
      toast.error("تعذر تحميل طلبات الاستئذان");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  const openProcess = (r) => {
    setActive(r);
    setDecision({ status: r.status === "pending" ? "approved" : r.status, supervisorNotes: r.supervisorNotes || "" });
  };

  const saveDecision = async () => {
    setSaving(true);
    try {
      await instituteApi.processLeave(active._id, decision);
      toast.success("تم حفظ قرار الاعتماد");
      setActive(null);
      load();
    } catch {
      toast.error("تعذر حفظ القرار");
    } finally {
      setSaving(false);
    }
  };

  const gate = async (r, action) => {
    try {
      await instituteApi.updateLeaveGate(r._id, { action });
      toast.success(action === "check_out" ? "تم تسجيل الخروج" : "تم تسجيل العودة");
      load();
    } catch {
      toast.error("تعذر تحديث حالة البوابة");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="طلبات الاستئذان والمغادرة"
        description="مراجعة طلبات مغادرة الطلاب واعتمادها أو رفضها، ومتابعة الخروج والعودة."
      />

      <StatGrid
        stats={[
          { label: "إجمالي الطلبات", value: stats.total ?? 0, icon: ClipboardList, tone: "brand" },
          { label: "قيد الانتظار", value: stats.pending ?? 0, icon: Clock, tone: "accent" },
          { label: "المقبولة", value: stats.approved ?? 0, icon: CheckCircle2, tone: "success" },
          { label: "خرج ولم يعد بعد", value: stats.leftNotReturned ?? 0, icon: PlaneTakeoff, tone: "danger" },
        ]}
      />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">قائمة طلبات الاستئذان</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الطالب</TableHead>
                <TableHead>الدفعة / المستوى</TableHead>
                <TableHead>تاريخ التقديم</TableHead>
                <TableHead>المغادرة → العودة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="font-medium text-text-primary">{r.student?.name}</TableCell>
                  <TableCell className="text-sm">
                    {r.studentProfile?.batch || "—"} / {levelLabel(r.studentProfile?.level)}
                  </TableCell>
                  <TableCell className="text-sm">{dt(r.createdAt)}</TableCell>
                  <TableCell className="text-sm" dir="ltr">
                    🛫 {dt(r.departureAt)}<br />🛬 {dt(r.returnAt)}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">{leaveStatusLabel(r.status)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <button onClick={() => openProcess(r)} className="inline-flex items-center gap-1 rounded bg-brand-50 px-2 py-1 text-xs text-brand-700 hover:bg-brand-100">
                        <Scale className="h-3.5 w-3.5" /> معالجة
                      </button>
                      {r.status === "approved" && !r.checkedOutAt && (
                        <button onClick={() => gate(r, "check_out")} className="inline-flex items-center gap-1 rounded bg-accent-50 px-2 py-1 text-xs text-accent-700 hover:bg-accent-100">
                          <LogOut className="h-3.5 w-3.5" /> خروج
                        </button>
                      )}
                      {r.checkedOutAt && !r.returnedAt && (
                        <button onClick={() => gate(r, "check_in")} className="inline-flex items-center gap-1 rounded bg-success-bg px-2 py-1 text-xs text-success-text hover:opacity-80">
                          <LogIn className="h-3.5 w-3.5" /> عودة
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-text-secondary">لا توجد طلبات.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {active && (
        <Modal title={`⚖️ معالجة طلب: ${active.student?.name || ""}`} onClose={() => setActive(null)}>
          <div className="space-y-4">
            <div className="rounded-lg bg-neutral-50 p-3 text-sm text-text-secondary">
              <p dir="ltr">🛫 المغادرة: {dt(active.departureAt)}</p>
              <p dir="ltr">🛬 العودة: {dt(active.returnAt)}</p>
              <p className="mt-2">📝 السبب: {active.reason}</p>
            </div>
            <div>
              <label className={labelCls}>قرار المشرف *</label>
              <select className={selectCls} value={decision.status} onChange={(e) => setDecision((d) => ({ ...d, status: e.target.value }))}>
                {LEAVE_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>ملاحظات المشرف (تظهر للطالب)</label>
              <textarea className={textareaCls} rows={3} value={decision.supervisorNotes} onChange={(e) => setDecision((d) => ({ ...d, supervisorNotes: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveDecision} disabled={saving}>
                <Save className="h-4 w-4" /> حفظ قرار الاعتماد
              </Button>
              <Button variant="outline" onClick={() => setActive(null)}>إلغاء</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Leave;
