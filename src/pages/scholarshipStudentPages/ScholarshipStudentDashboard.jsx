import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  GraduationCap,
  FileText,
  Trophy,
  BookOpen,
  Calendar,
  PlusCircle,
  ChevronLeft,
  Activity,
  Award,
  Clock,
  User
} from "lucide-react";
import { Link } from "react-router-dom";
import Loading from "../../components/ui/Loading";

const ScholarshipStudentDashboard = () => {
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
        console.error("Error fetching student profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <Loading fullPage />
    );
  }

  const stats = profileData?.statistics || {};

  const statCards = [
    { title: "التقارير المقدمة", value: stats.studentReports || 0, icon: FileText, color: "text-brand-600", bg: "bg-brand-50" },
    { title: "الفصول الدراسية", value: stats.semesters || 0, icon: BookOpen, color: "text-brand-600", bg: "bg-brand-50" },
    { title: "الإنجازات", value: stats.achievements || 0, icon: Trophy, color: "text-accent-600", bg: "bg-accent-50" },
    { title: "الشهادات", value: stats.certificates || 0, icon: Award, color: "text-accent-600", bg: "bg-accent-50" },
  ];

  const quickActions = [
    { title: "تقديم تقرير جديد", icon: PlusCircle, link: "/student-report", color: "bg-brand-600" },
    { title: "إضافة فصل دراسي", icon: Calendar, link: "/semester-create", color: "bg-brand-400" },
    { title: "رفع شهادة جديدة", icon: Award, link: "/student/certificates", color: "bg-accent-400" },
  ];

  return (
    <>
      <div className="space-y-8">

        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-brand-800 p-8 text-brand-50 shadow-sm">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 text-brand-50">أهلاً بك مجدداً، {user?.name}! 👋</h1>
            <p className="text-brand-100 max-w-md">نحن فخورون بتقدمك الدراسي. استمر في التميز وشاركنا آخر إنجازاتك اليوم.</p>
            <div className="mt-6 flex gap-4">
              <Link to="/student-report">
                <Button className="bg-brand-50 text-brand-800 hover:bg-brand-100 border-none">
                  <PlusCircle className="ml-2 w-4 h-4" />
                  تقديم تقرير
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="border-brand-300 text-brand-800 hover:bg-brand-100">
                  عرض الملف الشخصي
                </Button>
              </Link>
            </div>
          </div>
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-600 rounded-full opacity-10"></div>
          <div className="absolute bottom-0 right-0 mr-32 -mb-16 w-48 h-48 bg-accent-400 rounded-full opacity-10"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">{stat.title}</p>
                    <h3 className="text-2xl font-medium mt-1 text-text-primary">{stat.value}</h3>
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

          {/* Quick Actions & Activity */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick Actions */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2 text-text-primary">
                <Activity className="text-brand-600" size={20} />
                إجراءات سريعة
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.link}>
                    <div className="group bg-surface-card p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-border-subtle flex flex-col items-center text-center gap-3">
                      <div className={`${action.color} text-brand-50 p-3 rounded-full group-hover:scale-110 transition-transform`}>
                        <action.icon size={24} />
                      </div>
                      <span className="font-medium text-text-primary">{action.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Academic Overview Preview */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">نظرة عامة على التقدم</CardTitle>
                <CardDescription>ملخص آخر الأنشطة والتقارير</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.studentReports > 0 ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-border-subtle">
                        <div className="flex items-center gap-3">
                          <div className="bg-brand-50 text-brand-600 p-2 rounded-lg">
                            <Clock size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">آخر تقرير تم تقديمه</p>
                            <p className="text-sm text-text-secondary">منذ فترة وجيزة</p>
                          </div>
                        </div>
                        <Link to="/my-reports">
                          <Button variant="ghost" size="sm">
                            <ChevronLeft size={16} />
                            عرض
                          </Button>
                        </Link>
                      </div>
                      <Link to="/my-reports" className="text-brand-600 text-sm font-medium hover:underline text-center">
                        عرض جميع التقارير ({stats.studentReports})
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
                      <p className="text-text-muted">لا توجد تقارير مقدمة بعد.</p>
                      <Link to="/student-report" className="text-brand-600 text-sm font-medium hover:underline">
                        ابدأ بتقديم أول تقرير لك الآن
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6">

            {/* Profile Card */}
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="h-20 bg-brand-100"></div>
              <CardContent className="relative px-6 pb-6">
                <div className="absolute -top-10 right-6">
                  <div className="w-20 h-20 rounded-2xl bg-surface-card p-1 shadow-md">
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
                  <h3 className="text-xl font-bold text-text-primary">{user?.name}</h3>
                  <p className="text-sm text-text-secondary">{user?.email}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium px-2 py-1 bg-accent-50 text-accent-600 rounded-full w-fit">
                    <GraduationCap size={14} />
                    طالب منحة
                  </div>
                </div>
                <hr className="my-6 border-border-subtle" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">التذاكر النشطة</span>
                    <span className="font-medium text-text-primary">{stats.tickets || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">الدورات التدريبية</span>
                    <span className="font-medium text-text-primary">{stats.courses || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className="bg-brand-800 text-brand-50 border-none shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="bg-brand-600/50 w-10 h-10 rounded-lg flex items-center justify-center text-accent-400">
                  <Activity size={20} />
                </div>
                <h3 className="font-bold text-lg text-brand-50">هل تحتاج للمساعدة؟</h3>
                <p className="text-brand-100 text-sm">إذا كنت تواجه أي صعوبات دراسية أو تقنية، فريقنا هنا لدعمك دائماً.</p>
                <Link to="/create-ticket" className="block">
                  <Button className="w-full bg-accent-400 text-accent-900 hover:bg-accent-200">تواصل معنا</Button>
                </Link>
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </>
  );
};


export default ScholarshipStudentDashboard;