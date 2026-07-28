import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bug, ClipboardList, Clock, Loader, CheckCircle2, PenSquare, Send, Paperclip } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/DataTable";
import StatGrid from "../../components/institute/StatGrid";
import ThreadView from "../../components/institute/ThreadView";
import { labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import { threadStatusLabel } from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleString("ar") : "—");
const STATUS_OPTIONS = [
  { value: "pending", label: "⏳ بالانتظار" },
  { value: "in_progress", label: "⚙️ قيد المتابعة" },
  { value: "resolved", label: "✅ تم الحل" },
];

const Bugs = () => {
  const [stats, setStats] = useState({});
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(null);
  const [composing, setComposing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ subject: "", body: "", moduleTag: "" });
  const [files, setFiles] = useState([]);

  const loadList = async () => {
    try {
      const [st, list] = await Promise.all([
        instituteApi.getBugStats(),
        instituteApi.listBugs({}),
      ]);
      setStats(st.data?.data || {});
      setRows(list.data?.data || []);
    } catch {
      toast.error("تعذر تحميل البلاغات");
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const openThread = async (id) => {
    try {
      const res = await instituteApi.getBugThread(id);
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
      await instituteApi.createBug(fd);
      toast.success("تم تسجيل البلاغ");
      setForm({ subject: "", body: "", moduleTag: "" });
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
      await instituteApi.replyBug(open.thread._id, fd);
      await openThread(open.thread._id);
      loadList();
    } catch {
      toast.error("تعذر إرسال الرد");
    } finally {
      setBusy(false);
    }
  };

  const setStatus = async (status) => {
    setBusy(true);
    try {
      await instituteApi.setBugStatus(open.thread._id, { status });
      await openThread(open.thread._id);
      loadList();
    } catch {
      toast.error("تعذر تحديث الحالة");
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
          statusOptions={STATUS_OPTIONS}
          onReply={reply}
          onSetStatus={setStatus}
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
        description="بلاغات المشكلات والأخطاء المتعلقة بالمنصة مع ردود متسلسلة وتتبع الحالة."
        actions={
          <Button onClick={() => setComposing((v) => !v)}>
            <PenSquare className="h-4 w-4" /> بلاغ جديد
          </Button>
        }
      />

      <StatGrid
        stats={[
          { label: "إجمالي البلاغات", value: stats.total ?? 0, icon: ClipboardList, tone: "brand" },
          { label: "بالانتظار", value: stats.pending ?? 0, icon: Clock, tone: "accent" },
          { label: "قيد المتابعة", value: stats.inProgress ?? 0, icon: Loader, tone: "neutral" },
          { label: "تم حلها", value: stats.resolved ?? 0, icon: CheckCircle2, tone: "success" },
        ]}
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
                <Input value={form.moduleTag} onChange={(e) => setForm((f) => ({ ...f, moduleTag: e.target.value }))} placeholder="مثال: السجل السلوكي" />
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
          <CardTitle className="text-base">قائمة البلاغات الواردة</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>موضوع البلاغ</TableHead>
                <TableHead>بواسطة</TableHead>
                <TableHead>آخر نشاط</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t._id} className="cursor-pointer" onClick={() => openThread(t._id)}>
                  <TableCell className="font-medium text-brand-700">
                    {t.subject}
                    {t.moduleTag ? <span className="ms-1 text-xs text-text-muted">[{t.moduleTag}]</span> : null}
                    {t.attachments?.length ? <Paperclip className="ms-1 inline h-3 w-3" /> : null}
                  </TableCell>
                  <TableCell className="text-sm">{t.author?.name}</TableCell>
                  <TableCell className="text-sm">{dt(t.lastMessageAt)}</TableCell>
                  <TableCell className="text-xs">{threadStatusLabel(t.status)}</TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-text-secondary">لا توجد بلاغات.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bugs;
