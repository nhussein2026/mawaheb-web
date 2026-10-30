import React, { useEffect, useId, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Camera, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { Callout } from "../ui/Feedback";
import { Field, Input, Select, Textarea } from "../ui/Input";
import { updateUser } from "../../features/user/authSlice";
import { API_BASE_URL } from "../../services/api/config";
import { completionPercent } from "../../utils/profileCompletion";

// Exact keys accepted by PUT /user/update-profile. Never send role, password
// or email from here: role is rejected with 403, password is stored unhashed.
const TEXT_FIELDS = [
  "name",
  "bio",
  "phone_number",
  "date_of_birth",
  "gender",
  "current_education_level",
  "linkedin_link",
  "website",
];

const NAME_MAX = 50;
const BIO_MAX = 500;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const IMAGE_MAX_MB = 5;

const EDUCATION_SUGGESTIONS = ["ثانوي", "دبلوم", "بكالوريوس", "ماجستير", "دكتوراه"];

const toLatinDigits = (v) => v.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

// Accept "linkedin.com/in/name" as typed and store it with a scheme.
function normalizeUrl(value) {
  const v = value.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function parseUrl(value) {
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) && url.hostname.includes(".") ? url : null;
  } catch {
    return null;
  }
}

function fromProfile(user = {}) {
  return {
    name: user.name || "",
    bio: user.bio || "",
    phone_number: user.phone_number || "",
    date_of_birth: user.date_of_birth ? String(user.date_of_birth).slice(0, 10) : "",
    gender: user.gender || "",
    current_education_level: user.current_education_level || "",
    linkedin_link: user.linkedin_link || "",
    website: user.website || "",
  };
}

function validateField(name, value) {
  const v = value.trim();
  if (name === "name") {
    if (!v) return "يُرجى إدخال الاسم";
    if (v.length > NAME_MAX) return `يجب ألا يتجاوز الاسم ${NAME_MAX} حرفًا`;
  }
  if (!v) return "";
  if (name === "bio" && v.length > BIO_MAX) return `يجب ألا تتجاوز النبذة ${BIO_MAX} حرف`;
  if (name === "phone_number") {
    const digits = toLatinDigits(v).replace(/\D/g, "");
    if (!/^\+?[\d\s\-٠-٩]+$/.test(v) || digits.length < 7 || digits.length > 15)
      return "يُرجى إدخال رقم هاتف صحيح، مثل ‎+967 770 000 000";
  }
  if (name === "date_of_birth") {
    const d = new Date(v);
    if (Number.isNaN(d.getTime()) || d > new Date() || d.getFullYear() < 1900) return "يُرجى إدخال تاريخ ميلاد صحيح";
  }
  if (name === "linkedin_link") {
    const url = parseUrl(normalizeUrl(v));
    if (!url || !/(^|\.)linkedin\.com$/i.test(url.hostname))
      return "يُرجى إدخال رابط LinkedIn صحيح، مثل linkedin.com/in/name";
  }
  if (name === "website" && !parseUrl(normalizeUrl(v))) return "يُرجى إدخال رابط صحيح، مثل example.com";
  return "";
}

/**
 * The profile's personal fields, shared by "Complete your profile" and
 * "Edit profile". Every field except the name is optional. Only changed
 * values are sent, since the backend ignores empty ones anyway.
 */
export function ProfileForm({ profileUser, onSaved, submitLabel = "حفظ التغييرات", secondaryAction, showProgress = false }) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const formId = useId();
  const fileRef = useRef(null);

  const [initial] = useState(() => fromProfile(profileUser));
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => () => imagePreview && URL.revokeObjectURL(imagePreview), [imagePreview]);

  const percent = completionPercent({ ...form, imageUrl: imagePreview || profileUser?.imageUrl });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value || name === "name") setErrors((er) => ({ ...er, [name]: validateField(name, value) }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setImageError("يُرجى اختيار صورة بصيغة JPG أو PNG أو GIF أو WEBP");
      return;
    }
    if (file.size > IMAGE_MAX_MB * 1024 * 1024) {
      setImageError(`يجب ألا يتجاوز حجم الصورة ${IMAGE_MAX_MB} ميغابايت`);
      return;
    }
    setImageError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const next = Object.fromEntries(TEXT_FIELDS.map((k) => [k, validateField(k, form[k])]));
    setErrors(next);
    const firstInvalid = TEXT_FIELDS.find((k) => next[k]);
    if (firstInvalid) {
      document.getElementById(`${formId}-${firstInvalid}`)?.focus();
      return;
    }

    const clean = {
      ...form,
      phone_number: toLatinDigits(form.phone_number),
      linkedin_link: normalizeUrl(form.linkedin_link),
      website: normalizeUrl(form.website),
    };
    const fd = new FormData();
    TEXT_FIELDS.forEach((k) => {
      const v = clean[k].trim();
      if (v && v !== initial[k]) fd.append(k, v);
    });
    if (imageFile) fd.append("profileImage", imageFile);
    if (![...fd.keys()].length) {
      onSaved?.(profileUser, { changed: false });
      return;
    }

    setSaving(true);
    try {
      // Let the browser set the multipart boundary; no Content-Type header.
      const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFormError("تعذّر حفظ البيانات. يُرجى المحاولة بعد قليل.");
        return;
      }
      const saved = data.user || {};
      dispatch(updateUser({ name: saved.name ?? clean.name, ...(saved.imageUrl ? { imageUrl: saved.imageUrl } : {}) }));
      toast.success("تم حفظ ملفك الشخصي");
      onSaved?.(saved, { changed: true });
    } catch {
      setFormError("تعذّر الاتصال بالخادم. يُرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const field = (name) => ({
    id: `${formId}-${name}`,
    name,
    value: form[name],
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {showProgress ? (
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-semibold text-text-primary">اكتمال الملف الشخصي</span>
            <span className="num font-display font-bold text-brand-strong">{percent}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="اكتمال الملف الشخصي"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="h-2 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-brand-strong transition-[width] duration-300 ease-[var(--ease-standard)]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      ) : null}

      {formError ? <Callout tone="danger">{formError}</Callout> : null}

      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={form.name} src={imagePreview || profileUser?.imageUrl} size={96} />
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <Camera aria-hidden="true" />
              {imagePreview || profileUser?.imageUrl ? "تغيير الصورة" : "إضافة صورة شخصية"}
            </Button>
            {imagePreview ? (
              <Button variant="tertiary" onClick={clearImage}>
                <X aria-hidden="true" />
                إلغاء
              </Button>
            ) : null}
          </div>
          <p className="text-caption text-text-tertiary">JPG أو PNG أو WEBP، بحد أقصى {IMAGE_MAX_MB} ميغابايت</p>
          {imageError ? (
            <p className="text-label-sm text-danger-700" role="alert">
              {imageError}
            </p>
          ) : null}
          <input
            ref={fileRef}
            type="file"
            accept={IMAGE_TYPES.join(",")}
            onChange={handleImage}
            className="sr-only"
            tabIndex={-1}
            aria-label="الصورة الشخصية"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="الاسم" required error={errors.name} id={`${formId}-name`} className="sm:col-span-2">
          <Input {...field("name")} autoComplete="name" maxLength={NAME_MAX} />
        </Field>
        <Field
          label="نبذة عنك"
          hint="جملتان عن اهتماماتك وما تعمل عليه"
          error={errors.bio}
          id={`${formId}-bio`}
          className="sm:col-span-2"
          count={form.bio.length}
          max={BIO_MAX}
        >
          <Textarea {...field("bio")} maxLength={BIO_MAX} />
        </Field>
        <Field label="رقم الهاتف" error={errors.phone_number} id={`${formId}-phone_number`}>
          <Input {...field("phone_number")} type="tel" dir="ltr" autoComplete="tel" inputMode="tel" />
        </Field>
        <Field label="تاريخ الميلاد" error={errors.date_of_birth} id={`${formId}-date_of_birth`}>
          <Input {...field("date_of_birth")} type="date" max={new Date().toISOString().slice(0, 10)} />
        </Field>
        <Field label="الجنس" error={errors.gender} id={`${formId}-gender`}>
          <Select {...field("gender")}>
            <option value="">اختر</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </Select>
        </Field>
        <Field label="المستوى التعليمي الحالي" error={errors.current_education_level} id={`${formId}-current_education_level`}>
          <Input {...field("current_education_level")} list={`${formId}-education`} />
        </Field>
        <datalist id={`${formId}-education`}>
          {EDUCATION_SUGGESTIONS.map((v) => (
            <option key={v} value={v} />
          ))}
        </datalist>
        <Field label="حساب LinkedIn" error={errors.linkedin_link} id={`${formId}-linkedin_link`}>
          <Input {...field("linkedin_link")} type="url" dir="ltr" inputMode="url" placeholder="linkedin.com/in/…" />
        </Field>
        <Field label="الموقع الشخصي" error={errors.website} id={`${formId}-website`}>
          <Input {...field("website")} type="url" dir="ltr" inputMode="url" autoComplete="url" />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border-subtle pt-5 sm:flex-row sm:items-center sm:justify-end">
        {secondaryAction}
        <Button type="submit" size="lg" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default ProfileForm;
