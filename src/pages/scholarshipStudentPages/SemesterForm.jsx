import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, Trash2 } from "lucide-react";
import { Button, IconButton } from "../../components/ui/Button";
import { Field, Input, Select, RequiredNote } from "../../components/ui/Input";
import { Callout } from "../../components/ui/Feedback";
import { Dialog } from "../../components/ui/Dialog";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { API_BASE_URL } from "../../services/api/config";

const LETTER_GRADES = ["AA", "AB", "BA", "BB", "CB", "CC", "DC", "DD", "FF"];
const FORM_ID = "semester-form";
const EMPTY = { semesterNumber: "", semesterGPA: "", totalGPA: "", courses: [], resultImage: null };
const newCourse = () => ({ courseCode: "", courseName: "", grade: "", credits: "", ects: "", lg: "AA" });

const inRange = (v, min, max) => v !== "" && !Number.isNaN(Number(v)) && Number(v) >= min && Number(v) <= max;

function validate(f) {
  const e = {};
  if (!inRange(f.semesterNumber, 1, 20)) e.semesterNumber = "يُرجى إدخال رقم الفصل (1 أو أكثر)";
  if (!inRange(f.semesterGPA, 0, 4)) e.semesterGPA = "يجب أن يكون المعدل الفصلي بين 0 و4";
  if (!inRange(f.totalGPA, 0, 4)) e.totalGPA = "يجب أن يكون المعدل التراكمي بين 0 و4";
  f.courses.forEach((c, i) => {
    if (!String(c.courseCode).trim()) e[`c${i}-courseCode`] = "يُرجى إدخال كود المادة";
    if (!String(c.courseName).trim()) e[`c${i}-courseName`] = "يُرجى إدخال اسم المادة";
    if (!inRange(c.grade, 0, 100)) e[`c${i}-grade`] = "يجب أن تكون الدرجة بين 0 و100";
    if (!inRange(c.credits, 0, 60)) e[`c${i}-credits`] = "يُرجى إدخال عدد الساعات";
    if (!inRange(c.ects, 0, 60)) e[`c${i}-ects`] = "يُرجى إدخال نقاط ECTS";
  });
  return e;
}

/**
 * Add or edit a semester with its courses. Inside the semester list it is a
 * dialog driven by `onSave` / `onCancel`; opened directly at /semester-create
 * it is a page that saves on its own and returns to the list.
 */
const SemesterForm = ({ initialData, onSave, onCancel }) => {
  const token = useSelector((s) => s.auth.token);
  const navigate = useNavigate();
  const standalone = !onSave;
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...(initialData || {}),
    totalGPA: initialData?.totalGPA ?? initialData?.totalGpa ?? "",
    courses: (initialData?.courses || []).map((c) => ({ ...c })),
  }));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(initialData?._id);

  const update = (next) => {
    setForm(next);
    if (Object.keys(errors).length) setErrors(validate(next));
  };
  const set = (k) => (e) => update({ ...form, [k]: e.target.value });
  const setCourse = (i, k) => (e) =>
    update({ ...form, courses: form.courses.map((c, j) => (j === i ? { ...c, [k]: e.target.value } : c)) });

  const onImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((er) => ({ ...er, resultImage: "حجم الصورة أكبر من 5 ميغابايت. يُرجى اختيار صورة أصغر." }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((f) => ({ ...f, resultImage: reader.result }));
      setErrors((er) => ({ ...er, resultImage: "" }));
    };
    reader.readAsDataURL(file);
  };

  const close = () => (standalone ? navigate("/semester-list") : onCancel?.());

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setFormError("");
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`sem-${first}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      if (standalone) {
        await axios.post(`${API_BASE_URL}/semester`, form, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("تمت إضافة الفصل الدراسي");
        navigate("/semester-list");
      } else {
        await onSave(form);
      }
    } catch (err) {
      setFormError(err?.response?.data?.message || "تعذّر حفظ الفصل الدراسي ولم يُحفظ. يُرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const fields = (
    <form id={FORM_ID} onSubmit={submit} noValidate className="space-y-6">
      {formError ? <Callout tone="danger">{formError}</Callout> : null}
      <RequiredNote />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field label="رقم الفصل" required error={errors.semesterNumber} id="sem-semesterNumber">
          <Input type="number" inputMode="numeric" min="1" value={form.semesterNumber} onChange={set("semesterNumber")} dir="ltr" />
        </Field>
        <Field label="المعدل الفصلي" hint="من 4.00" required error={errors.semesterGPA} id="sem-semesterGPA">
          <Input type="number" inputMode="decimal" step="0.01" min="0" max="4" value={form.semesterGPA} onChange={set("semesterGPA")} dir="ltr" />
        </Field>
        <Field label="المعدل التراكمي" hint="من 4.00" required error={errors.totalGPA} id="sem-totalGPA">
          <Input type="number" inputMode="decimal" step="0.01" min="0" max="4" value={form.totalGPA} onChange={set("totalGPA")} dir="ltr" />
        </Field>
      </div>

      <Field label="صورة كشف النتيجة" hint="JPG أو PNG أو WebP، حتى 5 ميغابايت" error={errors.resultImage} id="sem-resultImage">
        <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={onImage} />
      </Field>
      {form.resultImage ? (
        <img src={form.resultImage} alt="معاينة كشف النتيجة" className="max-h-40 w-auto rounded-md border border-border-default" />
      ) : null}

      <fieldset className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <legend className="text-heading-4 text-text-primary">المواد الدراسية</legend>
          <Button variant="secondary" size="sm" onClick={() => update({ ...form, courses: [...form.courses, newCourse()] })}>
            <Plus aria-hidden="true" /> إضافة مادة
          </Button>
        </div>
        {form.courses.length === 0 ? (
          <p className="rounded-md bg-subtle px-4 py-3 text-sm text-text-secondary">لم تُضف مواد بعد.</p>
        ) : null}
        {form.courses.map((c, i) => (
          <div key={i} className="rounded-lg border border-border-default p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-label-md text-text-primary">
                المادة <span className="num">{i + 1}</span>
              </p>
              <IconButton
                label={`حذف المادة ${i + 1}`}
                size="sm"
                tone="danger"
                onClick={() => update({ ...form, courses: form.courses.filter((_, j) => j !== i) })}
              >
                <Trash2 />
              </IconButton>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="كود المادة" hint="مثال: CS101" required error={errors[`c${i}-courseCode`]} id={`sem-c${i}-courseCode`}>
                <Input value={c.courseCode} onChange={setCourse(i, "courseCode")} dir="ltr" />
              </Field>
              <Field label="اسم المادة" required error={errors[`c${i}-courseName`]} id={`sem-c${i}-courseName`}>
                <Input value={c.courseName} onChange={setCourse(i, "courseName")} dir="auto" />
              </Field>
              <Field label="الدرجة" hint="من 100" required error={errors[`c${i}-grade`]} id={`sem-c${i}-grade`}>
                <Input type="number" inputMode="decimal" min="0" max="100" value={c.grade} onChange={setCourse(i, "grade")} dir="ltr" />
              </Field>
              <Field label="الساعات" required error={errors[`c${i}-credits`]} id={`sem-c${i}-credits`}>
                <Input type="number" inputMode="numeric" min="0" value={c.credits} onChange={setCourse(i, "credits")} dir="ltr" />
              </Field>
              <Field label="ECTS" required error={errors[`c${i}-ects`]} id={`sem-c${i}-ects`}>
                <Input type="number" inputMode="numeric" min="0" value={c.ects} onChange={setCourse(i, "ects")} dir="ltr" />
              </Field>
              <Field label="التقدير" id={`sem-c${i}-lg`}>
                <Select value={c.lg} onChange={setCourse(i, "lg")} dir="ltr">
                  {LETTER_GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </div>
        ))}
      </fieldset>
    </form>
  );

  const actions = (
    <>
      <Button variant="secondary" onClick={close} disabled={saving}>
        إلغاء
      </Button>
      <Button type="submit" form={FORM_ID} loading={saving}>
        {isEdit ? "حفظ التغييرات" : "إضافة الفصل"}
      </Button>
    </>
  );

  if (standalone) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="إضافة فصل دراسي"
          breadcrumbs={[{ label: "السجل الأكاديمي", to: "/semester-list" }, { label: "إضافة فصل دراسي" }]}
        />
        <Card className="max-w-4xl">
          <CardContent className="pt-5 sm:pt-6">
            {fields}
            <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-border-subtle pt-4">{actions}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Dialog open title={isEdit ? `تعديل الفصل ${initialData.semesterNumber}` : "إضافة فصل دراسي"} size="lg" onClose={close} busy={saving} footer={actions}>
      {fields}
    </Dialog>
  );
};

export default SemesterForm;
