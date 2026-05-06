import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { GraduationCap, Send, Clock, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

const ROLES = [
  "Employee",
  "Admin",
  "Institute Student",
  "Scholarship Student",
];

const ROLE_LABELS = {
  "Employee": "موظف",
  "Admin": "مسؤول نظام",
  "Institute Student": "طالب معهد",
  "Scholarship Student": "طالب منحة",
};

const Waiting = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState(user?.roleRequestStatus || "None");
  const [requestedRole, setRequestedRole] = useState(user?.requestedRole || "");

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error("يرجى اختيار نوع العضوية");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/role-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestedRole: selectedRole }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        toast.success("تم إرسال طلبك بنجاح");
        setRequestStatus("Pending");
        setRequestedRole(selectedRole);
      } else {
        toast.error(data.message || "فشل إرسال الطلب");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-page p-4 font-sans" dir="rtl">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-brand-800 text-accent-400 mb-6 shadow-2xl shadow-brand-900/20 border border-brand-700/50">
            <GraduationCap size={48} />
          </div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">أهلاً بك في منصة مواهب</h1>
          <p className="text-text-secondary mt-2 font-medium">خطوة واحدة تفصلك عن الانضمام لمجتمعنا</p>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden rounded-3xl bg-surface-card">
          <CardHeader className="bg-gradient-to-br from-brand-900 to-brand-800 p-8 text-white relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-400/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <CardTitle className="text-2xl font-bold text-white relative z-10">تحديد نوع العضوية</CardTitle>
            <CardDescription className="text-brand-100 mt-2 text-sm relative z-10 leading-relaxed opacity-90">
              يرجى اختيار نوع العضوية التي ترغب في الحصول عليها ليتم مراجعتها من قبل الإدارة.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {requestStatus === "Pending" ? (
              <div className="space-y-8 text-center py-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-accent-50 rounded-full flex items-center justify-center text-accent-600 border border-accent-100 shadow-inner">
                      <Clock className="w-10 h-10 animate-pulse" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-400 rounded-full animate-ping border-2 border-white"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">طلبك قيد المراجعة</h3>
                  <p className="text-text-secondary mt-3 leading-relaxed">
                    لقد قمت بطلب الانضمام كـ <span className="font-bold text-brand-600">[{ROLE_LABELS[requestedRole] || requestedRole}]</span>.
                    سيقوم أحد المشرفين بمراجعة طلبك وتفعيل حسابك قريباً.
                  </p>
                </div>
                <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5 text-sm text-brand-800 font-medium flex items-center gap-3">
                  <Sparkles size={20} className="text-accent-600 shrink-0" />
                  <span>يرجى الانتظار أو التواصل مع المشرف لتسريع العملية.</span>
                </div>
              </div>
            ) : requestStatus === "Rejected" ? (
              <div className="space-y-8 text-center py-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-error-bg rounded-full flex items-center justify-center text-error-text border border-error-border shadow-inner">
                    <AlertCircle className="w-10 h-10" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-primary">تم رفض الطلب</h3>
                  <p className="text-text-secondary mt-3 leading-relaxed">
                    نعتذر، لم يتم الموافقة على طلب انضمامك كـ <span className="font-bold">[{ROLE_LABELS[requestedRole] || requestedRole}]</span>.
                    يمكنك إعادة المحاولة أو التواصل مع الدعم الفني.
                  </p>
                </div>
                <Button
                  onClick={() => setRequestStatus("None")}
                  variant="primary"
                  className="w-full h-12 shadow-lg"
                >
                  إعادة تقديم الطلب
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid gap-4">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 text-right group ${selectedRole === role
                        ? "border-brand-600 bg-brand-50 text-brand-900 shadow-lg shadow-brand-900/5 scale-[1.02]"
                        : "border-border-subtle hover:border-brand-200 hover:bg-neutral-50/50"
                        }`}
                    >
                      <span className={`font-bold transition-colors ${selectedRole === role ? "text-brand-800" : "text-text-secondary group-hover:text-text-primary"}`}>
                        {ROLE_LABELS[role] || role}
                      </span>
                      {selectedRole === role ? (
                        <CheckCircle2 className="w-6 h-6 text-brand-600 animate-in zoom-in duration-300" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-border-default group-hover:border-brand-200 transition-colors"></div>
                      )}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading || !selectedRole}
                  variant="primary"
                  className="w-full h-14 text-xl shadow-xl shadow-brand-900/10"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>جاري الإرسال...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Send size={22} className="rotate-180" />
                      <span>إرسال الطلب للمراجعة</span>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-text-muted text-xs mt-10 font-medium">
          © 2026 منصة مواهب الرقمية. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
};

export default Waiting;
