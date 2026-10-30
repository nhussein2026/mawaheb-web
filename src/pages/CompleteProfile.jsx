import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { BadgeCheck, MessageCircle, Sparkles } from "lucide-react";
import foundationLogo from "../assets/logo/drklogo.webp";
import { Button } from "../components/ui/Button";
import { EmptyState, SkeletonCard } from "../components/ui/Feedback";
import { ProfileForm } from "../components/profile/ProfileForm";
import { useResource } from "../hooks/useResource";
import { API_BASE_URL } from "../services/api/config";
import { homePathFor } from "../utils/roles";
import { hasApprovedRole } from "../utils/profileCompletion";

const BENEFITS = [
  { icon: BadgeCheck, text: "يتعرّف عليك فريق المؤسسة ويتابع مسيرتك بسهولة" },
  { icon: MessageCircle, text: "نصل إليك سريعًا بالفرص والتنبيهات المهمة" },
  { icon: Sparkles, text: "يظهر حسابك بصورة كاملة واحترافية في المنصة" },
];

// Shown once after an approved user signs in while their profile is still
// empty. Every field is optional; "Skip for now" goes straight home.
const CompleteProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const preloaded = location.state?.profileUser;

  const { data: profileUser, status, reload } = useResource(
    async () => {
      if (preloaded) return { user: preloaded };
      const response = await fetch(`${API_BASE_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    },
    [token],
    { initial: null, select: (d) => d?.user }
  );

  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!hasApprovedRole(user)) return <Navigate to="/" replace />;

  const next = location.state?.from || homePathFor(user);
  const goNext = () => navigate(next, { replace: true });
  const firstName = String(user?.name || "").trim().split(/\s+/)[0];

  return (
    <div className="min-h-dvh bg-canvas px-4 py-8 text-text-primary sm:py-12" dir="rtl" lang="ar" data-scope="foundation">
      <main className="mx-auto w-full max-w-[640px]">
        <img src={foundationLogo} alt="مؤسسة مواهب" width="56" height="62" className="mx-auto h-14 w-auto" />
        <div className="mt-5 text-center">
          <p className="text-sm font-semibold text-brand-strong">حسابك مفعّل وجاهز</p>
          <h1 className="mt-1 font-display text-heading-2 text-text-primary">
            {firstName ? `أهلًا ${firstName}، ` : ""}أكمل ملفك الشخصي
          </h1>
          <p className="mt-1 text-sm text-text-secondary">خطوة أخيرة لا تستغرق أكثر من دقيقتين</p>
        </div>

        <ul className="mt-6 grid gap-2 sm:grid-cols-3">
          {BENEFITS.map((b) => (
            <li key={b.text} className="flex items-start gap-2 rounded-md bg-brand-subtle px-3 py-2.5 text-sm text-text-primary">
              <b.icon className="mt-0.5 size-5 shrink-0 text-brand-strong" aria-hidden="true" />
              {b.text}
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-xl border border-border-default bg-surface px-5 py-6 sm:px-8 sm:py-7">
          {status === "loading" ? (
            <SkeletonCard lines={6} className="border-0 p-0" />
          ) : status === "failed" ? (
            <EmptyState
              kind="failed"
              title="تعذّر تحميل بياناتك"
              onRetry={reload}
              action={
                <Button variant="tertiary" onClick={goNext}>
                  المتابعة إلى حسابي
                </Button>
              }
            />
          ) : (
            <ProfileForm
              profileUser={profileUser}
              showProgress
              submitLabel="حفظ والمتابعة"
              onSaved={goNext}
              secondaryAction={
                <Button variant="tertiary" size="lg" onClick={goNext}>
                  تخطي الآن
                </Button>
              }
            />
          )}
        </div>
        <p className="mt-4 text-center text-caption text-text-tertiary">
          يمكنك تعديل هذه البيانات في أي وقت من صفحة «الملف الشخصي».
        </p>
      </main>
    </div>
  );
};

export default CompleteProfile;
