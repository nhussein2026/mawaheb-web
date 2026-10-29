import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronLeft, BookOpen, Trophy, ScrollText, LifeBuoy, UserRound } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { StatTile, StatTiles } from "../../components/ui/StatTile";
import { EmptyState, SkeletonTiles } from "../../components/ui/Feedback";
import { useResource } from "../../hooks/useResource";
import { API_BASE_URL } from "../../services/api/config";

const LINKS = [
  { to: "/student/courses", label: "دوراتي", icon: BookOpen },
  { to: "/student/achievements", label: "إنجازاتي", icon: Trophy },
  { to: "/student/certificates", label: "شهاداتي", icon: ScrollText },
  { to: "/student/tickets", label: "التذاكر والدعم", icon: LifeBuoy },
  { to: "/profile", label: "الملف الشخصي", icon: UserRound },
];

// Student home for accounts that are neither scholarship nor institute
// students. Counts come from /user/profile when the backend provides them.
const InstituteStudentDash = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const { data, status, reload } = useResource(
    async () => {
      const response = await fetch(`${API_BASE_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    },
    [token],
    { initial: null, select: (d) => d }
  );
  const stats = data?.statistics || {};

  return (
    <div className="space-y-6">
      <PageHeader title={`أهلًا بك، ${user?.name || ""}`} description="تصفّح دوراتك وتابع إنجازاتك." breadcrumbs={null} />

      {status === "loading" ? (
        <SkeletonTiles />
      ) : status === "failed" ? (
        <Card>
          <EmptyState kind="failed" title="تعذّر تحميل ملخص حسابك" onRetry={reload} />
        </Card>
      ) : (
        <StatTiles>
          <StatTile label="الدورات المسجلة" value={stats.courses || 0} to="/student/courses" />
          <StatTile label="الشهادات" value={stats.certificates || 0} to="/student/certificates" />
          <StatTile label="الإنجازات" value={stats.achievements || 0} to="/student/achievements" />
          <StatTile label="التذاكر" value={stats.tickets || 0} to="/student/tickets" />
        </StatTiles>
      )}

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>روابط سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border-subtle">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="flex min-h-12 items-center gap-3 rounded-md px-1 text-sm text-text-primary hover:bg-subtle">
                  <l.icon className="size-5 text-text-tertiary" aria-hidden="true" />
                  <span className="flex-1">{l.label}</span>
                  <ChevronLeft className="size-4 text-text-tertiary" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstituteStudentDash;
