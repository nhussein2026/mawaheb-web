import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BookOpen, Users, Award, Plus, Save, Pencil, Trash2, BadgeCheck } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button, IconButton } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableStateRow } from "../../components/ui/DataTable";
import StatGrid from "../../components/institute/StatGrid";
import Modal from "../../components/institute/Modal";
import { selectCls, labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import { COURSE_TYPE_OPTIONS, COURSE_STATUS_OPTIONS, courseStatusLabel, COURSE_STATUS_TONE } from "../../constants/institute";

import { useConfirm } from "../../components/ui/confirmContext";
import { StatusBadge } from "../../components/ui/Badge";
import { EmptyState, Callout } from "../../components/ui/Feedback";
import { useLoadEffect } from "../../hooks/useLoadEffect";
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
  const confirm = useConfirm();
  const [formWarn, setFormWarn] = useState("");  const [loadError, setLoadError] = useState("");  const [stats, setStats] = useState({});
  const [rows, setRows] = useState([]);
  const [batches, setBatches] = useState([]);
  const [staff, setStaff] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const load = useCallback(async () => {
    try {
      const [st, list] = await Promise.all([
        instituteApi.getCourseStats(year),
        instituteApi.listCourses(year),
      ]);
      setStats(st.data?.data || {});
      setRows(list.data?.data || []);
      setLoadError("");
    } catch {
      setLoadError("تعذّر تحميل الدورات");
    }
  }, [year]);
  const loadLookups = useCallback(async () => {
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
  }, []);

  useLoadEffect(load);
  useLoadEffect(loadLookups);

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
    setFormWarn("");
    if (!form.title || !form.courseType) {
      setFormWarn("اسم الدورة ونوعها مطلوبان");
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
      setFormWarn("تعذّر حفظ الدورة. يُرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const issue = async (c) => {
    if (!(await confirm({ title: `إصدار الشهادات لدورة «${c.title}»؟`, body: "ستصدر شهادة لكل طالب مسجل في الدورة وتظهر في بوابته.", confirmLabel: "إصدار الشهادات" }))) return;
    try {
      const res = await instituteApi.issueCertificates(c._id);
      toast.success(res.data?.message || "تم إصدار الشهادات");
      load();
    } catch {
      toast.error("تعذّر إصدار الشهادات");
    }
  };

  const remove = async (c) => {
    if (!(await confirm({ title: `حذف الدورة «${c.title}»؟`, body: "ستُحذف الدورة وتسجيلاتها نهائيًا.", confirmLabel: "حذف الدورة", destructive: true }))) return;
    try {
      await instituteApi.deleteCourse(c._id);
      toast.success("تم حذف الدورة");
      load();
    } catch {
      toast.error("تعذّر الحذف");
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
      {loadError ? (
        <Callout tone="danger" title={loadError} action={<Button variant="secondary" size="sm" onClick={() => load()}>إعادة المحاولة</Button>}>
          يُرجى التحقق من الاتصال والمحاولة مرة أخرى.
        </Callout>
      ) : null}

      <StatGrid
        cols={3}
        stats={[
          { label: "عدد الدورات المسجلة", value: stats.courses ?? 0, icon: BookOpen, tone: "brand" },
          { label: "عدد المسجلين بالدورات", value: stats.enrolled ?? 0, icon: Users, tone: "accent" },
          { label: "عدد الشهادات الممنوحة", value: stats.certificates ?? 0, icon: Award, tone: "success" },
        ]}
      />

      <Card className="">
        <CardHeader>
          <CardTitle>قائمة الدورات والبرامج</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0 sm:px-0 sm:pb-0">
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
                    {c.title}
                    {c.programTitleAr && (
                      <span className="mt-0.5 block text-xs text-text-muted">{c.programTitleAr}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{c.trainer?.name || "—"}</TableCell>
                  <TableCell className="text-sm">{c.periodText || "—"}</TableCell>
                  <TableCell className="text-sm">{c.enrolledCount ?? 0}</TableCell>
                  <TableCell className="text-xs"><StatusBadge tone={COURSE_STATUS_TONE[c.status]}>{courseStatusLabel(c.status)}</StatusBadge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <IconButton label="تحرير" size="sm" tone="brand" onClick={() => openEdit(c)}><Pencil /></IconButton>
                      <IconButton label="إصدار الشهادات" size="sm" tone="brand" onClick={() => issue(c)}><BadgeCheck /></IconButton>
                      <IconButton label="حذف" size="sm" tone="danger" onClick={() => remove(c)}><Trash2 /></IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableStateRow colSpan={6}>
                  <EmptyState compact kind="first-use" title="لا توجد دورات مسجلة" />
                </TableStateRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {open && (
        <Modal title={editingId ? "تحرير الدورة" : "إضافة دورة جديدة"} onClose={() => setOpen(false)}>
          <form onSubmit={submit} noValidate className="space-y-4">
            {formWarn ? <Callout tone="danger">{formWarn}</Callout> : null}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="coursesjsx-f1" className={labelCls}>النوع<span className="ms-0.5 text-danger-700" aria-hidden="true">*</span></label>
                <select id="coursesjsx-f1" className={selectCls} value={form.courseType} onChange={set("courseType")}>
                  {COURSE_TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="coursesjsx-f2" className={labelCls}>الحالة</label>
                <select id="coursesjsx-f2" className={selectCls} value={form.status} onChange={set("status")}>
                  {COURSE_STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {form.courseType === "program" && (
                <>
                  <div>
                    <label htmlFor="coursesjsx-f3" className={labelCls}>عنوان البرنامج (بالعربي)</label>
                    <Input id="coursesjsx-f3" value={form.programTitleAr} onChange={set("programTitleAr")} />
                  </div>
                  <div>
                    <label htmlFor="coursesjsx-f4" className={labelCls}>عنوان البرنامج (بالإنجليزي)</label>
                    <Input id="coursesjsx-f4" value={form.programTitleEn} onChange={set("programTitleEn")} dir="ltr" />
                  </div>
                </>
              )}

              <div className="sm:col-span-2">
                <label htmlFor="coursesjsx-f5" className={labelCls}>اسم الدورة التدريبية (بالعربي)<span className="ms-0.5 text-danger-700" aria-hidden="true">*</span></label>
                <Input id="coursesjsx-f5" value={form.title} onChange={set("title")} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="coursesjsx-f6" className={labelCls}>عنوان الدورة المعتمد بالإنجليزية (للشهادات)</label>
                <Input id="coursesjsx-f6" value={form.certTitleEn} onChange={set("certTitleEn")} dir="ltr" />
              </div>

              <div>
                <label htmlFor="coursesjsx-f7" className={labelCls}>المدرب المسؤول</label>
                <select id="coursesjsx-f7" className={selectCls} value={form.trainer} onChange={set("trainer")}>
                  <option value="">-- اختر المدرب --</option>
                  {staff.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="coursesjsx-f8" className={labelCls}>عدد الساعات</label>
                <Input id="coursesjsx-f8" type="number" min={0} value={form.hours} onChange={set("hours")} dir="ltr" />
              </div>

              <div>
                <label htmlFor="coursesjsx-f9" className={labelCls}>فترة الدورة (نص حر)</label>
                <Input id="coursesjsx-f9" value={form.periodText} onChange={set("periodText")} placeholder="مثال: 24-25/6/2026" />
              </div>
              <div>
                <label htmlFor="coursesjsx-f10" className={labelCls}>تاريخ التوثيق</label>
                <Input id="coursesjsx-f10" type="date" value={form.documentationDate} onChange={set("documentationDate")} dir="ltr" />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="coursesjsx-f11" className={labelCls}>ربط المتدربين من خلال رقم الدفعة (اختيار متعدد)</label>
                <select id="coursesjsx-f11"
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

            <div className="flex flex-wrap justify-end gap-2 border-t border-border-subtle pt-4">
              <Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button>
              <Button type="submit" loading={saving}>
                <Save className="h-4 w-4" /> حفظ الدورة المقررة
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Courses;
