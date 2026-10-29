import React, { useState } from "react";
import { toast } from "react-toastify";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Field, Input, Select, Textarea, RequiredNote } from "../../components/ui/Input";
import { Callout } from "../../components/ui/Feedback";
import { StatusBadge } from "../../components/ui/Badge";
import { HistoryCard, HistoryItem } from "../../components/ui/HistoryCard";
import { useResource } from "../../hooks/useResource";
import instituteApi from "../../services/api/instituteApi";
import { achievementReviewLabel, ACHIEVEMENT_REVIEW_TONE } from "../../constants/institute";
import { formatDate } from "../../utils/format";

const CATEGORIES = ["مشروع", "جائزة", "شهادة", "ابتكار", "ورقة بحثية", "نشاط تطوعي", "أخرى"];
const emptyForm = { title: "", description: "", category: "مشروع" };
const MAX_FILE = 10 * 1024 * 1024;

const Achievements = () => {
  const { data: rows, status, reload } = useResource(() => instituteApi.getMyAchievements(), [], { initial: [] });
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    if (!form.title.trim()) found.title = "يُرجى إدخال عنوان الإنجاز";
    if (file && file.size > MAX_FILE) found.file = "حجم الملف أكبر من 10 ميغابايت. يُرجى اختيار ملف أصغر.";
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) {
      document.getElementById(found.title ? "ach-title" : "ach-file")?.focus();
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("file", file);
      await instituteApi.submitAchievement(fd);
      toast.success("تم إرسال الإنجاز للتحكيم");
      setForm(emptyForm);
      setFile(null);
      setFileKey((k) => k + 1);
      reload();
    } catch {
      setFormError("تعذّر إرسال الإنجاز ولم يُحفظ. يُرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="إنجازاتي" description="سجّل إنجازاتك مع ملف داعم وتابع حالة التحكيم والتغذية الراجعة." />

      <Card>
        <CardHeader>
          <CardTitle>تسجيل إنجاز</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} noValidate className="max-w-[720px] space-y-4">
            {formError ? <Callout tone="danger">{formError}</Callout> : null}
            <RequiredNote />
            <Field label="عنوان الإنجاز" required error={errors.title} id="ach-title">
              <Input
                value={form.title}
                onChange={(e) => {
                  setForm((f) => ({ ...f, title: e.target.value }));
                  if (errors.title && e.target.value.trim()) setErrors((er) => ({ ...er, title: "" }));
                }}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="التصنيف" id="ach-category">
                <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="الملف الداعم" hint="PDF أو JPG أو PNG، حتى 10 ميغابايت" error={errors.file} id="ach-file">
                <Input key={fileKey} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </Field>
            </div>
            <Field label="الوصف" id="ach-desc">
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} dir="auto" />
            </Field>
            <div className="flex justify-end">
              <Button type="submit" loading={saving}>
                إرسال للتحكيم
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <HistoryCard
        title="سجل إنجازاتي"
        status={status}
        onRetry={reload}
        count={rows.length}
        empty="لم تسجّل أي إنجاز بعد"
        failed="تعذّر تحميل الإنجازات"
      >
        {rows.map((a) => (
          <HistoryItem
            key={a._id}
            title={a.title}
            status={<StatusBadge tone={ACHIEVEMENT_REVIEW_TONE[a.reviewStatus]}>{achievementReviewLabel(a.reviewStatus)}</StatusBadge>}
            meta={
              <>
                <span className="num">{formatDate(a.createdAt)}</span>
                {a.fileUrl || a.achievement_image ? (
                  <>
                    {" · "}
                    <a
                      href={a.fileUrl || a.achievement_image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-brand-strong underline underline-offset-4"
                    >
                      الملف المرفق
                    </a>
                  </>
                ) : null}
              </>
            }
            reply={a.feedback}
            replyLabel="التغذية الراجعة"
          >
            {a.description}
          </HistoryItem>
        ))}
      </HistoryCard>
    </div>
  );
};

export default Achievements;
