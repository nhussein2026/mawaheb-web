import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/Card";
import { Chip } from "../../components/ui/Badge";
import { EmptyState, SkeletonCard } from "../../components/ui/Feedback";
import StatGrid from "../../components/institute/StatGrid";
import instituteApi from "../../services/api/instituteApi";
import { useResource } from "../../hooks/useResource";
import { levelLabel, seatLabel } from "../../constants/institute";
import { formatDate } from "../../utils/format";

const Overview = () => {
  const user = useSelector((s) => s.auth?.user || {});
  const { data, status, reload: load } = useResource(() => instituteApi.getMyOverview(), [], { initial: null });

  const profile = data?.profile || {};
  const counts = data?.counts || {};
  const announcements = data?.announcements || [];
  const facts = [
    profile.academicNumber && `الرقم الأكاديمي ${profile.academicNumber}`,
    profile.batch && `الدفعة ${profile.batch}`,
    profile.level && levelLabel(profile.level),
    profile.seatType && seatLabel(profile.seatType),
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`أهلًا بك، ${user?.name || ""}`}
        description="تابع نتائجك ودوراتك وإنجازاتك في معهد حضرموت للموهوبين."
        breadcrumbs={null}
      />
      {facts.length ? (
        <ul className="-mt-3 flex flex-wrap gap-2" aria-label="بياناتي">
          {facts.map((f) => (
            <li key={f}>
              <Chip className="num">{f}</Chip>
            </li>
          ))}
        </ul>
      ) : null}

      {status === "failed" ? (
        <Card>
          <EmptyState kind="failed" title="تعذّر تحميل بياناتك" onRetry={load} />
        </Card>
      ) : (
        <>
          <StatGrid
            stats={[
              { label: "الدورات المسجلة", value: counts.courses ?? 0, to: "/institute-portal/courses" },
              { label: "الشهادات الممنوحة", value: counts.certificates ?? 0, to: "/institute-portal/courses" },
              { label: "الإنجازات المعتمدة", value: counts.approvedAchievements ?? 0, to: "/institute-portal/achievements" },
              { label: "رصيد بنك الأفكار", value: counts.ideasBankBalance ?? 0, to: "/institute-portal/ideas" },
            ]}
          />

          {status === "loading" ? (
            <SkeletonCard />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>آخر الإعلانات</CardTitle>
              </CardHeader>
              <CardContent>
                {announcements.length ? (
                  <ul className="divide-y divide-border-subtle">
                    {announcements.map((a) => (
                      <li key={a._id} className="py-3 first:pt-0">
                        <p dir="auto" className="font-semibold text-text-primary">
                          {a.title}
                        </p>
                        <p dir="auto" className="reading mt-1 text-sm text-text-secondary">
                          {a.content}
                        </p>
                        <p className="num mt-1 text-xs text-text-tertiary">متاح حتى {formatDate(a.publishEnd)}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState kind="all-done" compact title="لا توجد إعلانات حاليًا" />
                )}
              </CardContent>
              <CardFooter>
                <span>
                  ولي الأمر: <bdi className="text-text-secondary">{profile.guardianName || "—"}</bdi>
                </span>
                <Link to="/institute-portal/announcements" className="font-semibold text-brand-strong underline underline-offset-4">
                  كل الإعلانات
                </Link>
              </CardFooter>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Overview;
