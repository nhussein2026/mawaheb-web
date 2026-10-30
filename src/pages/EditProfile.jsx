import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { EmptyState, SkeletonCard } from "../components/ui/Feedback";
import { PageHeader } from "../components/ui/PageHeader";
import { ProfileForm } from "../components/profile/ProfileForm";
import { useResource } from "../hooks/useResource";
import { API_BASE_URL } from "../services/api/config";

// "Edit profile": the same form as the first-login prompt, reached from My profile.
const EditProfile = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { data: profileUser, status, reload } = useResource(
    async () => {
      const response = await fetch(`${API_BASE_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    },
    [token],
    { initial: null, select: (d) => d?.user }
  );

  const back = () => navigate("/profile");

  return (
    <div className="mx-auto max-w-[760px]">
      <PageHeader title="تعديل الملف الشخصي" description="جميع الحقول اختيارية عدا الاسم." />
      {status === "loading" ? (
        <SkeletonCard lines={8} />
      ) : status === "failed" ? (
        <Card>
          <EmptyState kind="failed" title="تعذّر تحميل الملف الشخصي" onRetry={reload} />
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-5 sm:pt-6">
            <ProfileForm
              profileUser={profileUser}
              showProgress
              onSaved={back}
              secondaryAction={
                <Button variant="secondary" size="lg" onClick={back}>
                  إلغاء
                </Button>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EditProfile;
