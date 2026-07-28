import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Lightbulb, Send } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import { ideaStatusLabel } from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleDateString("ar") : "—");
const emptyForm = { subject: "", description: "" };

const Ideas = () => {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () =>
    instituteApi
      .getMyIdeas()
      .then((res) => setRows(res.data?.data || []))
      .catch(() => toast.error("تعذر تحميل الأفكار"));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim()) {
      toast.warn("موضوع الفكرة مطلوب");
      return;
    }
    setSaving(true);
    try {
      await instituteApi.submitIdea(form);
      toast.success("تم إيداع فكرتك في البنك");
      setForm(emptyForm);
      load();
    } catch {
      toast.error("تعذر إرسال الفكرة");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="بنك الأفكار" description="اقترح أفكاراً إبداعية وتابع حالتها والنقاط الممنوحة." />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-4 w-4 text-accent-600" /> إيداع فكرة جديدة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className={labelCls}>موضوع الفكرة *</label>
              <Input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>وصف الفكرة</label>
              <textarea
                className={textareaCls}
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <Button type="submit" disabled={saving}>
              <Send className="h-4 w-4" /> إيداع الفكرة
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">أفكاري</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.map((i) => (
            <div key={i._id} className="rounded-lg border-[0.5px] border-border-subtle p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-text-primary">💡 {i.subject}</p>
                <span className="shrink-0 text-xs">{ideaStatusLabel(i.status)}</span>
              </div>
              {i.description && <p className="mt-1 text-sm text-text-secondary">{i.description}</p>}
              <p className="mt-1 text-xs text-text-muted">
                {dt(i.createdAt)}
                {i.status === "approved" && ` · النقاط الممنوحة: ${i.rewardPoints || 0}`}
              </p>
              {i.notes && <p className="mt-1 text-xs text-brand-700">ملاحظات التحكيم: {i.notes}</p>}
            </div>
          ))}
          {!rows.length && <p className="py-8 text-center text-text-secondary">لم تقدّم أي أفكار بعد.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Ideas;
