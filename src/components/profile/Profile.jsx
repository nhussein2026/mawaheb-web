import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ScrollText, CalendarDays, BookOpen, Trophy, ChevronLeft, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Avatar } from "../ui/Avatar";
import { StatusBadge, HonorBadge } from "../ui/Badge";
import { EmptyState, SkeletonCard } from "../ui/Feedback";
import { formatRoleAr } from "../admin/adminCopy";
import { useResource } from "../../hooks/useResource";
import { API_BASE_URL } from "../../services/api/config";
import { formatDate, formatNumber } from "../../utils/format";
import { completionPercent } from "../../utils/profileCompletion";

const GENDER_LABELS = { male: "ذكر", female: "أنثى" };

const editLinkCls =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-control bg-surface px-4 text-sm font-semibold text-text-primary hover:bg-subtle [&_svg]:size-5";

function ExternalLink({ href }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" dir="ltr" className="break-all text-brand-strong underline underline-offset-4">
      {href.replace(/^https?:\/\//, "")}
    </a>
  );
}

const STAT_LABELS = [
  ["certificates", "الشهادات", "/student/certificates"],
  ["courses", "الدورات", "/student/courses"],
  ["events", "الفعاليات", "/student/events"],
  ["achievements", "الإنجازات", "/student/achievements"],
  ["notes", "الملاحظات", "/notes"],
  ["tickets", "التذاكر", "/student/tickets"],
  ["semesters", "الفصول الدراسية", "/semester-list"],
  ["financialReports", "التقارير المالية", "/student/financial-report"],
  ["studentReports", "تقارير الطالب", "/student-report"],
];

const QUICK_LINKS = [
  { to: "/student/certificates", label: "شهاداتي", icon: ScrollText },
  { to: "/student/events", label: "الفعاليات", icon: CalendarDays },
  { to: "/student/courses", label: "الدورات", icon: BookOpen },
  { to: "/student/achievements", label: "الإنجازات", icon: Trophy },
];

const STUDENT_ROLES = ["Scholarship Student", "Institute Student"];

// Description list (§4.7): label above value on phones, 35% label column from md.
function Details({ items }) {
  return (
    <dl className="divide-y divide-border-subtle">
      {items.map(([label, value]) => (
        <div key={label} className="grid gap-0.5 py-3 md:grid-cols-[35%_1fr] md:gap-3">
          <dt className="text-sm text-text-tertiary">{label}</dt>
          <dd className="text-sm text-text-primary" dir="auto">
            {value || (
              <>
                <span aria-hidden="true">—</span>
                <span className="sr-only">غير مُدخل</span>
              </>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// "My profile": account identity for everyone, and the academic record,
// counts and journey for students.
const Profile = () => {
  const token = useSelector((state) => state.auth.token);
  const { data: profile, status, reload } = useResource(
    async () => {
      const response = await fetch(`${API_BASE_URL}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    },
    [token],
    { initial: null, select: (d) => d }
  );

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <SkeletonCard lines={3} />
        <SkeletonCard lines={6} />
      </div>
    );
  }
  if (status === "failed" || !profile) {
    return (
      <Card>
        <EmptyState kind="failed" title="تعذّر تحميل الملف الشخصي" onRetry={reload} />
      </Card>
    );
  }

  const user = profile.user || {};
  const role = user.role;
  const isStudent = STUDENT_ROLES.includes(role);
  const sp = profile.studentProfile || profile.scholarshipStudentProfile || profile.instituteStudentProfile || {};
  const stats = profile.statistics || {};
  const program = role === "Institute Student" ? sp.education_level : sp.program_of_study;
  const percent = completionPercent(user);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col items-start gap-4 pt-5 sm:flex-row sm:items-center sm:pt-6">
          <Avatar name={user.name} src={user.imageUrl} size={96} />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-[22px] font-semibold leading-[34px] text-text-primary sm:text-heading-2">{user.name}</h1>
              {role ? <StatusBadge tone="info">{formatRoleAr(role)}</StatusBadge> : null}
            </div>
            {user.email ? (
              <p className="text-sm text-text-tertiary">
                <bdi>{user.email}</bdi>
              </p>
            ) : null}
            {isStudent ? (
              <p className="text-sm text-text-secondary">
                {program || "البرنامج غير مُدخل"} · {profile.university?.name || "الجامعة غير مُدخلة"}
              </p>
            ) : null}
          </div>
          <Link to="/profile/edit" className={`${editLinkCls} max-sm:w-full`}>
            <Pencil aria-hidden="true" />
            تعديل الملف الشخصي
          </Link>
        </CardContent>
        {isStudent ? (
          <ul className="grid grid-cols-2 gap-px border-t border-border-subtle bg-border-subtle sm:grid-cols-3 lg:grid-cols-5">
            {STAT_LABELS.filter(([key]) => stats[key] != null).map(([key, label, to]) => (
              <li key={key} className="bg-surface">
                <Link to={to} className="block px-4 py-3 hover:bg-subtle sm:px-6">
                  <span className="block text-label-sm text-text-secondary">{label}</span>
                  <span className="num block font-display text-xl font-bold text-text-primary">{formatNumber(stats[key])}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </Card>

      {percent < 100 ? (
        <Card variant="award">
          <CardContent className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:pt-6">
            <div className="min-w-0 flex-1 space-y-2">
              <p className="font-semibold text-text-primary">
                ملفك مكتمل بنسبة <span className="num">{percent}%</span>
              </p>
              <div
                role="progressbar"
                aria-label="اكتمال الملف الشخصي"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                className="h-2 overflow-hidden rounded-full bg-surface"
              >
                <div className="h-full rounded-full bg-brand-strong" style={{ width: `${percent}%` }} />
              </div>
              <p className="text-sm text-text-secondary">أضف ما ينقص ليتعرّف عليك فريق المؤسسة ويصل إليك بسهولة.</p>
            </div>
            <Link
              to="/profile/edit"
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-brand-strong px-4 text-sm font-semibold text-brand-on-strong hover:bg-brand-strong-hover"
            >
              أكمل ملفك
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>المعلومات الشخصية</CardTitle>
        </CardHeader>
        <CardContent>
          {user.bio ? (
            <p dir="auto" className="reading mb-3 whitespace-pre-line text-sm text-text-primary">
              {user.bio}
            </p>
          ) : null}
          <Details
            items={[
              ["رقم الهاتف", user.phone_number ? <bdi className="num">{user.phone_number}</bdi> : null],
              ["تاريخ الميلاد", user.date_of_birth ? <span className="num">{formatDate(user.date_of_birth)}</span> : null],
              ["الجنس", GENDER_LABELS[user.gender] || user.gender],
              ["المستوى التعليمي الحالي", user.current_education_level],
              ["LinkedIn", user.linkedin_link ? <ExternalLink href={user.linkedin_link} /> : null],
              ["الموقع الشخصي", user.website ? <ExternalLink href={user.website} /> : null],
            ]}
          />
        </CardContent>
      </Card>

      {isStudent ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الأكاديمية</CardTitle>
              </CardHeader>
              <CardContent>
                <Details
                  items={
                    role === "Institute Student"
                      ? [
                          ["المستوى التعليمي", sp.education_level],
                          ["الموهبة", sp.talent],
                          ["هاتف ولي الأمر", sp.parent_phone ? <bdi className="num">{sp.parent_phone}</bdi> : null],
                        ]
                      : [
                          ["الرقم الجامعي", sp.student_university_id ? <bdi className="num">{sp.student_university_id}</bdi> : null],
                          ["سنة التسجيل", sp.enrollment_year],
                          ["السنة المتوقعة للتخرج", sp.expected_graduation_year],
                          ["نوع الجامعة", sp.type_of_university],
                          ["الموقع", [sp.city, sp.country_of_studying].filter(Boolean).join("، ")],
                        ]
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المسار الأكاديمي</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.academicTimeline?.length ? (
                  <ol className="space-y-4 border-s-2 border-border-default ps-5">
                    {profile.academicTimeline.map((ev, i) => (
                      <li key={i} className="relative">
                        <span className="absolute -start-[27px] top-1.5 size-3 rounded-full border-2 border-surface bg-brand-strong" aria-hidden="true" />
                        <p className="font-semibold text-text-primary">{ev.title}</p>
                        <p className="num text-xs text-text-tertiary">{formatDate(ev.date, ev.date)}</p>
                        {ev.description ? <p className="mt-1 text-sm text-text-secondary">{ev.description}</p> : null}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <EmptyState kind="first-use" compact title="لا توجد محطات في مسارك بعد" />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>أبرز الإنجازات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.achievements?.length ? (
                  <ul className="space-y-2">
                    {profile.achievements.slice(0, 5).map((a, i) => (
                      <li key={a._id || i} className="flex items-start justify-between gap-2 rounded-md bg-subtle px-3 py-2">
                        <span dir="auto" className="text-sm font-semibold text-text-primary">
                          {a.title}
                        </span>
                        {a.verified ? <HonorBadge /> : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <EmptyState kind="first-use" compact title="لم تُضف إنجازات بعد" />
                )}
                <Link
                  to="/student/achievements"
                  className="inline-flex h-10 w-full items-center justify-center rounded-md border border-border-control bg-surface text-sm font-semibold text-text-primary hover:bg-subtle"
                >
                  إضافة إنجاز
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>روابط سريعة</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-border-subtle">
                  {QUICK_LINKS.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="flex min-h-11 items-center gap-3 rounded-md px-1 text-sm text-text-primary hover:bg-subtle">
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
        </div>
      ) : null}
    </div>
  );
};

export default Profile;
