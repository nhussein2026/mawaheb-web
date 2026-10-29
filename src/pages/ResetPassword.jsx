import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Field, Input } from "../components/ui/Input";
import { Callout } from "../components/ui/Feedback";
import { AuthCard, authLinkCls } from "../components/ui/AuthCard";
import { API_BASE_URL } from "../services/api/config";

function ResetPassword() {
  const { token } = useParams();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (f) => ({
    password: !f.password
      ? "يُرجى إدخال كلمة المرور الجديدة"
      : f.password.length < 6
        ? "يجب أن تكون كلمة المرور من 6 أحرف على الأقل"
        : "",
    confirm: !f.confirm ? "يُرجى تأكيد كلمة المرور" : f.confirm !== f.password ? "كلمتا المرور غير متطابقتين" : "",
  });

  const onChange = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    if (errors[e.target.name]) setErrors(validate(next));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    setFormError("");
    if (next.password || next.confirm) {
      document.getElementById(next.password ? "reset-password" : "reset-confirm")?.focus();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: form.password }),
      });
      if (response.ok) {
        setDone(true);
      } else if (response.status >= 500) {
        // The backend answers an expired or malformed link with 500 (report L1).
        setFormError("انتهت صلاحية رابط إعادة التعيين أو أنه غير صالح. يُرجى طلب رابط جديد.");
      } else {
        const data = await response.json().catch(() => ({}));
        setFormError(data.message || "تعذّر إعادة تعيين كلمة المرور. يُرجى طلب رابط جديد.");
      }
    } catch {
      setFormError("تعذّر الاتصال بالخادم. يُرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="تعيين كلمة مرور جديدة"
      footer={
        <Link to="/login" className={authLinkCls}>
          العودة إلى تسجيل الدخول
        </Link>
      }
    >
      {done ? (
        <Callout
          tone="success"
          title="تم تغيير كلمة المرور"
          action={
            <Link to="/login" className={authLinkCls}>
              تسجيل الدخول
            </Link>
          }
        >
          يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.
        </Callout>
      ) : (
        <>
          {formError ? (
            <Callout
              tone="danger"
              className="mb-5"
              action={
                <Link to="/forgot-password" className={authLinkCls}>
                  طلب رابط جديد
                </Link>
              }
            >
              {formError}
            </Callout>
          ) : null}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Field label="كلمة المرور الجديدة" hint="6 أحرف على الأقل" error={errors.password} id="reset-password">
              <Input type="password" name="password" dir="ltr" autoComplete="new-password" value={form.password} onChange={onChange} />
            </Field>
            <Field label="تأكيد كلمة المرور" error={errors.confirm} id="reset-confirm">
              <Input type="password" name="confirm" dir="ltr" autoComplete="new-password" value={form.confirm} onChange={onChange} />
            </Field>
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              حفظ كلمة المرور
            </Button>
          </form>
        </>
      )}
    </AuthCard>
  );
}

export default ResetPassword;
