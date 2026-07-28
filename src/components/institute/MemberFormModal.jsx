import React, { useState } from "react";
import { toast } from "react-toastify";
import { X, Save, GraduationCap } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import instituteApi from "../../services/api/instituteApi";
import {
  INSTITUTE_ROLE_OPTIONS,
  ACADEMIC_LEVEL_OPTIONS,
  SEAT_TYPE_OPTIONS,
} from "../../constants/institute";

const selectCls =
  "flex h-9 w-full rounded-md border-[0.5px] border-border-default bg-neutral-50 px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600";
const labelCls = "mb-1 block text-xs font-medium text-text-secondary";

// Add/edit member form. Student academic & financial block appears only when
// the selected rank is "student" (spec §3).
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
    // student block
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
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const isStudent = form.instituteRole === "student";

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.username) {
      toast.warn("الاسم والبريد واسم المستخدم مطلوبة");
      return;
    }
    if (!isEdit && !form.password) {
      toast.warn("كلمة المرور مطلوبة عند الإنشاء");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      if (isEdit && !payload.password) delete payload.password;
      if (isEdit && !payload.guardianPin) delete payload.guardianPin;

      if (isEdit) {
        await instituteApi.updateMember(member._id, payload);
        toast.success("تم تحديث بيانات العضو");
      } else {
        await instituteApi.createMember(payload);
        toast.success("تم حفظ بيانات العضو");
      }
      onSaved();
    } catch (err) {
      toast.error(err?.response?.data?.message || "تعذر حفظ العضو");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/50 p-4" dir="rtl">
      <div className="my-8 w-full max-w-3xl rounded-2xl bg-surface-card shadow-xl">
        <div className="flex items-center justify-between border-b-[0.5px] border-border-subtle px-6 py-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {isEdit ? `تعديل بيانات العضو: ${member.name}` : "➕ إضافة عضو جديد"}
          </h2>
          <button onClick={onClose} className="rounded-md p-1.5 text-text-secondary hover:bg-neutral-100"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={submit} className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>الاسم الكامل (العربي) *</label>
              <Input value={form.name} onChange={set("name")} />
            </div>
            <div>
              <label className={labelCls}>الاسم الكامل (بالإنجليزية)</label>
              <Input value={form.full_name_en} onChange={set("full_name_en")} dir="ltr" />
            </div>
            <div>
              <label className={labelCls}>البريد الإلكتروني *</label>
              <Input type="email" value={form.email} onChange={set("email")} dir="ltr" />
            </div>
            <div>
              <label className={labelCls}>اسم المستخدم * {isEdit && <span className="text-text-muted">(لا يمكن تعديله)</span>}</label>
              <Input value={form.username} onChange={set("username")} disabled={isEdit} dir="ltr" />
            </div>
            <div>
              <label className={labelCls}>كلمة المرور {isEdit ? "(اتركها فارغة للإبقاء)" : "*"}</label>
              <Input type="password" value={form.password} onChange={set("password")} dir="ltr" />
            </div>
            <div>
              <label className={labelCls}>رتبة العضوية *</label>
              <select className={selectCls} value={form.instituteRole} onChange={set("instituteRole")}>
                {INSTITUTE_ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>رقم جوال العضو</label>
              <Input value={form.phone_number} onChange={set("phone_number")} dir="ltr" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>نبذة</label>
              <textarea className={`${selectCls} h-auto py-2`} rows={2} value={form.bio} onChange={set("bio")} />
            </div>
          </div>

          {isStudent && (
            <div className="rounded-xl border-[0.5px] border-brand-200 bg-brand-50/40 p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-700">
                <GraduationCap className="h-4 w-4" /> تفاصيل الطالب الأكاديمية والمالية
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={labelCls}>الرقم الأكاديمي</label>
                  <Input value={form.academicNumber} onChange={set("academicNumber")} dir="ltr" />
                </div>
                <div>
                  <label className={labelCls}>الدفعة المربوط بها</label>
                  <Input value={form.batch} onChange={set("batch")} dir="ltr" />
                </div>
                <div>
                  <label className={labelCls}>تصنيف المستوى</label>
                  <select className={selectCls} value={form.level} onChange={set("level")}>
                    <option value="">-- اختر المستوى --</option>
                    {ACADEMIC_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>نوع المقعد الدراسي</label>
                  <select className={selectCls} value={form.seatType} onChange={set("seatType")}>
                    {SEAT_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>رصيد بنك الأفكار</label>
                  <Input type="number" value={form.ideasBankBalance} onChange={set("ideasBankBalance")} dir="ltr" />
                </div>
                <div>
                  <label className={labelCls}>المحافظة</label>
                  <Input value={form.governorate} onChange={set("governorate")} />
                </div>
                <div>
                  <label className={labelCls}>المديرية</label>
                  <Input value={form.district} onChange={set("district")} />
                </div>
                <div>
                  <label className={labelCls}>اسم ولي الأمر</label>
                  <Input value={form.guardianName} onChange={set("guardianName")} />
                </div>
                <div>
                  <label className={labelCls}>جوال ولي الأمر</label>
                  <Input value={form.guardianMobile} onChange={set("guardianMobile")} dir="ltr" />
                </div>
                <div>
                  <label className={labelCls}>رمز سر ولي الأمر {isEdit && <span className="text-text-muted">(اتركه فارغاً للإبقاء)</span>}</label>
                  <Input type="password" value={form.guardianPin} onChange={set("guardianPin")} dir="ltr" />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t-[0.5px] border-border-subtle pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
            <Button type="submit" disabled={saving}>
              <Save className="ml-1.5 h-4 w-4" /> حفظ بيانات العضو
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberFormModal;
