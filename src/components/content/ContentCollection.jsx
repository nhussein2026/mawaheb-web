import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, ImageOff, ExternalLink } from "lucide-react";
import { PageHeader } from "../ui/PageHeader";
import { Card } from "../ui/Card";
import { Button, IconButton } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import { Field, Input, Select, Textarea, RequiredNote } from "../ui/Input";
import { Callout, EmptyState, SkeletonCard } from "../ui/Feedback";
import { Chip } from "../ui/Badge";
import { useConfirm } from "../ui/confirmContext";
import { useResource } from "../../hooks/useResource";
import { API_BASE_URL } from "../../services/api/config";
import { formatDate } from "../../utils/format";

const FORM_ID = "content-form";

const emptyValues = (fields) =>
  Object.fromEntries(fields.map((f) => [f.name, f.type === "file" ? null : f.type === "select" ? f.options[0] : ""]));

const valuesFrom = (fields, item) =>
  Object.fromEntries(
    fields.map((f) => {
      if (f.type === "file") return [f.name, null];
      if (f.type === "date") return [f.name, item[f.name] ? String(item[f.name]).split("T")[0] : ""];
      return [f.name, item[f.name] ?? (f.type === "select" ? f.options[0] : "")];
    })
  );

/**
 * A person's own collection of records (notes, events, courses, achievements,
 * certificates, difficulties, financial reports): one list with add / edit in
 * a dialog and delete with confirmation. Each page passes a `config`:
 *
 *   endpoint      "/events"
 *   json          send JSON instead of multipart (no file fields)
 *   createExtra   (user) => extra body fields on create
 *   pick          (data) => the saved item in a create / update response
 *   fields        [{ name, label, type: text|textarea|date|url|select|file, required, options, hint, accept }]
 *   image         (item) => image URL or null
 *   link          (item) => external link or null
 *   meta          (item) => short text under the title (e.g. a category)
 *   date          (item) => date to show
 *   copy          { title, description, noun, add, empty, emptyHint }
 */
export function ContentCollection({ config }) {
  const { endpoint, json = false, createExtra, pick, fields, image, link, meta, date, copy } = config;
  const token = useSelector((s) => s.auth.token);
  const user = useSelector((s) => s.auth.user);
  const confirm = useConfirm();

  const request = useCallback(
    async (path, options = {}) => {
      const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: { Authorization: `Bearer ${token}`, ...(json && options.body ? { "Content-Type": "application/json" } : {}) },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(data.message || `HTTP ${res.status}`);
        err.status = res.status;
        err.serverMessage = data.message;
        throw err;
      }
      return data;
    },
    [token, json]
  );

  const { data: items, status, reload, setData: setItems } = useResource(
    () => request(endpoint),
    [token],
    { initial: [], select: (d) => (Array.isArray(d) ? d : []) }
  );

  const [editing, setEditing] = useState(null); // null | "new" | item
  const [values, setValues] = useState(() => emptyValues(fields));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewing, setViewing] = useState(null);

  const openNew = () => {
    setValues(emptyValues(fields));
    setErrors({});
    setFormError("");
    setEditing("new");
  };
  const openEdit = (item) => {
    setValues(valuesFrom(fields, item));
    setErrors({});
    setFormError("");
    setEditing(item);
  };
  const close = () => setEditing(null);

  const validate = (v) => {
    const e = {};
    fields.forEach((f) => {
      const val = v[f.name];
      if (f.required && (val == null || String(val).trim() === "")) e[f.name] = `يُرجى إدخال ${f.label}`;
      if (f.type === "url" && val && !/^https?:\/\/\S+$/i.test(String(val).trim()))
        e[f.name] = "يُرجى إدخال رابط صحيح يبدأ بـ https://";
      if (f.type === "file" && val && val.size > 5 * 1024 * 1024) e[f.name] = "حجم الملف أكبر من 5 ميغابايت. يُرجى اختيار ملف أصغر.";
    });
    return e;
  };

  const setField = (name) => (e) => {
    const value = e.target.type === "file" ? e.target.files?.[0] || null : e.target.value;
    const next = { ...values, [name]: value };
    setValues(next);
    if (errors[name]) setErrors(validate(next));
  };

  const save = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setFormError("");
    const first = fields.find((f) => found[f.name]);
    if (first) {
      document.getElementById(`cc-${first.name}`)?.focus();
      return;
    }
    const isNew = editing === "new";
    let body;
    if (json) {
      body = JSON.stringify({ ...values, ...(isNew && createExtra ? createExtra(user) : {}) });
    } else {
      body = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (v !== null) body.append(k, v);
      });
    }
    setSaving(true);
    try {
      const data = await request(isNew ? endpoint : `${endpoint}/${editing._id}`, { method: isNew ? "POST" : "PUT", body });
      const saved = pick(data);
      if (saved?._id) {
        setItems((list) => (isNew ? [...list, saved] : list.map((it) => (it._id === saved._id ? saved : it))));
      } else {
        reload();
      }
      toast.success(isNew ? `تمت إضافة ${copy.noun}` : "تم حفظ التغييرات");
      close();
    } catch (err) {
      setFormError(
        err.serverMessage ||
          (err.status >= 500 || !err.status
            ? "حدث خطأ ولم تُحفظ التغييرات. يُرجى المحاولة بعد قليل."
            : "تعذّر الحفظ. يُرجى مراجعة البيانات والمحاولة مرة أخرى.")
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    const ok = await confirm({
      title: `حذف ${copy.noun}؟`,
      body: `سيُحذف «${item.title || copy.noun}» نهائيًا ولا يمكن استرجاعه.`,
      confirmLabel: `حذف ${copy.noun}`,
      destructive: true,
    });
    if (!ok) return;
    try {
      await request(`${endpoint}/${item._id}`, { method: "DELETE" });
      setItems((list) => list.filter((it) => it._id !== item._id));
      toast.success(`تم حذف ${copy.noun}`);
    } catch {
      toast.error("تعذّر الحذف. يُرجى المحاولة مرة أخرى.");
    }
  };

  const withImages = Boolean(image);

  return (
    <div className="space-y-6">
      <PageHeader
        title={copy.title}
        description={copy.description}
        actions={
          <Button onClick={openNew}>
            <Plus aria-hidden="true" /> {copy.add}
          </Button>
        }
      />

      {status === "loading" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : status === "failed" ? (
        <Card>
          <EmptyState kind="failed" title={`تعذّر تحميل ${copy.title}`} onRetry={reload} />
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState kind="first-use" title={copy.empty} description={copy.emptyHint} action={<Button onClick={openNew}>{copy.add}</Button>} />
        </Card>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const img = image?.(item);
            const href = link?.(item);
            const when = date?.(item) ?? item.createdAt;
            return (
              <li key={item._id}>
                <Card as="article" className="flex h-full flex-col overflow-hidden">
                  {withImages ? (
                    img ? (
                      <button
                        type="button"
                        onClick={() => setViewing({ src: img, title: item.title })}
                        className="block aspect-[16/9] w-full bg-subtle"
                        aria-label={`عرض صورة ${item.title}`}
                      >
                        <img src={img} alt="" loading="lazy" className="size-full object-cover" />
                      </button>
                    ) : (
                      <div className="grid aspect-[16/9] w-full place-items-center bg-subtle text-text-disabled" aria-hidden="true">
                        <ImageOff className="size-8" />
                      </div>
                    )
                  ) : null}
                  <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h2 dir="auto" className="min-w-0 text-heading-4 text-text-primary">
                        {item.title}
                      </h2>
                      <div className="-me-2 -mt-1 flex shrink-0">
                        <IconButton label={`تعديل ${item.title}`} size="sm" onClick={() => openEdit(item)}>
                          <Pencil />
                        </IconButton>
                        <IconButton label={`حذف ${item.title}`} size="sm" tone="danger" onClick={() => remove(item)}>
                          <Trash2 />
                        </IconButton>
                      </div>
                    </div>
                    {meta?.(item) ? <Chip className="self-start">{meta(item)}</Chip> : null}
                    {item.description || item.content ? (
                      <p dir="auto" className="line-clamp-4 whitespace-pre-wrap text-sm text-text-secondary">
                        {item.description || item.content}
                      </p>
                    ) : null}
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-text-tertiary">
                      <span className="num">{formatDate(when, "")}</span>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-brand-strong underline underline-offset-4"
                        >
                          فتح الرابط
                          <ExternalLink className="icon-dir size-4" aria-hidden="true" />
                          <span className="sr-only">(يفتح في نافذة جديدة)</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog
        open={editing !== null}
        onClose={close}
        title={editing === "new" ? copy.add : `تعديل ${copy.noun}`}
        busy={saving}
        footer={
          <>
            <Button variant="secondary" onClick={close} disabled={saving}>
              إلغاء
            </Button>
            <Button type="submit" form={FORM_ID} loading={saving}>
              {editing === "new" ? `إضافة ${copy.noun}` : "حفظ التغييرات"}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} onSubmit={save} noValidate className="space-y-4">
          {formError ? <Callout tone="danger">{formError}</Callout> : null}
          {fields.some((f) => f.required) ? <RequiredNote /> : null}
          {fields.map((f) => (
            <Field
              key={f.name}
              id={`cc-${f.name}`}
              label={f.label}
              required={f.required}
              hint={f.type === "file" ? f.hint || "JPG أو PNG أو WebP، حتى 5 ميغابايت" : f.hint}
              error={errors[f.name]}
            >
              {f.type === "textarea" ? (
                <Textarea rows={4} value={values[f.name]} onChange={setField(f.name)} dir="auto" />
              ) : f.type === "select" ? (
                <Select value={values[f.name]} onChange={setField(f.name)}>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </Select>
              ) : f.type === "file" ? (
                <Input type="file" accept={f.accept || "image/jpeg,image/png,image/webp"} onChange={setField(f.name)} />
              ) : (
                <Input
                  type={f.type || "text"}
                  value={values[f.name]}
                  onChange={setField(f.name)}
                  dir={f.type === "url" || f.type === "date" ? "ltr" : "auto"}
                  inputMode={f.type === "url" ? "url" : undefined}
                />
              )}
            </Field>
          ))}
          {editing !== "new" && fields.some((f) => f.type === "file") ? (
            <p className="text-caption text-text-tertiary">اترك حقل الصورة فارغًا للإبقاء على الصورة الحالية.</p>
          ) : null}
        </form>
      </Dialog>

      <Dialog open={Boolean(viewing)} onClose={() => setViewing(null)} title={viewing?.title} size="xl">
        {viewing ? <img src={viewing.src} alt={viewing.title || ""} className="mx-auto max-h-[70vh] w-auto rounded-lg" /> : null}
      </Dialog>
    </div>
  );
}

export default ContentCollection;
