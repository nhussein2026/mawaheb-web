import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ScrollText, Save, ThumbsUp, ThumbsDown, ListChecks, Trash2 } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import StatGrid from "../../components/institute/StatGrid";
import { selectCls, labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import { BEHAVIOR_TYPE_OPTIONS, behaviorTypeLabel } from "../../constants/institute";

const emptyForm = { student: "", type: "positive", title: "", description: "" };

const Behavior = () => {
  const year = useSelector((s) => s.academicYear.selectedYearId);
  const [stats, setStats] = useState({ total: 0, positive: 0, negative: 0 });
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // browse
  const [browseBatch, setBrowseBatch] = useState("");
  const [browseStudent, setBrowseStudent] = useState("");
  const [entries, setEntries] = useState([]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const loadStats = async () => {
    try {
      const res = await instituteApi.getBehaviorStats(year);
      setStats(res.data?.data || {});
    } catch {
      /* non-blocking */
    }
  };
  const loadLookups = async () => {
    try {
      const [b, s] = await Promise.all([
        instituteApi.listBatches(),
        instituteApi.listStudents(),
      ]);
      setBatches(b.data?.data || []);
      setStudents(s.data?.data || []);
    } catch {
      /* non-blocking */
    }
  };
  const loadEntries = async () => {
    try {
      const params = {};
      if (browseStudent) params.student = browseStudent;
      else if (browseBatch) params.batch = browseBatch;
      const res = await instituteApi.listBehavior(params, year);
      setEntries(res.data?.data || []);
    } catch {
      toast.error("تعذر تحميل السجلات");
    }
  };

  useEffect(() => {
    loadStats();
    loadLookups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);
  useEffect(() => {
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browseBatch, browseStudent, year]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.student || !form.title || !form.description) {
      toast.warn("الطالب والعنوان والوصف مطلوبة");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("attachment", file);
      await instituteApi.createBehavior(fd);
      toast.success("تمت إضافة السجل السلوكي");
      setForm(emptyForm);
      setFile(null);
      loadStats();
      loadEntries();
    } catch {
      toast.error("تعذر إضافة السجل");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("حذف هذا السجل؟")) return;
    try {
      await instituteApi.deleteBehavior(id);
      toast.success("تم الحذف");
      loadStats();
      loadEntries();
    } catch {
      toast.error("تعذر الحذف");
    }
  };

  const browseStudents = browseBatch
    ? students.filter((s) => s.batch === browseBatch)
    : students;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="السجل السلوكي للطلاب"
        description="تسجيل الملاحظات السلوكية الإيجابية والسلبية لكل طالب واستعراض سجله."
      />

      <StatGrid
        cols={3}
        stats={[
          { label: "إجمالي السجلات السلوكية", value: stats.total ?? 0, icon: ListChecks, tone: "brand" },
          { label: "السجلات الإيجابية (+)", value: stats.positive ?? 0, icon: ThumbsUp, tone: "success" },
          { label: "السجلات السلبية (-)", value: stats.negative ?? 0, icon: ThumbsDown, tone: "danger" },
        ]}
      />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ScrollText className="h-4 w-4 text-accent-600" /> ➕ إضافة سجل سلوكي جديد لطالب
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>اختر الطالب *</label>
                <select className={selectCls} value={form.student} onChange={set("student")}>
                  <option value="">-- اختر طالباً --</option>
                  {students.map((s) => (
                    <option key={s.user?._id} value={s.user?._id}>
                      {s.user?.name} {s.academicNumber ? `(${s.academicNumber})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>نوع السجل *</label>
                <select className={selectCls} value={form.type} onChange={set("type")}>
                  {BEHAVIOR_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>عنوان السجل *</label>
                <Input value={form.title} onChange={set("title")} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>الوصف *</label>
                <textarea className={textareaCls} rows={3} value={form.description} onChange={set("description")} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>إرفاق ملف (PDF / JPG / PNG)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="text-sm text-text-secondary"
                />
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4" /> إضافة السجل السلوكي
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">استعراض السجل السلوكي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>اختر رقم الدفعة</label>
              <select
                className={selectCls}
                value={browseBatch}
                onChange={(e) => {
                  setBrowseBatch(e.target.value);
                  setBrowseStudent("");
                }}
              >
                <option value="">كل الدفعات</option>
                {batches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>اختر اسم الطالب</label>
              <select className={selectCls} value={browseStudent} onChange={(e) => setBrowseStudent(e.target.value)}>
                <option value="">كل الطلاب</option>
                {browseStudents.map((s) => (
                  <option key={s.user?._id} value={s.user?._id}>{s.user?.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {entries.map((en) => (
              <div key={en._id} className="flex items-start justify-between rounded-lg border-[0.5px] border-border-subtle p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        en.type === "positive" ? "bg-success-bg text-success-text" : "bg-error-bg text-error-text"
                      }`}
                    >
                      {behaviorTypeLabel(en.type)}
                    </span>
                    <span className="font-medium text-text-primary">{en.title}</span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">{en.description}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {en.student?.name} · {new Date(en.createdAt).toLocaleString("ar")}
                    {en.attachmentUrl && (
                      <>
                        {" · "}
                        <a href={en.attachmentUrl} target="_blank" rel="noreferrer" className="text-brand-600 underline">
                          الملف المرفق
                        </a>
                      </>
                    )}
                  </p>
                </div>
                <button onClick={() => remove(en._id)} className="rounded p-1.5 text-error-text hover:bg-error-bg" aria-label="حذف">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {!entries.length && (
              <p className="py-8 text-center text-text-secondary">لا توجد سجلات مطابقة.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Behavior;
