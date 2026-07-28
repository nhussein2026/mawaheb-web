import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { CalendarPlus, GraduationCap, Rocket, Pencil, Trash2, Save, X } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/DataTable";
import instituteApi from "../../services/api/instituteApi";
import { setYears as setYearsRedux } from "../../features/institute/academicYearSlice";
import { ACADEMIC_LEVEL_OPTIONS, levelLabel } from "../../constants/institute";

const selectCls =
  "flex h-9 w-full rounded-md border-[0.5px] border-border-default bg-neutral-50 px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600";
const labelCls = "mb-1 block text-xs font-medium text-text-secondary";

const fmt = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

const emptyYear = { name: "", startDate: "", endDate: "", isActive: false };

const YearsStudents = () => {
  const dispatch = useDispatch();

  // ── Section 1: academic years ──────────────────────────────
  const [years, setYears] = useState([]);
  const [yearForm, setYearForm] = useState(emptyYear);
  const [editingId, setEditingId] = useState(null);
  const [savingYear, setSavingYear] = useState(false);

  // ── Section 2: training window ─────────────────────────────
  const [training, setTraining] = useState({ trainingStartDate: "", trainingEndDate: "" });
  const activeYear = useMemo(() => years.find((y) => y.isActive) || years[0], [years]);

  // ── Section 3: promotion ───────────────────────────────────
  const [levelFilter, setLevelFilter] = useState("");
  const [targetLevel, setTargetLevel] = useState("");
  const [promotable, setPromotable] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const loadYears = async () => {
    try {
      const res = await instituteApi.listYears();
      const list = res.data?.data || [];
      setYears(list);
      dispatch(setYearsRedux(list));
    } catch {
      toast.error("تعذر تحميل الأعوام الدراسية");
    }
  };

  const loadPromotable = async () => {
    try {
      const res = await instituteApi.getPromotableStudents(levelFilter);
      setPromotable(res.data?.data || []);
      setSelectedIds([]);
    } catch {
      toast.error("تعذر تحميل قائمة الطلاب");
    }
  };

  useEffect(() => {
    loadYears();
  }, []);
  useEffect(() => {
    loadPromotable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelFilter]);
  useEffect(() => {
    if (activeYear) {
      setTraining({
        trainingStartDate: fmt(activeYear.trainingStartDate),
        trainingEndDate: fmt(activeYear.trainingEndDate),
      });
    }
  }, [activeYear]);

  const trainingMonths = useMemo(() => {
    const { trainingStartDate, trainingEndDate } = training;
    if (!trainingStartDate || !trainingEndDate) return null;
    const a = new Date(trainingStartDate);
    const b = new Date(trainingEndDate);
    if (b < a) return null;
    const months =
      (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
    return Math.max(0, months);
  }, [training]);

  const submitYear = async (e) => {
    e.preventDefault();
    if (!yearForm.name || !yearForm.startDate || !yearForm.endDate) {
      toast.warn("يرجى تعبئة الاسم وتاريخي البداية والنهاية");
      return;
    }
    setSavingYear(true);
    try {
      if (editingId) {
        await instituteApi.updateYear(editingId, yearForm);
        toast.success("تم تحديث العام الدراسي");
      } else {
        await instituteApi.createYear(yearForm);
        toast.success("تم حفظ العام الدراسي");
      }
      setYearForm(emptyYear);
      setEditingId(null);
      loadYears();
    } catch {
      toast.error("تعذر حفظ العام الدراسي");
    } finally {
      setSavingYear(false);
    }
  };

  const editYear = (y) => {
    setEditingId(y._id);
    setYearForm({
      name: y.name || "",
      startDate: fmt(y.startDate),
      endDate: fmt(y.endDate),
      isActive: !!y.isActive,
    });
  };

  const removeYear = async (y) => {
    if (!window.confirm(`حذف العام «${y.name}»؟`)) return;
    try {
      await instituteApi.deleteYear(y._id);
      toast.success("تم حذف العام الدراسي");
      loadYears();
    } catch {
      toast.error("تعذر حذف العام الدراسي");
    }
  };

  const saveTraining = async () => {
    if (!activeYear) {
      toast.warn("لا يوجد عام دراسي لحفظ فترة التدريب عليه");
      return;
    }
    try {
      await instituteApi.saveTrainingWindow(activeYear._id, training);
      toast.success("تم حفظ فترة التدريب");
      loadYears();
    } catch {
      toast.error("تعذر حفظ فترة التدريب");
    }
  };

  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleSelectAll = () =>
    setSelectedIds((prev) =>
      prev.length === promotable.length ? [] : promotable.map((s) => s._id)
    );

  const promote = async () => {
    if (!targetLevel) return toast.warn("اختر المرحلة المستهدفة للترقية");
    if (selectedIds.length === 0) return toast.warn("حدّد طالباً واحداً على الأقل");
    try {
      const res = await instituteApi.promoteStudents(selectedIds, targetLevel);
      toast.success(`تمت ترقية ${res.data?.modified ?? selectedIds.length} طالب`);
      loadPromotable();
    } catch {
      toast.error("تعذر ترقية الطلاب");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="إدارة الأعوام والطلاب"
        description="إعداد الأعوام الدراسية وفترة التدريب وترقية الطلاب بين المراحل."
      />

      {/* Section 1 — Academic years */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarPlus className="h-5 w-5 text-brand-600" /> إعداد الأعوام الدراسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={submitYear} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelCls}>اسم العام الدراسي</label>
              <Input
                placeholder="مثال: عام 2026 الدراسي"
                value={yearForm.name}
                onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>تاريخ البدء</label>
              <Input type="date" value={yearForm.startDate} onChange={(e) => setYearForm({ ...yearForm, startDate: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>تاريخ الانتهاء</label>
              <Input type="date" value={yearForm.endDate} onChange={(e) => setYearForm({ ...yearForm, endDate: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>الحالة</label>
              <select
                className={selectCls}
                value={yearForm.isActive ? "1" : "0"}
                onChange={(e) => setYearForm({ ...yearForm, isActive: e.target.value === "1" })}
              >
                <option value="0">غير نشط</option>
                <option value="1">نشط (العام الحالي)</option>
              </select>
            </div>
            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
              <Button type="submit" disabled={savingYear}>
                <Save className="ml-1.5 h-4 w-4" /> {editingId ? "تحديث العام" : "حفظ العام الدراسي"}
              </Button>
              {editingId && (
                <Button type="button" variant="secondary" onClick={() => { setEditingId(null); setYearForm(emptyYear); }}>
                  <X className="ml-1.5 h-4 w-4" /> إلغاء
                </Button>
              )}
            </div>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم العام</TableHead>
                <TableHead>البداية</TableHead>
                <TableHead>النهاية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {years.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-text-secondary">لا توجد أعوام دراسية بعد</TableCell></TableRow>
              ) : years.map((y) => (
                <TableRow key={y._id}>
                  <TableCell className="font-medium">{y.name}</TableCell>
                  <TableCell>{fmt(y.startDate)}</TableCell>
                  <TableCell>{fmt(y.endDate)}</TableCell>
                  <TableCell>
                    {y.isActive
                      ? <span className="rounded-full bg-success-bg px-2 py-0.5 text-xs font-medium text-success-text">🟢 نشط</span>
                      : <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">⚫ غير نشط</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button onClick={() => editYear(y)} className="rounded-md p-1.5 text-brand-600 hover:bg-brand-50" title="تعديل"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => removeYear(y)} className="rounded-md p-1.5 text-error-text hover:bg-error-bg" title="حذف"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 2 — Training window */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-brand-600" /> البرنامج التدريبي بعد الثانوية (3-6 أشهر)
          </CardTitle>
          <CardDescription>
            {activeYear ? `مرتبط بالعام النشط: ${activeYear.name}` : "لا يوجد عام نشط"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>تاريخ بدء التدريب</label>
            <Input type="date" value={training.trainingStartDate} onChange={(e) => setTraining({ ...training, trainingStartDate: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>تاريخ انتهاء التدريب</label>
            <Input type="date" value={training.trainingEndDate} onChange={(e) => setTraining({ ...training, trainingEndDate: e.target.value })} />
          </div>
          <div className="flex items-end">
            <Button type="button" onClick={saveTraining} className="w-full sm:w-auto">
              <Save className="ml-1.5 h-4 w-4" /> حفظ فترة التدريب
            </Button>
          </div>
          {trainingMonths !== null && (
            <p className="text-sm text-text-secondary sm:col-span-3">
              مدة البرنامج الحالية المحسوبة: <span className="font-semibold text-text-primary">{trainingMonths} شهر</span>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Section 3 — Promotion */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-brand-600" /> ترقية الطلاب ونقلهم بين المراحل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelCls}>تصفية حسب المستوى الحالي</label>
              <select className={selectCls} value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
                <option value="">-- كل المستويات --</option>
                {ACADEMIC_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>المرحلة المستهدفة للترقية</label>
              <select className={selectCls} value={targetLevel} onChange={(e) => setTargetLevel(e.target.value)}>
                <option value="">-- اختر مرحلة --</option>
                {ACADEMIC_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <Button type="button" onClick={promote} disabled={selectedIds.length === 0}>
                <Rocket className="ml-1.5 h-4 w-4" /> ترقية الطلاب المحددين ({selectedIds.length})
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input type="checkbox" checked={promotable.length > 0 && selectedIds.length === promotable.length} onChange={toggleSelectAll} />
                </TableHead>
                <TableHead>اسم الطالب</TableHead>
                <TableHead>الرقم الأكاديمي</TableHead>
                <TableHead>الدفعة</TableHead>
                <TableHead>المستوى الحالي</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotable.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-text-secondary">لا يوجد طلاب مطابقون</TableCell></TableRow>
              ) : promotable.map((st) => (
                <TableRow key={st._id}>
                  <TableCell><input type="checkbox" checked={selectedIds.includes(st._id)} onChange={() => toggleSelect(st._id)} /></TableCell>
                  <TableCell className="font-medium">{st.user?.name || "—"}</TableCell>
                  <TableCell>{st.academicNumber || "—"}</TableCell>
                  <TableCell>{st.batch || "—"}</TableCell>
                  <TableCell>{levelLabel(st.level)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default YearsStudents;
