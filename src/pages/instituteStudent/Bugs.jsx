import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bug, Send, PenSquare, Paperclip } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import ThreadView from "../../components/institute/ThreadView";
import { labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import { threadStatusLabel } from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleString("ar") : "—");
const emptyForm = { subject: "", body: "", moduleTag: "" };

const Bugs = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(null);
  const [composing, setComposing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);

  const loadList = () =>
    instituteApi
      .getMyBugs()
      .then((res) => setRows(res.data?.data || []))
      .catch(() => toast.error("تعذر تحميل البلاغات"));

  useEffect(() => {
    loadList();
  }, []);

  const openThread = async (id) => {
    try {
      const res = await instituteApi.getMyThread(id);
      setOpen(res.data?.data || null);
    } catch {
      toast.error("تعذر فتح البلاغ");
    }
  };

  const send = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.body) {
      toast.warn("الموضوع والوصف مطلوبان");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      files.forEach((f) => fd.append("attachments", f));
      await instituteApi.createMyBug(fd);
      toast.success("تم تسجيل البلاغ");
      setForm(emptyForm);
      setFiles([]);
      setComposing(false);
      loadList();
    } catch {
      toast.error("تعذر تسجيل البلاغ");
    } finally {
      setBusy(false);
    }
  };

  const reply = async (body, replyFiles) => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("body", body);
      (replyFiles || []).forEach((f) => fd.append("attachments", f));
      await instituteApi.replyMyThread(open.thread._id, fd);
      await openThread(open.thread._id);
      loadList();
    } catch {
      toast.error("تعذر إرسال الرد");
    } finally {
      setBusy(false);
    }
  };

  if (open) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="المشكلات والأخطاء" />
        <ThreadView
          thread={open.thread}
          messages={open.messages}
          onReply={reply}
          onBack={() => setOpen(null)}
          busy={busy}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="المشكلات والأخطاء"
        description="أبلغ عن مشكلة أو خطأ في المنصة وتابع حالتها وردود الفريق."
        actions={
          <Button onClick={() => setComposing((v) => !v)}>
            <PenSquare className="h-4 w-4" /> بلاغ جديد
          </Button>
        }
      />

      {composing && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bug className="h-4 w-4 text-error-text" /> تسجيل بلاغ جديد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={send} className="space-y-4">
              <div>
                <label className={labelCls}>موضوع البلاغ *</label>
                <Input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>القسم / الوحدة (اختياري)</label>
                <Input value={form.moduleTag} onChange={(e) => setForm((f) => ({ ...f, moduleTag: e.target.value }))} placeholder="مثال: النتائج الدراسية" />
              </div>
              <div>
                <label className={labelCls}>وصف المشكلة *</label>
                <textarea className={textareaCls} rows={3} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>المرفقات (JPG/PNG/PDF ≤ 5MB)</label>
                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFiles(Array.from(e.target.files || []))} className="text-sm text-text-secondary" />
              </div>
              <Button type="submit" disabled={busy}>
                <Send className="h-4 w-4" /> إرسال البلاغ
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">بلاغاتي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.map((t) => (
            <button
              key={t._id}
              onClick={() => openThread(t._id)}
              className="flex w-full items-center justify-between gap-3 rounded-lg border-[0.5px] border-border-subtle p-3 text-start hover:bg-neutral-50"
            >
              <div className="min-w-0">
                <p className="font-medium text-brand-700">
                  🐞 {t.subject}
                  {t.moduleTag ? <span className="ms-1 text-xs text-text-muted">[{t.moduleTag}]</span> : null}
                  {t.attachments?.length ? <Paperclip className="ms-1 inline h-3 w-3" /> : null}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">آخر نشاط: {dt(t.lastMessageAt)}</p>
              </div>
              <span className="shrink-0 text-xs">{threadStatusLabel(t.status)}</span>
            </button>
          ))}
          {!rows.length && <p className="py-8 text-center text-text-secondary">لا توجد بلاغات.</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default Bugs;
