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
import { ideaStatusLabel, IDEA_STATUS_TONE } from "../../constants/institute";
import { formatDate, formatNumber } from "../../utils/format";

const emptyForm = { subject: "", description: "" };

const Ideas = () => {
  const { data: rows, status, reload } = useResource(() => instituteApi.getMyIdeas(), [], { initial: [] });
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.subject.trim()) {
      setError("يُرجى إدخال موضوع الفكرة");
      document.getElementById("idea-subject")?.focus();
      return;
    }
    setSaving(true);
    try {
      await instituteApi.submitIdea(form);
      toast.success("تم إيداع فكرتك في البنك");
      setForm(emptyForm);
      reload();
    } catch {
      setFormError("تعذّر إيداع الفكرة ولم تُحفظ. يُرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="بنك الأفكار" description="اقترح أفكارًا إبداعية وتابع حالتها والنقاط الممنوحة." />

      <Card>
        <CardHeader>
          <CardTitle>إيداع فكرة</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} noValidate className="max-w-[720px] space-y-4">
            {formError ? <Callout tone="danger">{formError}</Callout> : null}
            <RequiredNote />
            <Field label="موضوع الفكرة" required error={error} id="idea-subject">
              <Input
                value={form.subject}
                onChange={(e) => {
                  setForm((f) => ({ ...f, subject: e.target.value }));
                  if (error && e.target.value.trim()) setError("");
                }}
                dir="auto"
              />
            </Field>
            <Field label="وصف الفكرة" id="idea-desc">
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} dir="auto" />
            </Field>
            <div className="flex justify-end">
              <Button type="submit" loading={saving}>
                إيداع الفكرة
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <HistoryCard title="أفكاري" status={status} onRetry={reload} count={rows.length} empty="لم تقدّم أي فكرة بعد" failed="تعذّر تحميل الأفكار">
        {rows.map((i) => (
          <HistoryItem
            key={i._id}
            title={i.subject}
            status={<StatusBadge tone={IDEA_STATUS_TONE[i.status]}>{ideaStatusLabel(i.status)}</StatusBadge>}
            meta={
              <>
                <span className="num">{formatDate(i.createdAt)}</span>
                {i.status === "approved" ? (
                  <>
                    {" · "}النقاط الممنوحة <span className="num font-semibold">{formatNumber(i.rewardPoints || 0)}</span>
                  </>
                ) : null}
              </>
            }
            reply={i.notes}
            replyLabel="ملاحظات التحكيم"
          >
            {i.description}
          </HistoryItem>
        ))}
      </HistoryCard>
    </div>
  );
};

export default Ideas;
