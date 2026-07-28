import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  GraduationCap,
  FileText,
  Trophy,
  BookOpen,
  PlusCircle,
  ChevronLeft,
  Activity,
  Award,
  User,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const InstituteStudentDash = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching institute student profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-100 dark:bg-brand-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  const stats = profileData?.statistics || {};

  const statCards = [
    { title: "الدورات المسجلة", value: stats.courses || 0, icon: BookOpen, color: "text-brand-600", bg: "bg-brand-50" },
    { title: "الشهادات المحصلة", value: stats.certificates || 0, icon: Award, color: "text-success-text", bg: "bg-success-bg" },
    { title: "الإنجازات", value: stats.achievements || 0, icon: Trophy, color: "text-accent-600", bg: "bg-accent-50" },
    { title: "التذاكر النشطة", value: stats.tickets || 0, icon: FileText, color: "text-neutral-700", bg: "bg-neutral-100" },
  ];

  return (
    <>
      <div className="space-y-8">

        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-brand-800 p-8 text-neutral-50 shadow-lg shadow-brand-200 dark:shadow-none">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">أهلاً بك مجددا، {user?.name}! 🎓</h1>
            <p className="text-brand-100 max-w-md">نحن هنا لندعم رحلتك التعليمية في المعهد. تصفح دوراتك وتابع تقدمك.</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link to="/institute-portal">
                <Button className="bg-accent-400 text-brand-900 hover:bg-accent-300">
                  <GraduationCap className="ml-2 w-4 h-4" />
                  دخول بوابة المعهد
                </Button>
              </Link>
              <Link to="/student/courses">
                <Button className="bg-neutral-50 text-brand-800 hover:bg-brand-50">
                  <BookOpen className="ml-2 w-4 h-4" />
                  عرض دوراتي
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" className="border-brand-400 text-neutral-50 hover:bg-brand-700">
                  إعدادات الحساب
                </Button>
              </Link>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-600 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 right-0 mr-32 -mb-16 w-48 h-48 bg-brand-800 rounded-full opacity-30"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-50">{stat.value}</h3>
                  </div>
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            {/* Quick Navigation */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="text-brand-600" />
                الوصول السريع
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link to="/student/courses">
                  <div className="group bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-neutral-200 dark:border-neutral-800 flex flex-col items-center text-center gap-3">
                    <div className="bg-brand-600 text-neutral-50 p-3 rounded-full group-hover:scale-110 transition-transform">
                      <BookOpen size={24} />
                    </div>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-200">الدورات التدريبية</span>
                  </div>
                </Link>
                <Link to="/student/certificates">
                  <div className="group bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-neutral-200 dark:border-neutral-800 flex flex-col items-center text-center gap-3">
                    <div className="bg-brand-800 text-neutral-50 p-3 rounded-full group-hover:scale-110 transition-transform">
                      <Award size={24} />
                    </div>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-200">الشهادات</span>
                  </div>
                </Link>
                <Link to="/student/tickets">
                  <div className="group bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-neutral-200 dark:border-neutral-800 flex flex-col items-center text-center gap-3">
                    <div className="bg-accent-600 text-neutral-900 p-3 rounded-full group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-200">الدعم الفني</span>
                  </div>
                </Link>
              </div>
            </section>

            {/* Course Progress Preview */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">دوراتي الحالية</CardTitle>
                <CardDescription>تابع تقدمك في المواد الدراسية</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.courses > 0 ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="text-brand-600" />
                        <span className="font-medium">لديك {stats.courses} دورات مسجلة</span>
                      </div>
                      <Link to="/student/courses">
                        <Button variant="ghost" size="sm">عرض الكل</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <BookOpen className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
                    <p className="text-neutral-500">لا توجد دورات مسجلة حالياً.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Profile Overview */}
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="h-20 bg-brand-100 dark:bg-brand-900/30"></div>
              <CardContent className="relative px-6 pb-6">
                <div className="absolute -top-10 right-6">
                  <div className="w-20 h-20 rounded-2xl bg-neutral-50 p-1 shadow-md">
                    <div className="w-full h-full rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 overflow-hidden">
                      {user?.imageUrl ? (
                        <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={40} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-12">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">{user?.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{user?.email}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium px-2 py-1 bg-accent-50 text-accent-700 rounded-full w-fit">
                    <GraduationCap size={14} />
                    طالب معهد
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Announcements Placeholder */}
            <Card className="border-none shadow-sm bg-brand-900 text-neutral-50">
              <CardHeader>
                <CardTitle className="text-base text-neutral-50">إعلانات المعهد</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-r-2 border-brand-400 pr-4">
                  <p className="text-sm font-bold">بداية الفصل الدراسي الجديد</p>
                  <p className="text-xs text-neutral-400">سيتم الإعلان عن المواعيد قريباً</p>
                </div>
                <div className="border-r-2 border-neutral-700 pr-4">
                  <p className="text-sm font-bold">تحديث نظام الشهادات</p>
                  <p className="text-xs text-neutral-400">يمكنك الآن تحميل شهاداتك بصيغة PDF</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </>
  );
};

export default InstituteStudentDash;