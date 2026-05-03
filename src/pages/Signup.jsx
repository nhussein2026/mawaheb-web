import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { UserPlus, User, Mail, Lock } from "lucide-react";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      toast.error("البريد الإلكتروني غير صالح");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success("تم إنشاء الحساب بنجاح!");
        navigate("/login");
      } else {
        toast.error(data.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    } catch (error) {
      console.error("Error registering:", error);
      toast.error("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-page p-4" dir="rtl">
      <div className="bg-surface-card shadow-xl rounded-3xl p-8 max-w-md w-full border border-border-subtle overflow-hidden relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-accent-50 rounded-full -ml-16 -mt-16 blur-2xl opacity-50"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-brand-800 rounded-2xl flex items-center justify-center text-accent-400 mx-auto mb-4 shadow-lg shadow-brand-900/20">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">إنشاء حساب</h2>
          <p className="text-text-secondary text-sm">انضم لمجتمع مواهب وابدأ رحلتك التعليمية</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-bold text-text-secondary pr-1">الاسم الكامل</label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="أدخل اسمك الكامل"
                className="w-full pl-3 pr-10 py-3 rounded-xl border border-border-default focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 outline-none transition-all bg-neutral-50/50"
                required
              />
              <User className="absolute right-3 top-3.5 text-text-muted" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-bold text-text-secondary pr-1">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                className="w-full pl-3 pr-10 py-3 rounded-xl border border-border-default focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 outline-none transition-all bg-neutral-50/50"
                required
              />
              <Mail className="absolute right-3 top-3.5 text-text-muted" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-bold text-text-secondary pr-1">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-3 pr-10 py-3 rounded-xl border border-border-default focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 outline-none transition-all bg-neutral-50/50"
                required
              />
              <Lock className="absolute right-3 top-3.5 text-text-muted" size={18} />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full h-12 text-lg shadow-lg shadow-brand-900/10"
          >
            {loading ? "جاري التسجيل..." : "تسجيل حساب جديد"}
          </Button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <p className="text-sm text-text-secondary">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-brand-600 font-bold hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
