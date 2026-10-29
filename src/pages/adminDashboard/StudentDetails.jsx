import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Chip } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/Feedback";
import { formatDate } from "../../utils/format";

const CATEGORY_TITLES = {
  reports: "التقارير",
  tickets: "التذاكر",
  certificates: "الشهادات",
  financialReports: "التقارير المالية",
  userAchievements: "الإنجازات",
  courses: "الدورات",
};

// The record each report links to, in display order.
const LINKED = [
  { key: "certificateId", label: "شهادة", body: "description", image: "certificate_image", link: "certificate_link" },
  { key: "courseId", label: "دورة", body: "description", image: "course_image" },
  { key: "userAchievementId", label: "إنجاز", body: "description", image: "achievement_image", meta: "category" },
  { key: "eventId", label: "فعالية", body: "description", image: "photo" },
  { key: "noteId", label: "ملاحظة", body: "content" },
  { key: "difficultyId", label: "صعوبة", body: "description" },
];

const ExtLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 font-semibold text-brand-strong underline underline-offset-4"
  >
    {children}
    <ExternalLink className="icon-dir size-4" aria-hidden="true" />
    <span className="sr-only">(يفتح في نافذة جديدة)</span>
  </a>
);

const Thumb = ({ src, alt }) =>
  src ? (
    <a href={src} target="_blank" rel="noopener noreferrer" className="mt-2 block w-fit">
      <img src={src} alt={alt} loading="lazy" className="max-h-40 max-w-xs rounded-md border border-border-default object-cover" />
    </a>
  ) : null;

// One item: title, optional chip, body, date, image and link.
function Item({ title, chip, body, date, image, link }) {
  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 dir="auto" className="text-heading-4 text-text-primary">
          {title || "بدون عنوان"}
        </h3>
        {date ? <span className="num text-xs text-text-tertiary">{formatDate(date)}</span> : null}
      </div>
      {chip ? <Chip className="mt-1">{chip}</Chip> : null}
      {body ? (
        <p dir="auto" className="reading mt-1 whitespace-pre-wrap text-sm text-text-secondary">
          {body}
        </p>
      ) : null}
      {link ? (
        <p className="mt-1 text-sm">
          <ExtLink href={link}>رابط التحقق</ExtLink>
        </p>
      ) : null}
      <Thumb src={image} alt={title || ""} />
    </li>
  );
}

function renderItems(user, category) {
  switch (category) {
    case "reports":
      return (user.reports || []).map((r, i) => (
        <li key={r._id || i} className="py-4 first:pt-0 last:pb-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 dir="auto" className="text-heading-4 text-text-primary">
              {r.title || "بدون عنوان"}
            </h3>
            <span className="num text-xs text-text-tertiary">{formatDate(r.date_of_report || r.createdAt)}</span>
          </div>
          <ul className="mt-3 space-y-3 border-s-2 border-border-default ps-4">
            {LINKED.filter((l) => r[l.key]).map((l) => {
              const rec = r[l.key];
              return (
                <li key={l.key}>
                  <p className="text-label-sm text-text-tertiary">{l.label}</p>
                  <p dir="auto" className="font-semibold text-text-primary">
                    {rec.title}
                  </p>
                  {l.meta && rec[l.meta] ? <Chip className="mt-1">{rec[l.meta]}</Chip> : null}
                  {rec[l.body] ? (
                    <p dir="auto" className="reading text-sm text-text-secondary">
                      {rec[l.body]}
                    </p>
                  ) : null}
                  {l.link && rec[l.link] ? <ExtLink href={rec[l.link]}>رابط التحقق</ExtLink> : null}
                  <Thumb src={l.image ? rec[l.image] : null} alt={rec.title || ""} />
                </li>
              );
            })}
          </ul>
        </li>
      ));
    case "financialReports":
      return (user.financialReports || []).map((r, i) => (
        <Item key={r._id || i} title={r.title} body={r.description} date={r.date_of_report} image={r.financial_report_image} />
      ));
    case "tickets":
      return (user.tickets || []).map((t, i) => <Item key={t._id || i} title={t.title} body={t.description} date={t.createdAt} />);
    case "certificates":
      return (user.certificates || []).map((c, i) => (
        <Item key={c._id || i} title={c.title} body={c.description} link={c.certificate_link} image={c.certificate_image} />
      ));
    case "userAchievements":
      return (user.achievements || []).map((a, i) => (
        <Item key={a._id || i} title={a.title} chip={a.category} body={a.description} image={a.achievement_image} />
      ));
    case "courses":
      return (user.courses || []).map((c, i) => <Item key={c._id || i} title={c.title} body={c.description} image={c.course_image} />);
    default:
      return [];
  }
}

/**
 * One student's records in a category. Rendered with `user` and `category`
 * props; opened directly at /student/details without them, it explains how
 * to reach a student instead of showing a blank page.
 */
const StudentDetails = ({ user, category }) => {
  if (!user || !category) {
    return (
      <div className="space-y-6">
        <PageHeader title="تفاصيل الطالب" />
        <Card>
          <EmptyState
            kind="first-use"
            title="لم يُحدَّد طالب"
            description="افتح الطالب من صفحة تقارير الطلاب أو التحليلات لعرض سجلاته."
            action={
              <Link
                to="/admin-dashboard/reports"
                className="inline-flex h-10 items-center rounded-md bg-brand-strong px-4 text-sm font-semibold text-brand-on-strong hover:bg-brand-strong-hover"
              >
                تقارير الطلاب
              </Link>
            }
          />
        </Card>
      </div>
    );
  }

  const items = renderItems(user, category);
  const title = CATEGORY_TITLES[category] || "التفاصيل";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title} · <bdi>{user.name}</bdi>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length ? (
          <ul className="divide-y divide-border-subtle">{items}</ul>
        ) : (
          <EmptyState kind="first-use" compact title={`لا توجد ${title} لهذا الطالب`} />
        )}
      </CardContent>
    </Card>
  );
};

export default StudentDetails;
