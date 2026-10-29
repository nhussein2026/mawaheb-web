import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { LogOut, LogIn } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Field, Select, Textarea } from "../../components/ui/Input";
import { StatusBadge } from "../../components/ui/Badge";
import { PersonCell } from "../../components/ui/PersonCell";
import { EmptyState, SkeletonRows } from "../../components/ui/Feedback";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableStateRow } from "../../components/ui/DataTable";
import StatGrid from "../../components/institute/StatGrid";
import Modal from "../../components/institute/Modal";
import instituteApi from "../../services/api/instituteApi";
import {
  LEAVE_STATUS_OPTIONS,
  LEAVE_STATUS_TONE,
  leaveStatusLabel,
  levelLabel,
} from "../../constants/institute";
import { formatDateTime } from "../../utils/format";

import { useLoadEffect } from "../../hooks/useLoadEffect";
const dt = (d) => formatDateTime(d);

const Leave = () => {
  const year = useSelector((s) => s.academicYear.selectedYearId);
  const [stats, setStats] = useState({});
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading");
  const [active, setActive] = useState(null);
  const [decision, setDecision] = useState({ status: "approved", supervisorNotes: "" });
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      const [st, list] = await Promise.all([instituteApi.getLeaveStats(year), instituteApi.listLeave({}, year)]);
      setStats(st.data?.data || {});
      setRows(list.data?.data || []);
      setStatus("ready");
    } catch {
      setStatus("failed");
    }
  }, [year]);

  useLoadEffect(load);

  const openProcess = (r) => {
    setActive(r);
    setDecision({ status: r.status === "pending" ? "approved" : r.status, supervisorNotes: r.supervisorNotes || "" });
  };

  const saveDecision = async () => {
    setSaving(true);
    try {
      await instituteApi.processLeave(active._id, decision);
      toast.success("تم حفظ القرار");
      setActive(null);
      load();
    } catch {
      toast.error("تعذّر حفظ القرار. يُرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const gate = async (r, action) => {
    setBusyId(r._id);
    try {
      await instituteApi.updateLeaveGate(r._id, { action });
      toast.success(action === "check_out" ? "تم تسجيل خروج الطالب" : "تم تسجيل عودة الطالب");
      load();
    } catch {
      toast.error("تعذّر تحديث حالة البوابة. يُرجى المحاولة مرة أخرى.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="طلبات الاستئذان"
        description="مراجعة طلبات مغادرة الطلاب واعتمادها، ومتابعة الخروج والعودة."
      />

      <StatGrid
        stats={[
          { label: "إجمالي الطلبات", value: stats.total ?? 0 },
          { label: "بانتظار القرار", value: stats.pending ?? 0 },
          { label: "الطلبات المعتمدة", value: stats.approved ?? 0 },
          { label: "خرجوا ولم يعودوا بعد", value: stats.leftNotReturned ?? 0 },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>الطلبات</CardTitle>
        </CardHeader>
        <Table caption="طلبات الاستئذان">
          <TableHeader>
            <TableRow>
              <TableHead>الطالب</TableHead>
              <TableHead>تاريخ التقديم</TableHead>
              <TableHead>المغادرة</TableHead>
              <TableHead>العودة</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>
                <span className="sr-only">إجراءات</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {status === "loading" ? (
              <TableStateRow colSpan={6}>
                <SkeletonRows rows={5} />
              </TableStateRow>
            ) : status === "failed" ? (
              <TableStateRow colSpan={6}>
                <EmptyState kind="failed" compact title="تعذّر تحميل طلبات الاستئذان" onRetry={load} />
              </TableStateRow>
            ) : rows.length === 0 ? (
              <TableStateRow colSpan={6}>
                <EmptyState kind="all-done" compact title="لا توجد طلبات استئذان في هذا العام" />
              </TableStateRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="min-w-52">
                    <PersonCell
                      name={r.student?.name}
                      secondary={[r.studentProfile?.batch && `الدفعة ${r.studentProfile.batch}`, levelLabel(r.studentProfile?.level)]
                        .filter((x) => x && x !== "—")
                        .join(" · ")}
                    />
                  </TableCell>
                  <TableCell className="num whitespace-nowrap">{dt(r.createdAt)}</TableCell>
                  <TableCell className="num whitespace-nowrap">{dt(r.departureAt)}</TableCell>
                  <TableCell className="num whitespace-nowrap">{dt(r.returnAt)}</TableCell>
                  <TableCell>
                    <StatusBadge tone={LEAVE_STATUS_TONE[r.status]}>{leaveStatusLabel(r.status)}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap justify-end gap-1">
                      {r.status === "approved" && !r.checkedOutAt ? (
                        <Button variant="secondary" size="sm" loading={busyId === r._id} onClick={() => gate(r, "check_out")}>
                          <LogOut aria-hidden="true" /> تسجيل الخروج
                        </Button>
                      ) : null}
                      {r.checkedOutAt && !r.returnedAt ? (
                        <Button variant="secondary" size="sm" loading={busyId === r._id} onClick={() => gate(r, "check_in")}>
                          <LogIn aria-hidden="true" /> تسجيل العودة
                        </Button>
                      ) : null}
                      <Button variant="tertiary" size="sm" onClick={() => openProcess(r)}>
                        {r.status === "pending" ? "اتخاذ القرار" : "تعديل القرار"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {active ? (
        <Modal
          title={`طلب ${active.student?.name || ""}`}
          maxWidth="max-w-lg"
          onClose={() => setActive(null)}
          busy={saving}
          footer={
            <>
              <Button variant="secondary" onClick={() => setActive(null)} disabled={saving}>
                إلغاء
              </Button>
              <Button onClick={saveDecision} loading={saving}>
                حفظ القرار
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-md bg-subtle px-4 py-3 text-sm">
              <dt className="text-text-tertiary">المغادرة</dt>
              <dd className="num">{dt(active.departureAt)}</dd>
              <dt className="text-text-tertiary">العودة</dt>
              <dd className="num">{dt(active.returnAt)}</dd>
              <dt className="text-text-tertiary">السبب</dt>
              <dd dir="auto">{active.reason || "—"}</dd>
            </dl>
            <Field label="قرار المشرف" required>
              <Select value={decision.status} onChange={(e) => setDecision((d) => ({ ...d, status: e.target.value }))}>
                {LEAVE_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="ملاحظات المشرف" hint="تظهر للطالب مع القرار">
              <Textarea
                value={decision.supervisorNotes}
                onChange={(e) => setDecision((d) => ({ ...d, supervisorNotes: e.target.value }))}
              />
            </Field>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default Leave;
