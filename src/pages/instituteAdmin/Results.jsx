import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ClipboardList, Rocket, Trash2, Eye, ImageIcon } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { selectCls, labelCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import {
  RESULT_TERM_LABELS,
  RESULT_EXAM_TYPE_LABELS,
  RESULT_CLASSIFICATION_LABELS,
  resultTermLabel,
  resultExamTypeLabel,
} from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleString("ar") : "—");
const opts = (map) => Object.entries(map).map(([value, label]) => ({ value, label }));

const Results = () => {
  const year = useSelector((s) => s.academicYear.selectedYearId);
  const years = useSelector((s) => s.academicYear.years);
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState({ student: "", term: "term_1", examType: "monthly_1", academicYear: "" });
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const [fClass, setFClass] = useState("");
  const [fBatch, setFBatch] = useState("");
  const [fStudent, setFStudent] = useState("");
  const [rows, setRows] = useState([]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const loadLookups = async () => {
    try {
      const [b, s] = await Promise.all([instituteApi.listBatches(), instituteApi.listStudents()]);
      setBatches(b.data?.data || []);
      setStudents(s.data?.data || []);
    } catch {
      /* non-blocking */
    }
  };
  const loadRows = async () => {
    try {
      const params = {};
      if (fClass) params.classification = fClass;
      if (fStudent) params.student = fStudent;
      else if (fBatch) params.batch = fBatch;
      const res = await instituteApi.listResults(params, year);
      setRows(res.data?.data || []);
    } catch {
      toast.error("تعذر تحميل النتائج");
    }
  };

  useEffect(() => {
    loadLookups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    loadRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fClass, fBatch, fStudent, year]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.student || !image) {
      toast.warn("الطالب وصورة كشف الدرجات مطلوبان");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      fd.append("image", image);
      await instituteApi.createResult(fd);
      toast.success("تم رفع واعتماد النتيجة");
      setForm({ student: "", term: "term_1", examType: "monthly_1", academicYear: "" });
      setImage(null);
      loadRows();
    } catch {
      toast.error("تعذر رفع النتيجة");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("حذف هذه النتيجة؟")) return;
    try {
      await instituteApi.deleteResult(id);
      toast.success("تم الحذف");
      loadRows();
    } catch {
      toast.error("تعذر الحذف");
    }
  };

  const browseStudents = fBatch ? students.filter((s) => s.batch === fBatch) : students;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="النتائج الدراسية"
        description="رفع واعتماد كشوف درجات الطلاب كصور، واستعراضها حسب التصنيف والدفعة والطالب."
      />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ImageIcon className="h-4 w-4 text-accent-600" /> رفع واعتماد نتيجة دراسية جديدة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>اختر الطالب *</label>
              <select className={selectCls} value={form.student} onChange={set("student")}>
                <option value="">-- اختر الطالب --</option>
                {students.map((s) => (
                  <option key={s.user?._id} value={s.user?._id}>{s.user?.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>الفصل الدراسي *</label>
              <select className={selectCls} value={form.term} onChange={set("term")}>
                {opts(RESULT_TERM_LABELS).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>نوع الاختبار *</label>
              <select className={selectCls} value={form.examType} onChange={set("examType")}>
                {opts(RESULT_EXAM_TYPE_LABELS).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>العام الدراسي</label>
              <select className={selectCls} value={form.academicYear} onChange={set("academicYear")}>
                <option value="">العام النشط</option>
                {years.map((y) => (
                  <option key={y._id} value={y._id}>{y.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>صورة كشف الدرجات (JPG / PNG) *</label>
              <input type="file" accept=".jpg,.jpeg,.png" onChange={(e) => setImage(e.target.files?.[0] || null)} className="text-sm text-text-secondary" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={saving}>
                <Rocket className="h-4 w-4" /> رفع واعتماد النتيجة فوراً
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="h-4 w-4 text-brand-600" /> استعراض النتائج
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>تصنيف النتيجة</label>
              <select className={selectCls} value={fClass} onChange={(e) => setFClass(e.target.value)}>
                <option value="">الكل</option>
                {opts(RESULT_CLASSIFICATION_LABELS).map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>الدفعة</label>
              <select className={selectCls} value={fBatch} onChange={(e) => { setFBatch(e.target.value); setFStudent(""); }}>
                <option value="">الكل</option>
                {batches.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>الطالب</label>
              <select className={selectCls} value={fStudent} onChange={(e) => setFStudent(e.target.value)}>
                <option value="">الكل</option>
                {browseStudents.map((s) => <option key={s.user?._id} value={s.user?._id}>{s.user?.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r._id} className="flex items-center justify-between rounded-lg border-[0.5px] border-border-subtle p-3">
                <div className="min-w-0 text-sm">
                  <p className="font-medium text-text-primary">{r.student?.name}</p>
                  <p className="text-text-secondary">
                    {resultTermLabel(r.term)} · {resultExamTypeLabel(r.examType)} · {dt(r.createdAt)}
                  </p>
                  <p className="text-xs text-text-muted">
                    اطلاع ولي الأمر: {r.guardianViewedAt ? `✔️ ${dt(r.guardianViewedAt)}` : "❌ لم يطلع بعد"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <a href={r.imageUrl} target="_blank" rel="noreferrer" className="rounded p-1.5 text-brand-600 hover:bg-brand-50" title="عرض الكشف">
                    <Eye className="h-4 w-4" />
                  </a>
                  <button onClick={() => remove(r._id)} className="rounded p-1.5 text-error-text hover:bg-error-bg" aria-label="حذف">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {!rows.length && <p className="py-8 text-center text-text-secondary">لا توجد نتائج مطابقة.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
