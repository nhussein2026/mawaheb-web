import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MessagesSquare, Inbox, Reply, Send, PenSquare, Paperclip } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/DataTable";
import StatGrid from "../../components/institute/StatGrid";
import ThreadView from "../../components/institute/ThreadView";
import { selectCls, labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";

const dt = (d) => (d ? new Date(d).toLocaleString("ar") : "—");
const STATUS_OPTIONS = [
  { value: "open", label: "مفتوحة" },
  { value: "closed", label: "🔒 مغلقة" },
];

const Correspondence = () => {
  const [stats, setStats] = useState({});
  const [rows, setRows] = useState([]);
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [open, setOpen] = useState(null); // { thread, messages }
  const [composing, setComposing] = useState(false);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({ subject: "", body: "", batch: "", recipients: [] });
  const [files, setFiles] = useState([]);

  const loadList = async () => {
    try {
      const [st, list] = await Promise.all([
        instituteApi.getCorrespondenceStats(),
        instituteApi.listCorrespondence({}),
      ]);
      setStats(st.data?.data || {});
      setRows(list.data?.data || []);
    } catch {
      toast.error("تعذر تحميل الرسائل");
    }
  };
  const loadLookups = async () => {
    try {
      const [b, s] = await Promise.all([instituteApi.listBatches(), instituteApi.listStudents()]);
      setBatches(b.data?.data || []);
      setStudents(s.data?.data || []);
    } catch {
      /* non-blocking */
    }
  };

  useEffect(() => {
    loadList();
    loadLookups();
  }, []);

  const openThread = async (id) => {
    try {
      const res = await instituteApi.getCorrespondenceThread(id);
      setOpen(res.data?.data || null);
    } catch {
      toast.error("تعذر فتح الرسالة");
    }
  };

  const send = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.body) {
      toast.warn("الموضوع والنص مطلوبان");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("subject", form.subject);
      fd.append("body", form.body);
      fd.append("recipients", form.recipients.join(","));
      files.forEach((f) => fd.append("attachments", f));
      await instituteApi.createCorrespondence(fd);
      toast.success("تم إرسال الرسالة");
      setForm({ subject: "", body: "", batch: "", recipients: [] });
      setFiles([]);
      setComposing(false);
      loadList();
    } catch {
      toast.error("تعذر إرسال الرسالة");
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
      await instituteApi.replyCorrespondence(open.thread._id, fd);
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
      await instituteApi.setCorrespondenceStatus(open.thread._id, { status });
      await openThread(open.thread._id);
      loadList();
    } catch {
      toast.error("تعذر تحديث الحالة");
    } finally {
      setBusy(false);
    }
  };

  const recipientStudents = form.batch ? students.filter((s) => s.batch === form.batch) : students;

  if (open) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="المراسلات والتذاكر" />
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
        title="المراسلات والتذاكر"
        description="مراسلات ثنائية الاتجاه بين الإدارة والطلاب مع ردود متسلسلة ومرفقات."
        actions={
          <Button onClick={() => setComposing((v) => !v)}>
            <PenSquare className="h-4 w-4" /> اكتب رسالة جديدة
          </Button>
        }
      />

      <StatGrid
        cols={3}
        stats={[
          { label: "الرسائل الواردة", value: stats.inbox ?? 0, icon: Inbox, tone: "brand" },
          { label: "تنتظر ردك", value: stats.awaiting ?? 0, icon: Reply, tone: "accent" },
          { label: "الرسائل الصادرة", value: stats.sent ?? 0, icon: Send, tone: "neutral" },
        ]}
      />

      {composing && (
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessagesSquare className="h-4 w-4 text-accent-600" /> ✉️ اكتب رسالة جديدة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={send} className="space-y-4">
              <div>
                <label className={labelCls}>موضوع الرسالة *</label>
                <Input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>نص الرسالة *</label>
                <textarea className={textareaCls} rows={3} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>تصفية حسب الدفعة</label>
                  <select className={selectCls} value={form.batch} onChange={(e) => setForm((f) => ({ ...f, batch: e.target.value, recipients: [] }))}>
                    <option value="">كل الطلاب</option>
                    {batches.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>اختر المستلمين (Ctrl للتحديد المتعدد) *</label>
                  <select
                    multiple
                    className={`${selectCls} h-auto min-h-[6rem]`}
                    value={form.recipients}
                    onChange={(e) => setForm((f) => ({ ...f, recipients: Array.from(e.target.selectedOptions, (o) => o.value) }))}
                  >
                    {recipientStudents.map((s) => (
                      <option key={s.user?._id} value={s.user?._id}>{s.user?.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>المرفقات (JPG/PNG/PDF ≤ 5MB)</label>
                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFiles(Array.from(e.target.files || []))} className="text-sm text-text-secondary" />
              </div>
              <Button type="submit" disabled={busy}>
                <Send className="h-4 w-4" /> إرسال وتوجيه الرسالة فوراً
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">قائمة الرسائل والتذاكر الواردة</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>موضوع الرسالة</TableHead>
                <TableHead>آخر نشاط</TableHead>
                <TableHead>بواسطة</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t._id} className="cursor-pointer" onClick={() => openThread(t._id)}>
                  <TableCell className="font-medium text-brand-700">
                    📬 {t.subject}
                    {t.attachments?.length ? <Paperclip className="ms-1 inline h-3 w-3" /> : null}
                  </TableCell>
                  <TableCell className="text-sm">{dt(t.lastMessageAt)}</TableCell>
                  <TableCell className="text-sm">{t.author?.name}</TableCell>
                  <TableCell className="text-xs">{t.status === "closed" ? "🔒 مغلقة" : "مفتوحة"}</TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-text-secondary">لا توجد رسائل.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Correspondence;
