import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShieldCheck, LogIn } from "lucide-react";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { labelCls } from "../../components/institute/formStyles";
import guardianApi, { isGuardianLoggedIn } from "../../services/api/guardianApi";

const GuardianLogin = () => {
  const navigate = useNavigate();
  const [academicNumber, setAcademicNumber] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  if (isGuardianLoggedIn()) return <Navigate to="/guardian" replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!academicNumber.trim() || !pin.trim()) {
      toast.warn("الرقم الأكاديمي ورمز ولي الأمر مطلوبان");
      return;
    }
    setLoading(true);
    try {
      await guardianApi.login(academicNumber.trim(), pin.trim());
      toast.success("مرحباً بك");
      navigate("/guardian", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "بيانات الدخول غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-surface-page px-4" dir="rtl" lang="ar">
      <Card className="w-full max-w-md border-none shadow-sm">
        <CardContent className="p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-800">
              <ShieldCheck className="h-6 w-6 text-accent-400" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">بوابة ولي الأمر</h1>
            <p className="mt-1 text-sm text-text-secondary">
              معهد حضرموت للموهوبين — للاطلاع على بيانات ابنك/ابنتك
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className={labelCls}>الرقم الأكاديمي للطالب</label>
              <Input
                value={academicNumber}
                onChange={(e) => setAcademicNumber(e.target.value)}
                placeholder="مثال: 1101"
                dir="ltr"
              />
            </div>
            <div>
              <label className={labelCls}>رمز سر ولي الأمر</label>
              <Input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                dir="ltr"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              <LogIn className="h-4 w-4" /> دخول
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuardianLogin;
