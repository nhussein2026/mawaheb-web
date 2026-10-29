import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Clock } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Callout } from "../components/ui/Feedback";
import { AuthCard } from "../components/ui/AuthCard";
import { formatRoleAr } from "../components/admin/adminCopy";
import { API_BASE_URL } from "../services/api/config";

const ROLES = ["Employee", "Admin", "Institute Student", "Scholarship Student"];

// Shown to signed-in users who have no role yet: request a membership type,
// then follow the request's state (pending / rejected).
const Waiting = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestStatus, setRequestStatus] = useState(user?.roleRequestStatus || "None");
  const [requestedRole, setRequestedRole] = useState(user?.requestedRole || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError("يُرجى اختيار نوع العضوية");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/user/role-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestedRole: selectedRole }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        setRequestStatus("Pending");
        setRequestedRole(selectedRole);
      } else {
        setError(data.message || "تعذّر إرسال الطلب. يُرجى المحاولة بعد قليل.");
      }
    } catch {
      setError("تعذّر الاتصال بالخادم. يُرجى التحقق من الاتصال بالإنترنت والمحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="أهلًا بك في منصة مواهب" description="خطوة واحدة تفصلك عن الانضمام">
      {requestStatus === "Pending" ? (
        <div className="space-y-4 text-center" role="status">
          <span className="mx-auto grid size-12 place-items-center rounded-lg bg-info-50 text-info-700">
            <Clock className="size-6" aria-hidden="true" />
          </span>
          <h2 className="text-heading-4 text-text-primary">طلبك قيد المراجعة</h2>
          <p className="text-sm text-text-secondary">
            طلبت الانضمام بصفة <strong className="font-semibold text-text-primary">{formatRoleAr(requestedRole)}</strong>.
            سيراجع أحد المشرفين طلبك ويفعّل حسابك، ولن تحتاج إلى تقديمه مرة أخرى.
          </p>
        </div>
      ) : requestStatus === "Rejected" ? (
        <div className="space-y-4">
          <Callout tone="danger" title="لم تتم الموافقة على الطلب">
            لم يُقبل طلب الانضمام بصفة <strong>{formatRoleAr(requestedRole)}</strong>. يمكنك تقديم طلب جديد أو التواصل مع
            إدارة المؤسسة.
          </Callout>
          <Button className="w-full" size="lg" onClick={() => setRequestStatus("None")}>
            تقديم طلب جديد
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <fieldset aria-describedby={error ? "role-error" : undefined}>
            <legend className="text-label-md text-text-primary">نوع العضوية المطلوبة</legend>
            <p className="mt-1 text-caption text-text-tertiary">تُراجع الإدارة الطلب قبل تفعيل الحساب.</p>
            {error ? (
              <p id="role-error" className="mt-2 text-label-sm text-danger-700" role="alert">
                {error}
              </p>
            ) : null}
            <div className="mt-3 grid gap-2">
              {ROLES.map((role) => (
                <label
                  key={role}
                  className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-border-control px-4 text-sm text-text-primary hover:bg-subtle has-[:checked]:border-2 has-[:checked]:border-brand-strong has-[:checked]:bg-brand-subtle has-[:checked]:font-semibold"
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={() => {
                      setSelectedRole(role);
                      setError("");
                    }}
                    className="size-5"
                  />
                  {formatRoleAr(role)}
                </label>
              ))}
            </div>
          </fieldset>
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            إرسال الطلب للمراجعة
          </Button>
        </form>
      )}
    </AuthCard>
  );
};

export default Waiting;
