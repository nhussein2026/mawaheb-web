import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { BookOpen, Calendar, Award, StickyNote, AlertTriangle, ArrowUpLeft } from "lucide-react";

async function fetchCount(url, token) {
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data.length : null;
  } catch {
    return null;
  }
}

const hubs = [
  {
    title: "الدورات",
    description: "إدارة مسارات التعلّم",
    href: "/student/courses",
    icon: BookOpen,
    key: "courses",
  },
  {
    title: "الفعاليات",
    description: "ورش وأنشطة",
    href: "/student/events",
    icon: Calendar,
    key: "events",
  },
  {
    title: "الشهادات",
    description: "مكتبة الشهادات",
    href: "/student/certificates",
    icon: Award,
    key: "certificates",
  },
  {
    title: "الملاحظات",
    description: "مدخلات قاعدة المعرفة",
    href: "/notes",
    icon: StickyNote,
    key: "notes",
  },
  {
    title: "الصعوبات",
    description: "تصنيف التحديات",
    href: "/student/difficulties",
    icon: AlertTriangle,
    key: "difficulties",
  },
];

export default function AdminProgramsHub() {
  const token = useSelector((state) => state.auth.token);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL;
    const load = async () => {
      setLoading(true);
      const [courses, events, certificates, notes, difficulties] = await Promise.all([
        fetchCount(`${base}/courses`, token),
        fetchCount(`${base}/events`, token),
        fetchCount(`${base}/certificates`, token),
        fetchCount(`${base}/notes`, token),
        fetchCount(`${base}/difficulties`, token),
      ]);
      setCounts({
        courses,
        events,
        certificates,
        notes,
        difficulties,
      });
      setLoading(false);
    };
    load();
  }, [token]);

  return (
    <>
      <div className="space-y-6">
        <AdminPageHeader
          title="البرامج والمحتوى"
          description="أعداد مسجّلة من نفس مسارات القوائم المستخدمة في التطبيق. استخدم الروابط للإنشاء والتعديل الكامل."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hubs.map((hub) => {
            const Icon = hub.icon;
            const n = counts[hub.key];
            return (
              <Card key={hub.key}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-brand-600" />
                      {hub.title}
                    </CardTitle>
                    <CardDescription>{hub.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-text-muted">السجلات</p>
                    <p className="text-2xl font-medium text-text-primary">
                      {loading ? "…" : n === null ? "—" : n}
                    </p>
                  </div>
                  <Link
                    to={hub.href}
                    className="inline-flex items-center gap-1 text-xs font-medium text-text-brand hover:underline"
                  >
                    إدارة
                    <ArrowUpLeft className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
