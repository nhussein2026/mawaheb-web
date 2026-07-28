import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Users,
  UserCheck,
  GraduationCap,
  Building2,
  Wallet,
  Armchair,
  MessageSquare,
  Trophy,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import StatCard from "../../components/institute/StatCard";
import Loading from "../../components/ui/Loading";
import instituteApi from "../../services/api/instituteApi";

const Section = ({ title, children }) => (
  <Card className="border-none shadow-sm">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </CardContent>
  </Card>
);

const InstituteDashboard = () => {
  const user = useSelector((s) => s.auth?.user || {});
  const selectedYearId = useSelector((s) => s.academicYear.selectedYearId);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    instituteApi
      .getDashboard(selectedYearId)
      .then((res) => {
        if (active) setData(res.data?.data || null);
      })
      .catch(() => {
        if (active) setData(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedYearId]);

  if (loading) return <Loading variant="inline" message="جارٍ تحميل لوحة التحكم…" />;

  const s = data || {};
  const online = s.online || {};
  const platform = s.platform || {};
  const students = s.students || {};
  const seats = s.seats || {};

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="لوحة التحكم"
        description="نظرة عامة على إحصائيات المنصة للعام الدراسي المحدد."
      />

      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-brand-800 p-6 text-neutral-50 shadow-lg shadow-brand-200 dark:shadow-none">
        <div className="relative z-10">
          <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-700 px-3 py-1 text-xs font-medium text-accent-200">
            👑 مشرف عام المنصة
          </span>
          <h1 className="text-2xl font-bold">أهلاً بك، {user?.name} 🎓</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-brand-100">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
            🟢 متصل الآن بالخادم الآمن
          </p>
        </div>
        <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-600 opacity-20" />
      </div>

      {/* Online + platform */}
      <Section title="المستخدمون المتصلون والإحصائيات العامة">
        <StatCard label="المشرفون المتصلون الآن" value={online.supervisorsOnline ?? 0} icon={UserCheck} tone="brand" />
        <StatCard label="الطلاب المتصلون الآن" value={online.studentsOnline ?? 0} icon={Users} tone="neutral" />
        <StatCard label="عدد الرسائل المفتوحة" value={platform.openMessages ?? 0} icon={MessageSquare} tone="accent" />
        <StatCard label="إجمالي الإنجازات المجازة" value={platform.approvedAchievements ?? 0} icon={Trophy} tone="success" />
        <StatCard label="عدد الأفكار المجازة" value={platform.approvedIdeas ?? 0} icon={Lightbulb} tone="accent" />
      </Section>

      {/* Students & stages */}
      <Section title="إحصائيات الطلاب والمراحل الأكاديمية">
        <StatCard label="عدد الطلاب المسجلين" value={students.registered ?? 0} icon={Users} tone="brand" />
        <StatCard label="طلاب المرحلة الثانوية" value={students.secondary ?? 0} icon={GraduationCap} tone="brand" />
        <StatCard label="طلاب المرحلة الجامعية" value={students.university ?? 0} icon={Building2} tone="neutral" />
        <StatCard label="الطلاب الخريجون" value={students.graduated ?? 0} icon={GraduationCap} tone="success" />
      </Section>

      {/* Seats & fees */}
      <Section title="إحصائيات المقاعد والرسوم المالية">
        <StatCard label="طلاب المقاعد المجانية" value={seats.freeSeats ?? 0} icon={Armchair} tone="brand" />
        <StatCard label="طلاب المقاعد المدفوعة" value={seats.paidSeats ?? 0} icon={Wallet} tone="accent" />
        <StatCard label="مسددي القسط الأول" value={seats.paidFirstInstallment ?? 0} icon={CheckCircle2} tone="success" />
        <StatCard label="مسددي القسط الثاني" value={seats.paidSecondInstallment ?? 0} icon={CheckCircle2} tone="success" />
        <StatCard label="متأخري القسط الأول" value={seats.overdueFirstInstallment ?? 0} icon={AlertTriangle} tone="danger" />
        <StatCard label="متأخري القسط الثاني" value={seats.overdueSecondInstallment ?? 0} icon={AlertTriangle} tone="danger" />
      </Section>
    </div>
  );
};

export default InstituteDashboard;
