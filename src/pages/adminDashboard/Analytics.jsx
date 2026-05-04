import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const tooltipStyles = {
  borderRadius: "var(--radius-md)",
  border: "0.5px solid var(--color-border-subtle)",
  background: "var(--color-surface-card)",
};

export default function Analytics() {
  const token = useSelector((state) => state.auth.token);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [coursesRes, certsRes, reportsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/user/summary?category=courses`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/user/summary?category=certificates`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/user/summary?category=reports`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const courses = await coursesRes.json();
        const certs = await certsRes.json();
        const reports = await reportsRes.json();

        const totalCourses =
          courses.result?.reduce((acc, user) => acc + (user.courseCount || 0), 0) ?? 0;
        const totalCerts =
          certs.result?.reduce((acc, user) => acc + (user.certificateCount || 0), 0) ?? 0;
        const totalReports =
          reports.result?.reduce((acc, user) => acc + (user.reportCount || 0), 0) ?? 0;

        setData([
          { name: "الدورات", count: totalCourses },
          { name: "الشهادات", count: totalCerts },
          { name: "التقارير", count: totalReports },
        ]);
        setNote(null);
      } catch (err) {
        console.error(err);
        setNote("تعذّر الوصول إلى ملخص المستخدمين؛ عُرضت القيم صفراً.");
        setData([
          { name: "الدورات", count: 0 },
          { name: "الشهادات", count: 0 },
          { name: "التقارير", count: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="التحليلات"
          description="إجماليات مجمّعة من مسار `/user/summary` حسب الفئة. يمكن لاحقاً ربط مسارات تحليلات خاصة بالإدارة عند توفرها في الخادم."
        />

        {note ? (
          <div
            className="rounded-md border-e-[3px] border-e-warning-text bg-warning-bg px-4 py-3 text-sm text-warning-dark"
            role="status"
          >
            {note}
          </div>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>إجماليات التفاعل</CardTitle>
            <CardDescription>ملخص لكل مستخدم مجمّع على مستوى الدليل (رمز المسؤول).</CardDescription>
          </CardHeader>
          <CardContent className="h-[min(420px,70vh)] min-h-[280px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-text-secondary">جاري التحميل…</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-subtle)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyles} cursor={{ fill: "var(--color-brand-50)" }} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "var(--color-text-secondary)" }} />
                  <Bar name="العدد" dataKey="count" fill="var(--color-brand-600)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
