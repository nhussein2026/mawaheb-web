import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Field, Input, Select, RequiredNote } from "../../components/ui/Input";
import { Callout, EmptyState, SkeletonCard } from "../../components/ui/Feedback";
import { useResource } from "../../hooks/useResource";
import { API_BASE_URL } from "../../services/api/config";
import { formatDateTime } from "../../utils/format";

const EMPTY = {
  country_of_studying: "",
  city: "",
  university: "",
  type_of_university: "",
  program_of_study: "",
  student_university_id: "",
  enrollment_year: "",
  expected_graduation_year: "",
};

const UNI_TYPES = { Public: "حكومية", Private: "أهلية" };

const FIELDS = [
  { name: "country_of_studying", label: "دولة الدراسة", hint: "مثال: تركيا" },
  { name: "city", label: "المدينة", hint: "مثال: إسطنبول" },
  { name: "university", label: "الجامعة" },
  { name: "type_of_university", label: "نوع الجامعة", type: "select" },
  { name: "program_of_study", label: "التخصص", hint: "مثال: هندسة البرمجيات" },
  { name: "student_university_id", label: "الرقم الجامعي", ltr: true },
  { name: "enrollment_year", label: "سنة الالتحاق", type: "year" },
  { name: "expected_graduation_year", label: "سنة التخرج المتوقعة", type: "year" },
];

function validate(f) {
  const e = {};
  FIELDS.forEach(({ name, label, type }) => {
    const v = String(f[name] ?? "").trim();
    if (!v) e[name] = type === "select" ? `يُرجى اختيار ${label}` : `يُرجى إدخال ${label}`;
    else if (type === "year" && !/^(19|20)\d{2}$/.test(v)) e[name] = "يُرجى إدخال سنة من أربعة أرقام، مثل 2024";
  });
  if (!e.enrollment_year && !e.expected_graduation_year && Number(f.expected_graduation_year) < Number(f.enrollment_year))
    e.expected_graduation_year = "يجب أن تكون سنة التخرج بعد سنة الالتحاق أو مساوية لها";
  return e;
}

// Scholarship record (W2 "Update student information"): one record shown as
// a description list; Edit turns the card into a form with its own Save and
// Cancel. Without a record, the form starts open to create one.
const ScholarshipStudent = () => {
  const token = useSelector((state) => state.auth.token);
  const headers = { Authorization: `Bearer ${token}` };
  const { data: records, status, reload } = useResource(
    () => axios.get(`${API_BASE_URL}/scholarship-student`, { headers }),
    [token],
    { initial: [], select: (res) => (Array.isArray(res?.data) ? res.data : []) }
  );
  const record = records[0];

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setForm(record ? Object.fromEntries(Object.keys(EMPTY).map((k) => [k, record[k] ?? ""])) : EMPTY);
    setErrors({});
    setFormError("");
    setEditing(true);
  };

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
    const first = FIELDS.find((f) => found[f.name]);
    if (first) {
      document.getElementById(`sch-${first.name}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      if (record) await axios.put(`${API_BASE_URL}/scholarship-student/${record._id}`, form, { headers });
      else await axios.post(`${API_BASE_URL}/scholarship-student`, form, { headers });
      toast.success(record ? "تم حفظ التغييرات" : "تم إنشاء سجل المنحة");
      setEditing(false);
      reload();
    } catch (err) {
      setFormError(err?.response?.data?.message || "تعذّر حفظ البيانات ولم تُحفظ. يُرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const showForm = editing || (status === "ready" && !record);

  return (
    <div className="space-y-6">
      <PageHeader title="بيانات المنحة" description="جامعتك وتخصصك وسنوات دراستك. لكل طالب سجل منحة واحد." />

      {status === "loading" ? (
        <SkeletonCard lines={6} />
      ) : status === "failed" ? (
        <Card>
          <EmptyState kind="failed" title="تعذّر تحميل بيانات المنحة" onRetry={reload} />
        </Card>
      ) : showForm ? (
        <Card className="max-w-[720px]">
          <CardHeader>
            <CardTitle>{record ? "تعديل بيانات المنحة" : "إنشاء سجل المنحة"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} noValidate className="space-y-4">
              {formError ? <Callout tone="danger">{formError}</Callout> : null}
              <RequiredNote />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {FIELDS.map((f) => (
                  <Field key={f.name} label={f.label} hint={f.hint} required error={errors[f.name]} id={`sch-${f.name}`}>
                    {f.type === "select" ? (
                      <Select value={form[f.name]} onChange={set(f.name)}>
                        <option value="">اختر النوع</option>
                        {Object.entries(UNI_TYPES).map(([v, l]) => (
                          <option key={v} value={v}>
                            {l}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        value={form[f.name]}
                        onChange={set(f.name)}
                        inputMode={f.type === "year" ? "numeric" : undefined}
                        maxLength={f.type === "year" ? 4 : undefined}
                        dir={f.type === "year" || f.ltr ? "ltr" : "auto"}
                      />
                    )}
                  </Field>
                ))}
              </div>
              <div className="flex flex-wrap justify-end gap-2 border-t border-border-subtle pt-4">
                {record ? (
                  <Button variant="secondary" onClick={() => setEditing(false)} disabled={saving}>
                    إلغاء
                  </Button>
                ) : null}
                <Button type="submit" loading={saving}>
                  {record ? "حفظ التغييرات" : "إنشاء السجل"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-[720px]">
          <CardHeader
            actions={
              <Button variant="tertiary" size="sm" onClick={startEdit}>
                <Pencil aria-hidden="true" /> تعديل
              </Button>
            }
          >
            <CardTitle>سجل المنحة</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border-subtle">
              {FIELDS.map((f) => {
                const raw = record[f.name];
                const value = f.type === "select" ? UNI_TYPES[raw] || raw : raw;
                return (
                  <div key={f.name} className="grid gap-0.5 py-3 md:grid-cols-[35%_1fr] md:gap-3">
                    <dt className="text-sm text-text-tertiary">{f.label}</dt>
                    <dd className={f.type === "year" ? "num text-sm text-text-primary" : "text-sm text-text-primary"} dir="auto">
                      {value || "—"}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </CardContent>
          {record.updatedAt ? (
            <CardFooter>
              <span className="num">آخر تحديث {formatDateTime(record.updatedAt)}</span>
            </CardFooter>
          ) : null}
        </Card>
      )}
    </div>
  );
};

export default ScholarshipStudent;
