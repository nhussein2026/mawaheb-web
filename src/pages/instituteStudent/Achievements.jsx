import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Trophy, Send } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { selectCls, labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import { achievementReviewLabel } from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleDateString("ar") : "—");
const CATEGORIES = ["مشروع", "جائزة", "شهادة", "ابتكار", "ورقة بحثية", "نشاط تطوعي", "أخرى"];
const emptyForm = { title: "", description: "", category: "مشروع" };

const Achievements = () => {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () =>
    instituteApi
      .getMyAchievements()
      .then((res) => setRows(res.data?.data || []))
      .catch(() => toast.error("تعذر تحميل الإنجازات"));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.warn("عنوان الإنجاز مطلوب");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("file", file);
      await instituteApi.submitAchievement(fd);
      toast.success("تم رفع إنجازك، بانتظار التحكيم");
      setForm(emptyForm);
      setFile(null);
      load();
    } catch {
      toast.error("تعذر رفع الإنجاز");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="إنجازاتي" description="سجّل إنجازاتك مع ملف داعم وتابع حالة التحكيم والتغذية الراجعة." />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4 text-accent-600" /> تسجيل إنجاز جديد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls}>عنوان الإنجاز *</label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>التصنيف</label>
                <select
                  className={selectCls}
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>الملف الداعم (PDF / JPG / PNG)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="text-sm text-text-secondary"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>الوصف</label>
                <textarea
                  className={textareaCls}
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              <Send className="h-4 w-4" /> رفع الإنجاز
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">سجل إنجازاتي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.map((a) => (
            <div key={a._id} className="rounded-lg border-[0.5px] border-border-subtle p-3">
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium text-text-primary">🏆 {a.title}</p>
                <span className="shrink-0 text-xs">{achievementReviewLabel(a.reviewStatus)}</span>
              </div>
              {a.description && <p className="mt-1 text-sm text-text-secondary">{a.description}</p>}
              <p className="mt-1 text-xs text-text-muted">
                {dt(a.createdAt)}
                {(a.fileUrl || a.achievement_image) && (
                  <>
                    {" · "}
                    <a href={a.fileUrl || a.achievement_image} target="_blank" rel="noreferrer" className="text-brand-600 underline">
                      الملف المرفق
                    </a>
                  </>
                )}
              </p>
              {a.feedback && <p className="mt-1 text-xs text-brand-700">التغذية الراجعة: {a.feedback}</p>}
            </div>
          ))}
          {!rows.length && <p className="py-8 text-center text-text-secondary">لم تسجّل أي إنجازات بعد.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;
