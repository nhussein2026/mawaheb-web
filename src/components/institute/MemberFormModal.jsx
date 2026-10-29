import React, { useState } from "react";
import { toast } from "react-toastify";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Field, Input, Select, Textarea, RequiredNote } from "../ui/Input";
import { Callout } from "../ui/Feedback";
import instituteApi from "../../services/api/instituteApi";
import {
  INSTITUTE_ROLE_OPTIONS,
  ACADEMIC_LEVEL_OPTIONS,
  SEAT_TYPE_OPTIONS,
} from "../../constants/institute";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORM_ID = "member-form";

const fieldsetCls = "grid grid-cols-1 gap-4 md:grid-cols-2";
const legendCls = "mb-3 text-heading-4 text-text-primary";

// Add/edit member. The student academic & financial block appears only when
// the selected rank is "student". Errors show at each field and in a summary
// at the top; nothing typed is lost on a failed save.
const MemberFormModal = ({ member, onClose, onSaved }) => {
  const isEdit = !!member;
  const p = member?.studentProfile || {};

  const [form, setForm] = useState({
    name: member?.name || "",
    full_name_en: member?.full_name_en || "",
    email: member?.email || "",
    username: member?.username || "",
    password: "",
    instituteRole: member?.instituteRole || "student",
    phone_number: member?.phone_number || "",
    bio: member?.bio || "",
    academicNumber: p.academicNumber || "",
    batch: p.batch || "",
    level: p.level || "",
    seatType: p.seatType || "free",
    ideasBankBalance: p.ideasBankBalance ?? 0,
    governorate: p.governorate || "",
    district: p.district || "",
    guardianName: p.guardianName || "",
    guardianMobile: p.guardianMobile || "",
    guardianPin: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const isStudent = form.instituteRole === "student";

  const validate = (f) => {
    const e = {};
    if (!f.name.trim()) e.name = "يُرجى إدخال الاسم الكامل";
    if (!f.email.trim()) e.email = "يُرجى إدخال البريد الإلكتروني";
    else if (!EMAIL_RE.test(f.email.trim())) e.email = "يُرجى إدخال بريد إلكتروني صحيح، مثل name@example.com";
    if (!f.username.trim()) e.username = "يُرجى إدخال اسم المستخدم";
    if (!isEdit && !f.password) e.password = "يُرجى إدخال كلمة المرور";
    return e;
  };

  const set = (k) => (e) => {
    const next = { ...form, [k]: e.target.value };
    setForm(next);
    if (errors[k]) setErrors((er) => ({ ...er, [k]: validate(next)[k] }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length) {
      document.getElementById("member-errors")?.focus();
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, email: form.email.trim().toLowerCase() };
      if (isEdit && !payload.password) delete payload.password;
      if (isEdit && !payload.guardianPin) delete payload.guardianPin;
      if (isEdit) await instituteApi.updateMember(member._id, payload);
      else await instituteApi.createMember(payload);
      toast.success(isEdit ? "تم حفظ التغييرات" : "تمت إضافة العضو");
      onSaved();
    } catch (err) {
      setFormError(err?.response?.data?.message || "تعذّر حفظ بيانات العضو. يُرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const errorList = Object.entries(errors).filter(([, v]) => v);

  return (
    <Dialog
      title={isEdit ? `تعديل بيانات ${member.name}` : "إضافة عضو"}
      onClose={onClose}
      size="lg"
      busy={saving}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            إلغاء
          </Button>
          <Button type="submit" form={FORM_ID} loading={saving}>
            {isEdit ? "حفظ التغييرات" : "إضافة العضو"}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={submit} noValidate className="space-y-6">
        {errorList.length ? (
          <div id="member-errors" tabIndex={-1} className="outline-none">
            <Callout tone="danger" title={`يوجد ${errorList.length === 1 ? "خطأ واحد يجب" : `${errorList.length} أخطاء يجب`} تصحيحها`}>
              <ul className="mt-1 list-disc ps-5">
                {errorList.map(([k, msg]) => (
                  <li key={k}>
                    <a href={`#m-${k}`} className="underline underline-offset-4">
                      {msg}
                    </a>
                  </li>
                ))}
              </ul>
            </Callout>
          </div>
        ) : null}
        {formError ? <Callout tone="danger">{formError}</Callout> : null}
        <RequiredNote />

        <fieldset>
          <legend className={legendCls}>بيانات الحساب</legend>
          <div className={fieldsetCls}>
            <Field label="الاسم الكامل بالعربية" required error={errors.name} id="m-name">
              <Input value={form.name} onChange={set("name")} autoComplete="name" />
            </Field>
            <Field label="الاسم الكامل بالإنجليزية" id="m-name-en">
              <Input value={form.full_name_en} onChange={set("full_name_en")} dir="ltr" />
            </Field>
            <Field label="البريد الإلكتروني" required error={errors.email} id="m-email">
              <Input type="email" value={form.email} onChange={set("email")} dir="ltr" inputMode="email" autoComplete="email" />
            </Field>
            <Field
              label="اسم المستخدم"
              required
              hint={isEdit ? "لا يمكن تعديل اسم المستخدم بعد الإنشاء" : undefined}
              error={errors.username}
              id="m-username"
            >
              <Input value={form.username} onChange={set("username")} readOnly={isEdit} dir="ltr" autoComplete="off" />
            </Field>
            <Field
              label="كلمة المرور"
              required={!isEdit}
              hint={isEdit ? "اتركها فارغة للإبقاء على كلمة المرور الحالية" : undefined}
              error={errors.password}
              id="m-password"
            >
              <Input type="password" value={form.password} onChange={set("password")} dir="ltr" autoComplete="new-password" />
            </Field>
            <Field label="رتبة العضوية" required id="m-role">
              <Select value={form.instituteRole} onChange={set("instituteRole")}>
                {INSTITUTE_ROLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="رقم الجوال" hint="مثال: 771234567" id="m-phone">
              <Input value={form.phone_number} onChange={set("phone_number")} dir="ltr" inputMode="tel" autoComplete="tel" />
            </Field>
            <Field label="نبذة" className="md:col-span-2" id="m-bio">
              <Textarea rows={2} value={form.bio} onChange={set("bio")} />
            </Field>
          </div>
        </fieldset>

        {isStudent ? (
          <>
            <fieldset>
              <legend className={legendCls}>البيانات الأكاديمية والمالية</legend>
              <div className={fieldsetCls}>
                <Field label="الرقم الأكاديمي" id="m-acad">
                  <Input value={form.academicNumber} onChange={set("academicNumber")} dir="ltr" />
                </Field>
                <Field label="الدفعة" id="m-batch">
                  <Input value={form.batch} onChange={set("batch")} dir="ltr" />
                </Field>
                <Field label="المستوى الأكاديمي" id="m-level">
                  <Select value={form.level} onChange={set("level")}>
                    <option value="">اختر المستوى</option>
                    {ACADEMIC_LEVEL_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="نوع المقعد" id="m-seat">
                  <Select value={form.seatType} onChange={set("seatType")}>
                    {SEAT_TYPE_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="رصيد بنك الأفكار" id="m-ideas">
                  <Input type="number" inputMode="decimal" value={form.ideasBankBalance} onChange={set("ideasBankBalance")} dir="ltr" />
                </Field>
                <Field label="المحافظة" id="m-gov">
                  <Input value={form.governorate} onChange={set("governorate")} />
                </Field>
                <Field label="المديرية" id="m-district">
                  <Input value={form.district} onChange={set("district")} />
                </Field>
              </div>
            </fieldset>
            <fieldset>
              <legend className={legendCls}>ولي الأمر</legend>
              <div className={fieldsetCls}>
                <Field label="اسم ولي الأمر" id="m-gname">
                  <Input value={form.guardianName} onChange={set("guardianName")} />
                </Field>
                <Field label="جوال ولي الأمر" hint="مثال: 771234567" id="m-gmobile">
                  <Input value={form.guardianMobile} onChange={set("guardianMobile")} dir="ltr" inputMode="tel" />
                </Field>
                <Field
                  label="رمز ولي الأمر"
                  hint={isEdit ? "اتركه فارغًا للإبقاء على الرمز الحالي" : "يستخدمه ولي الأمر لتسجيل الدخول إلى بوابته"}
                  id="m-gpin"
                >
                  <Input type="password" value={form.guardianPin} onChange={set("guardianPin")} dir="ltr" autoComplete="new-password" />
                </Field>
              </div>
            </fieldset>
          </>
        ) : null}
      </form>
    </Dialog>
  );
};

export default MemberFormModal;
