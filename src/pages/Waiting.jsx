import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { GraduationCap, Send, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

const ROLES = [
  "Employee",
  "Admin",
  "Institute Student",
  "Scholarship Student",
];

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
        const errorText = await response.text();
        console.error("Server Error:", errorText);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 font-['Cairo']" dir="rtl">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">أهلاً بك في منصة مواهب</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">خطوة واحدة تفصلك عن الانضمام لمجتمعنا</p>
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <CardHeader className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
            <CardTitle className="text-xl">تحديد نوع العضوية</CardTitle>
            <CardDescription>
              يرجى اختيار نوع العضوية التي ترغب في الحصول عليها في منصتنا ليتم مراجعتها من قبل الإدارة.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {requestStatus === "Pending" ? (
              <div className="space-y-6 text-center py-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <Clock className="w-16 h-16 text-amber-500 animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full animate-ping"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">طلبك قيد المراجعة</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    لقد قمت بطلب الانضمام كـ <span className="font-bold text-indigo-600 dark:text-indigo-400">{requestedRole}</span>.
                    سيقوم أحد المشرفين بمراجعة طلبك وتفعيل حسابك قريباً.
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-300">
                  يرجى التواصل مع أحد المشرفين إذا تأخر الرد على طلبك.
                </div>
              </div>
            ) : requestStatus === "Rejected" ? (
              <div className="space-y-6 text-center py-4">
                <div className="flex justify-center">
                  <AlertCircle className="w-16 h-16 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">تم رفض الطلب</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    نعتذر، لم يتم الموافقة على طلب انضمامك كـ <span className="font-bold">{requestedRole}</span>.
                    يمكنك التواصل مع الإدارة للاستفسار أو إعادة تقديم الطلب.
                  </p>
                </div>
                <Button 
                  onClick={() => setRequestStatus("None")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  إعادة تقديم الطلب
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-3">
                  {ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-right ${
                        selectedRole === role
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                          : "border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-900/30"
                      }`}
                    >
                      <span className="font-medium">{role}</span>
                      {selectedRole === role && <CheckCircle2 className="w-5 h-5" />}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading || !selectedRole}
                  className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري الإرسال...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send size={18} />
                      <span>إرسال الطلب للمراجعة</span>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-gray-400 dark:text-gray-600 text-xs mt-8">
          © 2026 منصة مواهب. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
};

export default Waiting;
