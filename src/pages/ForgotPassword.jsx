import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Field, Input } from "../components/ui/Input";
import { Callout } from "../components/ui/Feedback";
import { AuthCard, authLinkCls } from "../components/ui/AuthCard";
import { API_BASE_URL } from "../services/api/config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password reset request. The confirmation never reveals whether an account
// exists for the address.
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (v) =>
    !v.trim() ? "يُرجى إدخال البريد الإلكتروني" : !EMAIL_RE.test(v.trim()) ? "يُرجى إدخال بريد إلكتروني صحيح، مثل name@example.com" : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(email);
    setError(err);
    setFormError("");
    if (err) {
      document.getElementById("forgot-email")?.focus();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-Password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (response.ok || response.status === 404) setSent(true);
      else setFormError("حدث خطأ من جهتنا ولم يُرسل الرابط. يُرجى المحاولة بعد قليل.");
    } catch {
      setFormError("تعذّر الاتصال بالخادم. يُرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="استعادة كلمة المرور"
      description="أدخل بريدك الإلكتروني لنرسل إليك رابط إعادة التعيين"
      footer={
        <Link to="/login" className={authLinkCls}>
          العودة إلى تسجيل الدخول
        </Link>
      }
    >
      {sent ? (
        <Callout tone="success" title="تحقق من بريدك الإلكتروني">
          إن كان هناك حساب مرتبط بالعنوان <bdi className="font-semibold">{email.trim()}</bdi>، فستصلك رسالة فيها رابط
          لإعادة تعيين كلمة المرور خلال دقائق.
        </Callout>
      ) : (
        <>
          {formError ? (
            <Callout tone="danger" className="mb-5">
              {formError}
            </Callout>
          ) : null}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Field label="البريد الإلكتروني" error={error} id="forgot-email">
              <Input
                type="email"
                dir="ltr"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(validate(e.target.value));
                }}
                onBlur={(e) => e.target.value && setError(validate(e.target.value))}
              />
            </Field>
            <Button type="submit" size="lg" className="w-full" loading={loading}>
              إرسال الرابط
            </Button>
          </form>
        </>
      )}
    </AuthCard>
  );
};

export default ForgotPassword;
