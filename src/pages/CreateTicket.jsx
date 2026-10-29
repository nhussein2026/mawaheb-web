import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Field, Input, Textarea, RequiredNote } from "../components/ui/Input";
import { Callout } from "../components/ui/Feedback";
import { API_BASE_URL } from "../services/api/config";

const CreateTicket = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (f) => ({
    title: f.title.trim() ? "" : "يُرجى إدخال عنوان التذكرة",
    description: f.description.trim() ? "" : "يُرجى وصف المشكلة",
  });

  const set = (k) => (e) => {
    const next = { ...form, [k]: e.target.value };
    setForm(next);
    if (errors[k]) setErrors(validate(next));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    setFormError("");
    if (found.title || found.description) {
      document.getElementById(found.title ? "ticket-title" : "ticket-desc")?.focus();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        toast.success("تم إرسال التذكرة");
        navigate("/ticket-list");
      } else {
        setFormError("تعذّر إرسال التذكرة. يُرجى المحاولة مرة أخرى.");
      }
    } catch {
      setFormError("تعذّر الاتصال بالخادم ولم تُرسل التذكرة. يُرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="فتح تذكرة دعم"
        description="اشرح مشكلتك وسيرد عليك فريق الدعم في أقرب وقت."
        breadcrumbs={[{ label: "التذاكر والدعم", to: "/student/tickets" }, { label: "فتح تذكرة دعم" }]}
      />
      <Card className="max-w-[720px]">
        <CardContent className="pt-5 sm:pt-6">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {formError ? <Callout tone="danger">{formError}</Callout> : null}
            <RequiredNote />
            <Field label="عنوان التذكرة" hint="مثال: مشكلة في رفع التقرير" required error={errors.title} id="ticket-title">
              <Input value={form.title} onChange={set("title")} dir="auto" />
            </Field>
            <Field label="وصف المشكلة" required error={errors.description} id="ticket-desc">
              <Textarea rows={5} value={form.description} onChange={set("description")} dir="auto" />
            </Field>
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="secondary" onClick={() => navigate(-1)} disabled={loading}>
                إلغاء
              </Button>
              <Button type="submit" loading={loading}>
                إرسال التذكرة
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTicket;
