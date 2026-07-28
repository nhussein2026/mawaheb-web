import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BookOpen, Users, Award, Plus, Save, Pencil, Trash2, BadgeCheck } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/DataTable";
import StatGrid from "../../components/institute/StatGrid";
import Modal from "../../components/institute/Modal";
import { selectCls, labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import {
  COURSE_TYPE_OPTIONS,
  COURSE_STATUS_OPTIONS,
  courseStatusLabel,
} from "../../constants/institute";

const emptyForm = {
  courseType: "standalone",
  programTitleAr: "",
  programTitleEn: "",
  title: "",
  certTitleEn: "",
  trainer: "",
  hours: "",
  periodText: "",
  documentationDate: "",
  status: "ongoing",
  batches: [],
};

const Courses = () => {
  const year = useSelector((s) => s.academicYear.selectedYearId);
  const [stats, setStats] = useState({});
  const [rows, setRows] = useState([]);
  const [batches, setBatches] = useState([]);
  const [staff, setStaff] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const load = async () => {
    try {
      const [st, list] = await Promise.all([
        instituteApi.getCourseStats(year),
        instituteApi.listCourses(year),
      ]);
      setStats(st.data?.data || {});
      setRows(list.data?.data || []);
    } catch {
      toast.error("تعذر تحميل الدورات");
    }
  };
  const loadLookups = async () => {
    try {
      const [b, s] = await Promise.all([
        instituteApi.listBatches(),
        instituteApi.listStaff(),
      ]);
      setBatches(b.data?.data || []);
      setStaff(s.data?.data || []);
    } catch {
      /* non-blocking */
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);
  useEffect(() => {
    loadLookups();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };
  const openEdit = (c) => {
    setEditingId(c._id);
    setForm({
      courseType: c.courseType || "standalone",
      programTitleAr: c.programTitleAr || "",
      programTitleEn: c.programTitleEn || "",
      title: c.title || "",
      certTitleEn: c.certTitleEn || "",
      trainer: c.trainer?._id || c.trainer || "",
      hours: c.hours ?? "",
      periodText: c.periodText || "",
      documentationDate: c.documentationDate ? c.documentationDate.slice(0, 10) : "",
      status: c.status || "ongoing",
      batches: c.batches || [],
    });
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.courseType) {
      toast.warn("اسم الدورة ونوعها مطلوبان");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, hours: form.hours === "" ? undefined : Number(form.hours) };
      if (editingId) {
        await instituteApi.updateCourse(editingId, payload);
        toast.success("تم تحديث الدورة");
      } else {
        await instituteApi.createCourse(payload);
        toast.success("تم حفظ الدورة وربط المتدربين");
      }
      setOpen(false);
      load();
    } catch {
      toast.error("تعذر حفظ الدورة");
    } finally {
      setSaving(false);
    }
  };

  const issue = async (c) => {
    if (!window.confirm(`إصدار الشهادات لجميع المسجلين في «${c.title}»؟`)) return;
    try {
      const res = await instituteApi.issueCertificates(c._id);
      toast.success(res.data?.message || "تم إصدار الشهادات");
      load();
    } catch {
      toast.error("تعذر إصدار الشهادات");
    }
  };

  const remove = async (c) => {
    if (!window.confirm(`حذف الدورة «${c.title}»؟`)) return;
    try {
      await instituteApi.deleteCourse(c._id);
      toast.success("تم حذف الدورة");
      load();
    } catch {
      toast.error("تعذر الحذف");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="إدارة الدورات والبرامج"
        description="إدارة الدورات التدريبية وربط المتدربين بالدفعات وإصدار الشهادات."
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> إضافة دورة جديدة
          </Button>
        }
      />

      <StatGrid
        cols={3}
        stats={[
          { label: "عدد الدورات المسجلة", value: stats.courses ?? 0, icon: BookOpen, tone: "brand" },
          { label: "عدد المسجلين بالدورات", value: stats.enrolled ?? 0, icon: Users, tone: "accent" },
          { label: "عدد الشهادات الممنوحة", value: stats.certificates ?? 0, icon: Award, tone: "success" },
        ]}
      />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">قائمة الدورات والبرامج</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان الدورة / البرنامج</TableHead>
                <TableHead>المدرب</TableHead>
                <TableHead>فترة الدورة</TableHead>
                <TableHead>المسجلون</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c._id}>
                  <TableCell className="font-medium text-text-primary">
                    📘 {c.title}
                    {c.programTitleAr && (
                      <span className="mt-0.5 block text-xs text-text-muted">{c.programTitleAr}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{c.trainer?.name || "—"}</TableCell>
                  <TableCell className="text-sm">{c.periodText || "—"}</TableCell>
                  <TableCell className="text-sm">{c.enrolledCount ?? 0}</TableCell>
                  <TableCell className="text-xs">{courseStatusLabel(c.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(c)} className="rounded p-1.5 text-brand-600 hover:bg-brand-50" aria-label="تحرير">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => issue(c)} className="rounded p-1.5 text-success-text hover:bg-success-bg" aria-label="إصدار الشهادات">
                        <BadgeCheck className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(c)} className="rounded p-1.5 text-error-text hover:bg-error-bg" aria-label="حذف">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-text-secondary">لا توجد دورات مسجلة.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {open && (
        <Modal title={editingId ? "تحرير الدورة" : "➕ إضافة دورة جديدة"} onClose={() => setOpen(false)}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>النوع *</label>
                <select className={selectCls} value={form.courseType} onChange={set("courseType")}>
                  {COURSE_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>الحالة</label>
                <select className={selectCls} value={form.status} onChange={set("status")}>
                  {COURSE_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {form.courseType === "program" && (
                <>
                  <div>
                    <label className={labelCls}>عنوان البرنامج (بالعربي)</label>
                    <Input value={form.programTitleAr} onChange={set("programTitleAr")} />
                  </div>
                  <div>
                    <label className={labelCls}>عنوان البرنامج (بالإنجليزي)</label>
                    <Input value={form.programTitleEn} onChange={set("programTitleEn")} dir="ltr" />
                  </div>
                </>
              )}

              <div className="sm:col-span-2">
                <label className={labelCls}>اسم الدورة التدريبية (بالعربي) *</label>
                <Input value={form.title} onChange={set("title")} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>عنوان الدورة المعتمد بالإنجليزية (للشهادات)</label>
                <Input value={form.certTitleEn} onChange={set("certTitleEn")} dir="ltr" />
              </div>

              <div>
                <label className={labelCls}>المدرب المسؤول</label>
                <select className={selectCls} value={form.trainer} onChange={set("trainer")}>
                  <option value="">-- اختر المدرب --</option>
                  {staff.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>عدد الساعات</label>
                <Input type="number" min={0} value={form.hours} onChange={set("hours")} dir="ltr" />
              </div>

              <div>
                <label className={labelCls}>فترة الدورة (نص حر)</label>
                <Input value={form.periodText} onChange={set("periodText")} placeholder="مثال: 24-25/6/2026" />
              </div>
              <div>
                <label className={labelCls}>تاريخ التوثيق</label>
                <Input type="date" value={form.documentationDate} onChange={set("documentationDate")} dir="ltr" />
              </div>

              <div className="sm:col-span-2">
                <label className={labelCls}>ربط المتدربين من خلال رقم الدفعة (اختيار متعدد)</label>
                <select
                  multiple
                  className={`${textareaCls} min-h-[6rem]`}
                  value={form.batches}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      batches: Array.from(e.target.selectedOptions, (o) => o.value),
                    }))
                  }
                >
                  {batches.map((b) => (
                    <option key={b} value={b}>الدفعة {b}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-text-muted">يتم تسجيل جميع طلاب الدفعات المحددة تلقائياً في الدورة.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4" /> حفظ الدورة المقررة
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Courses;
