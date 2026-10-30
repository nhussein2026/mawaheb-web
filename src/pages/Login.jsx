import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../features/user/authSlice";
import { Button } from "../components/ui/Button";
import { Field, Input } from "../components/ui/Input";
import { Callout } from "../components/ui/Feedback";
import { AuthCard, authLinkCls } from "../components/ui/AuthCard";
import { API_BASE_URL } from "../services/api/config";
import { homePathFor } from "../utils/roles";
import { hasApprovedRole, needsProfileCompletion } from "../utils/profileCompletion";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A failed profile load never blocks sign-in; the user just goes home.
async function fetchProfileUser(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) return null;
    return (await response.json())?.user || null;
  } catch {
    return null;
  }
}

// Sign in (§5.1): wrong credentials get one generic message that never says
// which part was wrong. Field formats are checked on blur, required on submit.
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    if (name === "email") {
      if (!value.trim()) return "يُرجى إدخال البريد الإلكتروني";
      if (!EMAIL_RE.test(value.trim())) return "يُرجى إدخال بريد إلكتروني صحيح، مثل name@example.com";
    }
    if (name === "password" && !value) return "يُرجى إدخال كلمة المرور";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Once a field shows an error it re-checks while typing.
    if (errors[name]) setErrors((er) => ({ ...er, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value) setErrors((er) => ({ ...er, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = { email: validateField("email", form.email), password: validateField("password", form.password) };
    setErrors(next);
    setFormError("");
    if (next.email || next.password) {
      (next.email ? emailRef.current : document.getElementById("password"))?.focus();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim().toLowerCase(), password: form.password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFormError(
          response.status >= 500
            ? "حدث خطأ من جهتنا. يُرجى المحاولة بعد قليل."
            : "البريد الإلكتروني أو كلمة المرور غير صحيحة. يُرجى المحاولة مرة أخرى."
        );
        return;
      }
      const { token, user } = data;
      const next = location.state?.from || homePathFor(user);
      // Approved users with an empty profile are asked to complete it first.
      // Checked before storing the session: "/" redirects as soon as it has a token.
      const profileUser = hasApprovedRole(user) ? await fetchProfileUser(token) : null;
      dispatch(login({ token, user }));
      if (profileUser && needsProfileCompletion(profileUser)) {
        navigate("/complete-profile", { replace: true, state: { from: next, profileUser } });
        return;
      }
      navigate(next, { replace: true });
    } catch {
      setFormError("تعذّر الاتصال بالخادم. يُرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="تسجيل الدخول"
      description="مرحبًا بك في منصة مواهب"
      footer={
        <>
          ليس لديك حساب؟{" "}
          <Link to="/signup" className={authLinkCls}>
            إنشاء حساب
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
        <Field label="البريد الإلكتروني" error={errors.email} id="email">
          <Input
            ref={emailRef}
            type="email"
            name="email"
            dir="ltr"
            autoComplete="email"
            inputMode="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Field>
        <Field label="كلمة المرور" error={errors.password} id="password">
          <Input
            type="password"
            name="password"
            dir="ltr"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Field>
        <div className="flex justify-end">
          <Link to="/forgot-password" className={`${authLinkCls} text-sm`}>
            نسيت كلمة المرور؟
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          تسجيل الدخول
        </Button>
      </form>
    </AuthCard>
  );
};

export default Login;
