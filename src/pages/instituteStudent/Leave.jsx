import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PlaneTakeoff, Send } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import { leaveStatusLabel } from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleString("ar") : "—");
const emptyForm = { departureAt: "", returnAt: "", reason: "" };

const Leave = () => {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () =>
    instituteApi
      .getMyLeave()
      .then((res) => setRows(res.data?.data || []))
      .catch(() => toast.error("تعذر تحميل الطلبات"));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.departureAt || !form.returnAt || !form.reason.trim()) {
      toast.warn("تاريخ المغادرة والعودة والسبب مطلوبة");
      return;
    }
    setSaving(true);
    try {
      await instituteApi.submitLeave(form);
      toast.success("تم إرسال طلب الاستئذان");
      setForm(emptyForm);
      load();
    } catch {
      toast.error("تعذر إرسال الطلب");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="طلبات الاستئذان" description="قدّم طلب استئذان ومغادرة وتابع قرار المشرف." />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PlaneTakeoff className="h-4 w-4 text-accent-600" /> طلب استئذان جديد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>🛫 تاريخ ووقت المغادرة *</label>
                <Input
                  type="datetime-local"
                  value={form.departureAt}
                  onChange={(e) => setForm((f) => ({ ...f, departureAt: e.target.value }))}
                  dir="ltr"
                />
              </div>
              <div>
                <label className={labelCls}>🛬 تاريخ ووقت العودة *</label>
                <Input
                  type="datetime-local"
                  value={form.returnAt}
                  onChange={(e) => setForm((f) => ({ ...f, returnAt: e.target.value }))}
                  dir="ltr"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>سبب الاستئذان والوجهة *</label>
                <textarea
                  className={textareaCls}
                  rows={3}
                  value={form.reason}
                  onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                />
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              <Send className="h-4 w-4" /> إرسال الطلب
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">طلباتي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.map((r) => (
            <div key={r._id} className="rounded-lg border-[0.5px] border-border-subtle p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-text-primary">
                  🛫 {dt(r.departureAt)} → 🛬 {dt(r.returnAt)}
                </p>
                <span className="shrink-0 text-xs">{leaveStatusLabel(r.status)}</span>
              </div>
              <p className="mt-1 text-sm text-text-secondary">{r.reason}</p>
              {r.supervisorNotes && (
                <p className="mt-1 text-xs text-brand-700">ملاحظات المشرف: {r.supervisorNotes}</p>
              )}
            </div>
          ))}
          {!rows.length && <p className="py-8 text-center text-text-secondary">لا توجد طلبات.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leave;
