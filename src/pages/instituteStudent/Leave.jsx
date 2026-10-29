import React, { useState } from "react";
import { toast } from "react-toastify";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Field, Input, Textarea, RequiredNote } from "../../components/ui/Input";
import { Callout } from "../../components/ui/Feedback";
import { StatusBadge } from "../../components/ui/Badge";
import { HistoryCard, HistoryItem } from "../../components/ui/HistoryCard";
import { useResource } from "../../hooks/useResource";
import instituteApi from "../../services/api/instituteApi";
import { leaveStatusLabel, LEAVE_STATUS_TONE } from "../../constants/institute";
import { formatDateTime } from "../../utils/format";

const emptyForm = { departureAt: "", returnAt: "", reason: "" };

const validate = (f) => {
  const e = {};
  if (!f.departureAt) e.departureAt = "يُرجى إدخال تاريخ ووقت المغادرة";
  if (!f.returnAt) e.returnAt = "يُرجى إدخال تاريخ ووقت العودة";
  else if (f.departureAt && new Date(f.returnAt) <= new Date(f.departureAt))
    e.returnAt = "يجب أن يكون موعد العودة بعد موعد المغادرة";
  if (!f.reason.trim()) e.reason = "يُرجى كتابة سبب الاستئذان والوجهة";
  return e;
};

const Leave = () => {
  const { data: rows, status, reload } = useResource(() => instituteApi.getMyLeave(), [], { initial: [] });
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => {
    const next = { ...form, [k]: e.target.value };
    setForm(next);
    if (errors[k]) setErrors(validate(next));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setFormError("");
    const first = ["departureAt", "returnAt", "reason"].find((k) => found[k]);
    if (first) {
      document.getElementById(`leave-${first}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      await instituteApi.submitLeave(form);
      toast.success("تم إرسال طلب الاستئذان");
      setForm(emptyForm);
      reload();
    } catch {
      setFormError("تعذّر إرسال الطلب ولم يُحفظ. يُرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="طلبات الاستئذان" description="قدّم طلب استئذان وتابع قرار المشرف." />

      <Card>
        <CardHeader>
          <CardTitle>طلب استئذان</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} noValidate className="max-w-[720px] space-y-4">
            {formError ? <Callout tone="danger">{formError}</Callout> : null}
            <RequiredNote />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="موعد المغادرة" required error={errors.departureAt} id="leave-departureAt">
                <Input type="datetime-local" value={form.departureAt} onChange={set("departureAt")} dir="ltr" />
              </Field>
              <Field label="موعد العودة" required error={errors.returnAt} id="leave-returnAt">
                <Input type="datetime-local" value={form.returnAt} onChange={set("returnAt")} dir="ltr" />
              </Field>
            </div>
            <Field label="سبب الاستئذان والوجهة" required error={errors.reason} id="leave-reason">
              <Textarea value={form.reason} onChange={set("reason")} dir="auto" />
            </Field>
            <div className="flex justify-end">
              <Button type="submit" loading={saving}>
                إرسال الطلب
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <HistoryCard title="طلباتي" status={status} onRetry={reload} count={rows.length} empty="لم تقدّم أي طلب بعد" failed="تعذّر تحميل الطلبات">
        {rows.map((r) => (
          <HistoryItem
            key={r._id}
            title={
              <span className="num">
                {formatDateTime(r.departureAt)} إلى {formatDateTime(r.returnAt)}
              </span>
            }
            status={<StatusBadge tone={LEAVE_STATUS_TONE[r.status]}>{leaveStatusLabel(r.status)}</StatusBadge>}
            reply={r.supervisorNotes}
            replyLabel="ملاحظات المشرف"
          >
            {r.reason}
          </HistoryItem>
        ))}
      </HistoryCard>
    </div>
  );
};

export default Leave;
