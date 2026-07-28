import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Megaphone, Save, Trash2, Pencil, X } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/DataTable";
import { selectCls, labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import {
  ANNOUNCEMENT_SCOPE_OPTIONS,
  ACADEMIC_LEVEL_OPTIONS,
  announcementScopeLabel,
} from "../../constants/institute";

const fmt = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");
const empty = {
  title: "",
  content: "",
  targetScope: "all",
  targetRefs: [],
  publishStart: "",
  publishEnd: "",
};

const Announcements = () => {
  const year = useSelector((s) => s.academicYear.selectedYearId);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const load = async () => {
    try {
      const res = await instituteApi.getAnnouncements({}, year);
      setItems(res.data?.data || []);
    } catch {
      toast.error("تعذر تحميل الإعلانات");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  const reset = () => {
    setForm(empty);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.publishStart || !form.publishEnd) {
      toast.warn("العنوان والمحتوى وتاريخا النشر مطلوبة");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        targetRefs:
          form.targetScope === "level"
            ? form.targetRefs
            : form.targetScope === "batch"
            ? String(form.targetRefs || "")
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
      };
      if (editingId) {
        await instituteApi.updateAnnouncement(editingId, payload);
        toast.success("تم تحديث الإعلان");
      } else {
        await instituteApi.createAnnouncement(payload);
        toast.success("تم نشر الإعلان");
      }
      reset();
      load();
    } catch {
      toast.error("تعذر حفظ الإعلان");
    } finally {
      setSaving(false);
    }
  };

  const edit = (a) => {
    setEditingId(a._id);
    setForm({
      title: a.title || "",
      content: a.content || "",
      targetScope: a.targetScope || "all",
      targetRefs:
        a.targetScope === "batch"
          ? (a.targetRefs || []).join(", ")
          : a.targetRefs || [],
      publishStart: fmt(a.publishStart),
      publishEnd: fmt(a.publishEnd),
    });
  };

  const remove = async (id) => {
    if (!window.confirm("حذف هذا الإعلان؟")) return;
    try {
      await instituteApi.deleteAnnouncement(id);
      toast.success("تم حذف الإعلان");
      load();
    } catch {
      toast.error("تعذر حذف الإعلان");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="الإعلانات والتوجيهات"
        description="إنشاء وإدارة الإعلانات الموجهة للطلاب والمشرفين ضمن فترة نشر محددة."
      />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Megaphone className="h-4 w-4 text-accent-600" />
            {editingId ? "تعديل الإعلان" : "📢 إعلان وتوجيه إداري جديد"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls}>عنوان الإعلان *</label>
                <Input value={form.title} onChange={set("title")} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>محتوى الإعلان *</label>
                <textarea className={textareaCls} rows={3} value={form.content} onChange={set("content")} />
              </div>
              <div>
                <label className={labelCls}>نطاق الاستهداف *</label>
                <select className={selectCls} value={form.targetScope} onChange={set("targetScope")}>
                  {ANNOUNCEMENT_SCOPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              {form.targetScope === "level" && (
                <div>
                  <label className={labelCls}>المستويات المستهدفة</label>
                  <select
                    multiple
                    className={`${selectCls} h-auto`}
                    value={form.targetRefs}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        targetRefs: Array.from(e.target.selectedOptions, (o) => o.value),
                      }))
                    }
                  >
                    {ACADEMIC_LEVEL_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              )}
              {form.targetScope === "batch" && (
                <div>
                  <label className={labelCls}>الدفعات (أرقام مفصولة بفاصلة)</label>
                  <Input value={form.targetRefs} onChange={set("targetRefs")} placeholder="11, 12" dir="ltr" />
                </div>
              )}
              <div>
                <label className={labelCls}>تاريخ بدء النشر *</label>
                <Input type="date" value={form.publishStart} onChange={set("publishStart")} dir="ltr" />
              </div>
              <div>
                <label className={labelCls}>تاريخ انتهاء النشر *</label>
                <Input type="date" value={form.publishEnd} onChange={set("publishEnd")} dir="ltr" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4" /> {editingId ? "حفظ التعديل" : "نشر الإعلان"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={reset}>
                  <X className="h-4 w-4" /> إلغاء
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">قائمة الإعلانات الحالية</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>الاستهداف</TableHead>
                <TableHead>النشر (من → إلى)</TableHead>
                <TableHead>الإجراء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((a) => (
                <TableRow key={a._id}>
                  <TableCell className="font-medium text-text-primary">{a.title}</TableCell>
                  <TableCell>
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                      {announcementScopeLabel(a.targetScope)}
                      {a.targetRefs?.length ? `: ${a.targetRefs.join("، ")}` : ""}
                    </span>
                  </TableCell>
                  <TableCell dir="ltr" className="text-sm">
                    {fmt(a.publishStart)} → {fmt(a.publishEnd)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <button onClick={() => edit(a)} className="rounded p-1.5 text-brand-600 hover:bg-brand-50" aria-label="تعديل">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(a._id)} className="rounded p-1.5 text-error-text hover:bg-error-bg" aria-label="حذف">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!items.length && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-text-secondary">
                    لا توجد إعلانات بعد.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Announcements;
