import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Megaphone, Save, Trash2, Pencil, X } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button, IconButton } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableStateRow } from "../../components/ui/DataTable";
import { selectCls, labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import {
  ANNOUNCEMENT_SCOPE_OPTIONS,
  ACADEMIC_LEVEL_OPTIONS,
  announcementScopeLabel,
} from "../../constants/institute";

import { Chip } from "../../components/ui/Badge";
import { formatDate } from "../../utils/format";
import { useConfirm } from "../../components/ui/confirmContext";
import { EmptyState, Callout } from "../../components/ui/Feedback";
import { useLoadEffect } from "../../hooks/useLoadEffect";
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
  const confirm = useConfirm();
  const [formWarn, setFormWarn] = useState("");  const [loadError, setLoadError] = useState("");  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const load = useCallback(async () => {
    try {
      const res = await instituteApi.getAnnouncements({}, year);
      setItems(res.data?.data || []);
      setLoadError("");
    } catch {
      setLoadError("تعذّر تحميل الإعلانات");
    }
  }, [year]);

  useLoadEffect(load);

  const reset = () => {
    setForm(empty);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormWarn("");
    if (!form.title || !form.content || !form.publishStart || !form.publishEnd) {
      setFormWarn("العنوان والمحتوى وتاريخا النشر مطلوبة");
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
      setFormWarn("تعذّر حفظ الإعلان. يُرجى المحاولة مرة أخرى.");
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
    if (!(await confirm({ title: "حذف الإعلان؟", body: "سيختفي الإعلان من بوابة الطلاب فورًا.", confirmLabel: "حذف الإعلان", destructive: true }))) return;
    try {
      await instituteApi.deleteAnnouncement(id);
      toast.success("تم حذف الإعلان");
      load();
    } catch {
      toast.error("تعذّر حذف الإعلان");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="الإعلانات والتوجيهات"
        description="إنشاء وإدارة الإعلانات الموجهة للطلاب والمشرفين ضمن فترة نشر محددة."
      />
      {loadError ? (
        <Callout tone="danger" title={loadError} action={<Button variant="secondary" size="sm" onClick={() => load()}>إعادة المحاولة</Button>}>
          يُرجى التحقق من الاتصال والمحاولة مرة أخرى.
        </Callout>
      ) : null}

      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Megaphone className="size-5 text-text-tertiary" aria-hidden="true" />
            {editingId ? "تعديل الإعلان" : "إعلان وتوجيه إداري جديد"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} noValidate className="space-y-4">
            {formWarn ? <Callout tone="danger">{formWarn}</Callout> : null}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="announceme-f1" className={labelCls}>عنوان الإعلان<span className="ms-0.5 text-danger-700" aria-hidden="true">*</span></label>
                <Input id="announceme-f1" value={form.title} onChange={set("title")} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="announceme-f2" className={labelCls}>محتوى الإعلان<span className="ms-0.5 text-danger-700" aria-hidden="true">*</span></label>
                <textarea id="announceme-f2" className={textareaCls} rows={3} value={form.content} onChange={set("content")} />
              </div>
              <div>
                <label htmlFor="announceme-f3" className={labelCls}>نطاق الاستهداف<span className="ms-0.5 text-danger-700" aria-hidden="true">*</span></label>
                <select id="announceme-f3" className={selectCls} value={form.targetScope} onChange={set("targetScope")}>
                  {ANNOUNCEMENT_SCOPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              {form.targetScope === "level" && (
                <div>
                  <label htmlFor="announceme-f4" className={labelCls}>المستويات المستهدفة</label>
                  <select id="announceme-f4"
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
                  <label htmlFor="announceme-f5" className={labelCls}>الدفعات (أرقام مفصولة بفاصلة)</label>
                  <Input id="announceme-f5" value={form.targetRefs} onChange={set("targetRefs")} placeholder="11, 12" dir="ltr" />
                </div>
              )}
              <div>
                <label htmlFor="announceme-f6" className={labelCls}>تاريخ بدء النشر<span className="ms-0.5 text-danger-700" aria-hidden="true">*</span></label>
                <Input id="announceme-f6" type="date" value={form.publishStart} onChange={set("publishStart")} dir="ltr" />
              </div>
              <div>
                <label htmlFor="announceme-f7" className={labelCls}>تاريخ انتهاء النشر<span className="ms-0.5 text-danger-700" aria-hidden="true">*</span></label>
                <Input id="announceme-f7" type="date" value={form.publishEnd} onChange={set("publishEnd")} dir="ltr" />
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

      <Card className="">
        <CardHeader>
          <CardTitle>قائمة الإعلانات الحالية</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0 sm:px-0 sm:pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>الاستهداف</TableHead>
                <TableHead>فترة النشر</TableHead>
                <TableHead>الإجراء</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((a) => (
                <TableRow key={a._id}>
                  <TableCell className="font-medium text-text-primary">{a.title}</TableCell>
                  <TableCell>
                    <Chip>
                      {announcementScopeLabel(a.targetScope)}
                      {a.targetRefs?.length ? `: ${a.targetRefs.join("، ")}` : ""}
                    </Chip>
                  </TableCell>
                  <TableCell className="num whitespace-nowrap text-sm">
                    {formatDate(a.publishStart)} إلى {formatDate(a.publishEnd)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <IconButton label="تعديل" size="sm" tone="brand" onClick={() => edit(a)}><Pencil /></IconButton>
                      <IconButton label="حذف" size="sm" tone="danger" onClick={() => remove(a._id)}><Trash2 /></IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!items.length && (
                <TableStateRow colSpan={4}>
                  <EmptyState compact kind="first-use" title="لا توجد إعلانات بعد" />
                </TableStateRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Announcements;
