import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { BookOpen, Award, Trophy, Lightbulb, Megaphone, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import StatGrid from "../../components/institute/StatGrid";
import instituteApi from "../../services/api/instituteApi";
import { levelLabel, seatLabel } from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleDateString("ar") : "—");

const Overview = () => {
  const user = useSelector((s) => s.auth?.user || {});
  const [data, setData] = useState(null);

  useEffect(() => {
    instituteApi
      .getMyOverview()
      .then((res) => setData(res.data?.data || {}))
      .catch(() => toast.error("تعذر تحميل البيانات"));
  }, []);

  const profile = data?.profile || {};
  const counts = data?.counts || {};
  const announcements = data?.announcements || [];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-brand-800 p-6 text-neutral-50 shadow-sm sm:p-8">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold sm:text-3xl">أهلاً بك، {user?.name}! 🎓</h1>
          <p className="mt-2 max-w-md text-sm text-brand-100">
            تابع نتائجك ودوراتك وإنجازاتك في معهد حضرموت للموهوبين.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            {profile.academicNumber && (
              <span className="rounded-full bg-brand-700 px-3 py-1">الرقم الأكاديمي: {profile.academicNumber}</span>
            )}
            {profile.batch && <span className="rounded-full bg-brand-700 px-3 py-1">الدفعة {profile.batch}</span>}
            {profile.level && <span className="rounded-full bg-brand-700 px-3 py-1">{levelLabel(profile.level)}</span>}
            {profile.seatType && <span className="rounded-full bg-brand-700 px-3 py-1">{seatLabel(profile.seatType)}</span>}
          </div>
        </div>
        <div className="absolute -top-16 left-0 -ml-16 h-64 w-64 rounded-full bg-brand-600 opacity-20" />
      </div>

      <StatGrid
        stats={[
          { label: "الدورات المسجلة", value: counts.courses ?? 0, icon: BookOpen, tone: "brand" },
          { label: "الشهادات الممنوحة", value: counts.certificates ?? 0, icon: Award, tone: "success" },
          { label: "الإنجازات المقرة", value: counts.approvedAchievements ?? 0, icon: Trophy, tone: "accent" },
          { label: "رصيد بنك الأفكار", value: counts.ideasBankBalance ?? 0, icon: Lightbulb, tone: "neutral" },
        ]}
      />

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Megaphone className="h-4 w-4 text-accent-600" /> آخر الإعلانات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {announcements.map((a) => (
            <div key={a._id} className="rounded-lg border-[0.5px] border-border-subtle p-3">
              <p className="font-medium text-text-primary">{a.title}</p>
              <p className="mt-1 text-sm text-text-secondary">{a.content}</p>
              <p className="mt-1 text-xs text-text-muted">حتى {dt(a.publishEnd)}</p>
            </div>
          ))}
          {!announcements.length && (
            <p className="py-6 text-center text-sm text-text-secondary">لا توجد إعلانات حالياً.</p>
          )}
          <Link to="/institute-portal/announcements" className="inline-block text-sm text-brand-600 hover:underline">
            عرض كل الإعلانات ←
          </Link>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardContent className="flex items-center gap-3 py-4 text-sm text-text-secondary">
          <GraduationCap className="h-5 w-5 text-brand-600" />
          <span>ولي أمرك: {profile.guardianName || "—"}</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
