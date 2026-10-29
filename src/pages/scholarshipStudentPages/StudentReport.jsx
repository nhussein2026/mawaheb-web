import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Plus } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Field, Input, Select, RequiredNote } from "../../components/ui/Input";
import { Callout, SkeletonCard, EmptyState } from "../../components/ui/Feedback";
import { useResource } from "../../hooks/useResource";
import { API_BASE_URL } from "../../services/api/config";

// Each linkable record type: where it is created, the option list it lives
// in, the key the created item comes back under, and its extra fields.
const ITEMS = {
  course: { label: "الدورة التدريبية", endpoint: "courses", list: "courses", fields: [{ name: "course_image", label: "رابط صورة الدورة", type: "url" }] },
  note: { label: "الملاحظة الدراسية", endpoint: "notes", list: "notes", fields: [] },
  difficulty: { label: "الصعوبة أو التحدي", endpoint: "difficulties", list: "difficulties", fields: [] },
  userAchievement: {
    label: "الإنجاز الشخصي",
    endpoint: "userAchievements",
    list: "userAchievements",
    fields: [
      { name: "category", label: "الفئة", type: "text" },
      { name: "achievement_image", label: "رابط صورة الإنجاز", type: "url" },
    ],
  },
  event: { label: "الفعالية أو النشاط", endpoint: "events", list: "events", fields: [{ name: "photo", label: "رابط صورة الفعالية", type: "url" }] },
  certificate: {
    label: "الشهادة المهنية",
    endpoint: "certificates",
    list: "certificates",
    fields: [
      { name: "certificate_image", label: "رابط صورة الشهادة", type: "url" },
      { name: "certificate_link", label: "رابط الشهادة", type: "url" },
    ],
  },
};

const EMPTY_FORM = {
  title: "",
  courseId: "",
  noteId: "",
  difficultiesId: "",
  userAchievementId: "",
  eventId: "",
  date_of_report: "",
  certificateId: "",
};

const emptyItem = (type) => Object.fromEntries([["title", ""], ["description", ""], ...ITEMS[type].fields.map((f) => [f.name, ""])]);

// Create endpoints wrap the saved record ({ course }, { event }, …).
const unwrap = (data, type) => {
  const rec = data?.[type] ?? data;
  return rec?._id ? rec : null;
};

/**
 * Term report form: title, date and up to six linked records, each chosen
 * from the scholar's existing ones or created inline. Inside the reports page
 * it is driven by `onSave`; at /try-report it is a page of its own.
 */
const StudentReport = ({ reportId, onSave, onCancel }) => {
  const token = useSelector((state) => state.auth.token);
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  const { data: options, status, reload, setData: setOptions } = useResource(
    async () => {
      const res = await fetch(`${API_BASE_URL}/studentReports/options`, { headers });
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    },
    [token],
    { initial: {}, select: (d) => d || {} }
  );

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState({});
  const [newItems, setNewItems] = useState(() => Object.fromEntries(Object.keys(ITEMS).map((t) => [t, emptyItem(t)])));
  const [itemErrors, setItemErrors] = useState({});
  const [itemBusy, setItemBusy] = useState(null);

  const validate = (f) => ({
    ...(f.title.trim() ? {} : { title: "يُرجى إدخال عنوان التقرير" }),
    ...(f.date_of_report ? {} : { date_of_report: "يُرجى إدخال تاريخ التقرير" }),
  });

  const set = (k) => (e) => {
    const next = { ...form, [k]: e.target.value };
    setForm(next);
    if (errors[k]) setErrors(validate(next));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) {
      document.getElementById(found.title ? "rep-title" : "rep-date")?.focus();
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/studentReport${reportId ? `/${reportId}` : ""}`, {
        method: reportId ? "PUT" : "POST",
        headers,
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      toast.success(reportId ? "تم حفظ التغييرات" : "تم تقديم التقرير");
      if (!reportId) setForm(EMPTY_FORM);
      onSave?.(data);
    } catch {
      setFormError("تعذّر حفظ التقرير ولم يُحفظ. يُرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const createItem = async (type) => {
    const item = newItems[type];
    if (!item.title.trim() || !item.description.trim()) {
      setItemErrors((er) => ({ ...er, [type]: "يُرجى إدخال العنوان والوصف" }));
      return;
    }
    setItemBusy(type);
    setItemErrors((er) => ({ ...er, [type]: "" }));
    try {
      const res = await fetch(`${API_BASE_URL}/${ITEMS[type].endpoint}`, { method: "POST", headers, body: JSON.stringify(item) });
      if (!res.ok) throw new Error(String(res.status));
      const created = unwrap(await res.json(), type);
      if (created) {
        setOptions((o) => ({ ...o, [ITEMS[type].list]: [...(o[ITEMS[type].list] || []), created] }));
        setForm((f) => ({ ...f, [`${type}Id`]: created._id }));
      } else {
        reload();
      }
      setCreating((c) => ({ ...c, [type]: false }));
      setNewItems((n) => ({ ...n, [type]: emptyItem(type) }));
      toast.success(`تمت إضافة ${ITEMS[type].label}`);
    } catch {
      setItemErrors((er) => ({ ...er, [type]: `تعذّر إضافة ${ITEMS[type].label}. يُرجى المحاولة مرة أخرى.` }));
    } finally {
      setItemBusy(null);
    }
  };

  const content =
    status === "loading" ? (
      <SkeletonCard lines={8} />
    ) : status === "failed" ? (
      <Card>
        <EmptyState kind="failed" title="تعذّر تحميل خيارات التقرير" onRetry={reload} />
      </Card>
    ) : (
      <Card>
        <CardContent className="pt-5 sm:pt-6">
          <form onSubmit={submit} noValidate className="space-y-6">
            {formError ? <Callout tone="danger">{formError}</Callout> : null}
            <RequiredNote />
            <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <legend className="mb-3 text-heading-4 text-text-primary">المعلومات الأساسية</legend>
              <Field label="عنوان التقرير" hint="مثال: تقرير الفصل الدراسي الأول" required error={errors.title} id="rep-title">
                <Input value={form.title} onChange={set("title")} dir="auto" />
              </Field>
              <Field label="تاريخ التقرير" required error={errors.date_of_report} id="rep-date">
                <Input type="date" value={form.date_of_report} onChange={set("date_of_report")} dir="ltr" />
              </Field>
            </fieldset>

            <fieldset>
              <legend className="mb-1 text-heading-4 text-text-primary">مكونات التقرير</legend>
              <p className="mb-3 text-sm text-text-tertiary">اختر من سجلاتك، أو أضف سجلًا جديدًا من هنا. كل المكونات اختيارية.</p>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {Object.entries(ITEMS).map(([type, cfg]) => (
                  <div key={type} className="rounded-lg border border-border-default p-4">
                    {creating[type] ? (
                      <div className="space-y-3">
                        <p className="text-label-md text-text-primary">إضافة {cfg.label}</p>
                        {itemErrors[type] ? <Callout tone="danger">{itemErrors[type]}</Callout> : null}
                        {[{ name: "title", label: "العنوان" }, { name: "description", label: "الوصف" }, ...cfg.fields].map((f) => (
                          <Field key={f.name} label={f.label} required={f.name === "title" || f.name === "description"} id={`rep-${type}-${f.name}`}>
                            <Input
                              type={f.type === "url" ? "url" : "text"}
                              dir={f.type === "url" ? "ltr" : "auto"}
                              value={newItems[type][f.name]}
                              onChange={(e) => setNewItems((n) => ({ ...n, [type]: { ...n[type], [f.name]: e.target.value } }))}
                            />
                          </Field>
                        ))}
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary" size="sm" onClick={() => setCreating((c) => ({ ...c, [type]: false }))} disabled={itemBusy === type}>
                            إلغاء
                          </Button>
                          <Button size="sm" variant="secondary" loading={itemBusy === type} onClick={() => createItem(type)}>
                            إضافة واختيار
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Field label={cfg.label} id={`rep-${type}`}>
                        <Select value={form[`${type}Id`] || ""} onChange={set(`${type}Id`)}>
                          <option value="">بدون</option>
                          {(options[cfg.list] || []).map((o) => (
                            <option key={o._id} value={o._id}>
                              {o.title}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    )}
                    {!creating[type] ? (
                      <Button variant="tertiary" size="sm" className="mt-2 -ms-2" onClick={() => setCreating((c) => ({ ...c, [type]: true }))}>
                        <Plus aria-hidden="true" /> إضافة جديد
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap justify-end gap-2 border-t border-border-subtle pt-4">
              {onCancel ? (
                <Button variant="secondary" onClick={onCancel} disabled={saving}>
                  إلغاء
                </Button>
              ) : null}
              <Button type="submit" loading={saving}>
                {reportId ? "حفظ التغييرات" : "تقديم التقرير"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );

  if (onSave) return content;
  return (
    <div className="space-y-6">
      <PageHeader title="تقرير فصلي جديد" description="اربط دوراتك وإنجازاتك وملاحظاتك في هذا الفصل في تقرير واحد." />
      {content}
    </div>
  );
};

export default StudentReport;
