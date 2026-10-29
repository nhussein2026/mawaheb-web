import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components/ui/Button";
import { Field, Input, RequiredNote } from "../components/ui/Input";
import { Callout } from "../components/ui/Feedback";
import { AuthCard, authLinkCls } from "../components/ui/AuthCard";
import { API_BASE_URL } from "../services/api/config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (name, value) => {
  if (name === "name") {
    if (!value.trim()) return "يُرجى إدخال الاسم الكامل";
    if (value.trim().length < 2) return "يجب أن يكون الاسم من حرفين على الأقل";
  }
  if (name === "email") {
    if (!value.trim()) return "يُرجى إدخال البريد الإلكتروني";
    if (!EMAIL_RE.test(value.trim())) return "يُرجى إدخال بريد إلكتروني صحيح، مثل name@example.com";
  }
  if (name === "password") {
    if (!value) return "يُرجى إدخال كلمة المرور";
    if (value.length < 6) return "يجب أن تكون كلمة المرور من 6 أحرف على الأقل";
  }
  return "";
};

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: validate(name, value) }));
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    if (value) setErrors((er) => ({ ...er, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = Object.fromEntries(Object.keys(form).map((k) => [k, validate(k, form[k])]));
    setErrors(next);
    setFormError("");
    const firstBad = Object.keys(next).find((k) => next[k]);
    if (firstBad) {
      document.getElementById(`signup-${firstBad}`)?.focus();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form.name.trim(), email: form.email.trim().toLowerCase() }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        toast.success("تم إنشاء الحساب. يمكنك تسجيل الدخول الآن.");
        navigate("/login");
      } else {
        setFormError(data.message || "تعذّر إنشاء الحساب. يُرجى مراجعة البيانات والمحاولة مرة أخرى.");
      }
    } catch {
      setFormError("تعذّر الاتصال بالخادم. يُرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="إنشاء حساب"
      description="أنشئ حسابك للانضمام إلى منصة مواهب"
      footer={
        <>
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className={authLinkCls}>
            تسجيل الدخول
          </Link>
        </>
      }
    >
      {formError ? (
        <Callout tone="danger" className="mb-5">
          {formError}
        </Callout>
      ) : null}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <RequiredNote />
        <Field label="الاسم الكامل" required error={errors.name} id="signup-name">
          <Input name="name" autoComplete="name" value={form.name} onChange={onChange} onBlur={onBlur} />
        </Field>
        <Field label="البريد الإلكتروني" required error={errors.email} id="signup-email">
          <Input
            type="email"
            name="email"
            dir="ltr"
            inputMode="email"
            autoComplete="email"
            value={form.email}
            onChange={onChange}
            onBlur={onBlur}
          />
        </Field>
        <Field
          label="كلمة المرور"
          required
          hint="6 أحرف على الأقل"
          error={errors.password}
          id="signup-password"
        >
          <Input
            type="password"
            name="password"
            dir="ltr"
            autoComplete="new-password"
            value={form.password}
            onChange={onChange}
            onBlur={onBlur}
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          إنشاء الحساب
        </Button>
      </form>
    </AuthCard>
  );
};

export default Signup;
