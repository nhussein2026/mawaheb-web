import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Field, Input } from "../../components/ui/Input";
import { Callout } from "../../components/ui/Feedback";
import { AuthCard } from "../../components/ui/AuthCard";
import guardianApi, { isGuardianLoggedIn } from "../../services/api/guardianApi";

const GuardianLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ academicNumber: "", pin: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isGuardianLoggedIn()) return <Navigate to="/guardian" replace />;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name] && value.trim()) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {
      academicNumber: form.academicNumber.trim() ? "" : "يُرجى إدخال الرقم الأكاديمي للطالب",
      pin: form.pin.trim() ? "" : "يُرجى إدخال رمز ولي الأمر",
    };
    setErrors(next);
    setFormError("");
    if (next.academicNumber || next.pin) {
      document.getElementById(next.academicNumber ? "g-number" : "g-pin")?.focus();
      return;
    }
    setLoading(true);
    try {
      await guardianApi.login(form.academicNumber.trim(), form.pin.trim());
      navigate("/guardian", { replace: true });
    } catch (err) {
      setFormError(
        err?.response?.status >= 500 || !err?.response
          ? "تعذّر الاتصال بالخادم. يُرجى المحاولة بعد قليل."
          : "الرقم الأكاديمي أو رمز ولي الأمر غير صحيح. يُرجى المحاولة مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-canvas" dir="rtl" lang="ar">
      <AuthCard title="بوابة ولي الأمر" description="للاطلاع على نتائج الطالب وتقاريره في معهد حضرموت للموهوبين">
        {formError ? (
          <Callout tone="danger" className="mb-5">
            {formError}
          </Callout>
        ) : null}
        <form onSubmit={submit} noValidate className="space-y-4">
          <Field label="الرقم الأكاديمي للطالب" hint="مثال: 1101" error={errors.academicNumber} id="g-number">
            <Input
              name="academicNumber"
              value={form.academicNumber}
              onChange={onChange}
              dir="ltr"
              inputMode="numeric"
              autoComplete="username"
            />
          </Field>
          <Field label="رمز ولي الأمر" error={errors.pin} id="g-pin">
            <Input
              type="password"
              name="pin"
              value={form.pin}
              onChange={onChange}
              dir="ltr"
              autoComplete="current-password"
            />
          </Field>
          <Button type="submit" size="lg" loading={loading} className="w-full">
            تسجيل الدخول
          </Button>
        </form>
      </AuthCard>
    </div>
  );
};

export default GuardianLogin;
