import {
  PlusIcon,
  DocumentIcon,
  CalendarIcon,
  BookOpenIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ShieldCheckIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";

/* ─────────────────────────────────────────────
   COLOR TOKENS (unchanged)
   ───────────────────────────────────────────── */
const tokens = {
  surfacePage: "#F5F3EE",
  surfaceCard: "#FAFAF7",
  surfaceNav: "#0D2018",
  surfaceHeader: "#1A3A2A",
  brand50: "#EAF3EC",
  brand100: "#C2DFC8",
  brand200: "#92C49C",
  brand400: "#4E9963",
  brand600: "#296E42",
  brand800: "#1A3A2A",
  brand900: "#0D2018",
  accent50: "#FDF6E3",
  accent100: "#F9E4A0",
  accent200: "#F0C95A",
  accent400: "#D4A843",
  accent600: "#B07A1A",
  accent800: "#7A5A0A",
  accent900: "#3D2D04",
  neutral50: "#FAFAF7",
  neutral100: "#F5F3EE",
  neutral200: "#E8E4D8",
  neutral300: "#C8C3B2",
  neutral500: "#9A9588",
  neutral700: "#5E5A52",
  neutral900: "#2E2C28",
  successBg: "#EAF3EC",
  successBorder: "#92C49C",
  successText: "#296E42",
  successDark: "#1A3A2A",
  warningBg: "#FEF0E6",
  warningText: "#C05B1A",
  errorBg: "#FDECEC",
  errorText: "#C03030",
  awardBg: "#FDF6E3",
  awardBorder: "#F0C95A",
  awardText: "#B07A1A",
  awardDark: "#3D2D04",
  textPrimary: "#2E2C28",
  textSecondary: "#5E5A52",
  textMuted: "#9A9588",
  textInverse: "#FAFAF7",
  textBrand: "#296E42",
  textAccent: "#B07A1A",
  borderSubtle: "#E8E4D8",
  borderDefault: "#C8C3B2",
  borderBrand: "#296E42",
  borderAccent: "#D4A843",
};

/* ─────────────────────────────────────────────
   ARABIC TRANSLATIONS (all UI strings)
   ───────────────────────────────────────────── */
const translations = {
  roles: {
    Admin: "مدير",
    Employee: "موظف",
    "Institute Student": "طالب معهد",
    "Scholarship Student": "طالب مبتعث",
  },
  programNotAvailable: "البرنامج غير متوفر",
  educationLevel: "المستوى التعليمي",
  talent: "الموهبة",
  parentPhone: "هاتف ولي الأمر",
  studentAt: "طالب في",
  universityNotAvailable: "الجامعة غير متوفرة",
  certificates: "الشهادات",
  courses: "الدورات",
  financialReports: "التقارير المالية",
  notes: "الملاحظات",
  semesters: "الفصول الدراسية",
  tickets: "التذاكر",
  events: "الفعاليات",
  achievements: "الإنجازات",
  studentReports: "تقارير الطالب",
  academicInformation: "المعلومات الأكاديمية",
  universityId: "الرقم الجامعي",
  enrollmentYear: "سنة التسجيل",
  expectedGraduation: "السنة المتوقعة للتخرج",
  universityType: "نوع الجامعة",
  location: "الموقع",
  notAvailable: "غير متوفر",
  academicJourney: "المسار الأكاديمي",
  addMilestone: "أضف محطة",
  featuredAchievements: "أبرز الإنجازات",
  addNewAchievement: "أضف إنجازًا جديدًا",
  quickLinks: "روابط سريعة",
  myCertificates: "شهاداتي",
  eventsLink: "الفعاليات",
  coursesLink: "الدورات",
  achievementsLink: "الإنجازات",
  fetchError: "حدث خطأ في تحميل الملف الشخصي.",
};

/* ─────────────────────────────────────────────
   ROLE BADGE (Arabic role names)
   ───────────────────────────────────────────── */
const roleConfig = {
  Admin: {
    bg: tokens.errorBg,
    text: tokens.errorText,
    border: "#F0BABA",
    icon: <ShieldCheckIcon className="w-3.5 h-3.5 ml-1" />,
  },
  Employee: {
    bg: tokens.brand50,
    text: tokens.brand600,
    border: tokens.brand200,
    icon: <BriefcaseIcon className="w-3.5 h-3.5 ml-1" />,
  },
  "Institute Student": {
    bg: tokens.successBg,
    text: tokens.successText,
    border: tokens.successBorder,
    icon: <AcademicCapIcon className="w-3.5 h-3.5 ml-1" />,
  },
  "Scholarship Student": {
    bg: tokens.awardBg,
    text: tokens.awardText,
    border: tokens.awardBorder,
    icon: <BanknotesIcon className="w-3.5 h-3.5 ml-1" />,
  },
};

const RoleBadge = ({ role }) => {
  const cfg = roleConfig[role] || {
    bg: tokens.neutral200,
    text: tokens.neutral700,
    border: tokens.borderDefault,
  };
  const displayRole = translations.roles[role] || role;
  return (
    <span
      style={{
        backgroundColor: cfg.bg,
        color: cfg.text,
        border: `0.5px solid ${cfg.border}`,
        borderRadius: "9999px",
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 12px",
        fontSize: "12px",
        fontWeight: 500,
      }}
    >
      {cfg.icon}
      {displayRole}
    </span>
  );
};

/* ─────────────────────────────────────────────
   STAT BADGE (Arabic labels)
   ───────────────────────────────────────────── */
const statLabels = {
  Certificates: translations.certificates,
  Courses: translations.courses,
  "Financial Reports": translations.financialReports,
  Notes: translations.notes,
  Semesters: translations.semesters,
  Tickets: translations.tickets,
  Events: translations.events,
  Achievements: translations.achievements,
  "Student Reports": translations.studentReports,
};

const StatBadge = ({ count, label }) => (
  <div
    style={{
      backgroundColor: tokens.accent50,
      border: `0.5px solid ${tokens.awardBorder}`,
      borderRadius: "9999px",
      padding: "4px 12px",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "12px",
    }}
  >
    <span style={{ color: tokens.awardDark, fontWeight: 500 }}>
      {count ?? 0}
    </span>
    <span style={{ color: tokens.textSecondary }}>{statLabels[label] || label}</span>
  </div>
);

/* ─────────────────────────────────────────────
   SECTION CARD
   ───────────────────────────────────────────── */
const SectionCard = ({ title, children }) => (
  <div
    style={{
      backgroundColor: tokens.surfaceCard,
      border: `0.5px solid ${tokens.borderSubtle}`,
      borderRadius: "12px",
      padding: "20px 24px",
    }}
  >
    <h2
      style={{
        fontSize: "16px",
        fontWeight: 500,
        color: tokens.brand800,
        marginBottom: "16px",
        paddingBottom: "10px",
        borderBottom: `2px solid ${tokens.accent400}`,
      }}
    >
      {title}
    </h2>
    {children}
  </div>
);

/* ─────────────────────────────────────────────
   DETAIL ITEM
   ───────────────────────────────────────────── */
const DetailItem = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 0",
      borderBottom: `0.5px solid ${tokens.borderSubtle}`,
      gap: "12px",
    }}
  >
    <span style={{ color: tokens.textSecondary, fontSize: "13px", flexShrink: 0 }}>
      {label}
    </span>
    <span
      style={{
        color: tokens.textPrimary,
        fontSize: "13px",
        fontWeight: 500,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {value || translations.notAvailable}
    </span>
  </div>
);

/* ─────────────────────────────────────────────
   TIMELINE
   ───────────────────────────────────────────── */
const Timeline = ({ children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
    {children}
  </div>
);

const TimelineItem = ({ date, title, description }) => (
  <div
    style={{
      display: "flex",
      gap: "12px",
      paddingBottom: "16px",
      position: "relative",
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "16px" }}>
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: tokens.brand400,
          border: `2px solid ${tokens.brand200}`,
          marginTop: "3px",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          width: "1px",
          flex: 1,
          backgroundColor: tokens.borderSubtle,
          marginTop: "4px",
        }}
      />
    </div>
    <div style={{ paddingBottom: "4px" }}>
      <div style={{ fontWeight: 500, fontSize: "13px", color: tokens.textPrimary }}>
        {title}
      </div>
      <div style={{ fontSize: "11px", color: tokens.textMuted, marginTop: "2px" }}>
        {date}
      </div>
      {description && (
        <div style={{ fontSize: "12px", color: tokens.textSecondary, marginTop: "4px" }}>
          {description}
        </div>
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   ACHIEVEMENT BADGE
   ───────────────────────────────────────────── */
const AchievementBadge = ({ title, date }) => (
  <div
    style={{
      backgroundColor: tokens.awardBg,
      border: `0.5px solid ${tokens.awardBorder}`,
      borderRadius: "8px",
      padding: "10px 12px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <span style={{ fontWeight: 500, fontSize: "13px", color: tokens.awardDark }}>
      {title}
    </span>
    <span
      style={{
        fontSize: "11px",
        color: tokens.awardText,
        backgroundColor: tokens.accent100,
        borderRadius: "9999px",
        padding: "2px 8px",
      }}
    >
      {date}
    </span>
  </div>
);

/* ─────────────────────────────────────────────
   ACTION BUTTON (Arabic labels)
   ───────────────────────────────────────────── */
const ActionButton = ({ icon, label }) => (
  <button
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      padding: "12px 8px",
      backgroundColor: tokens.brand50,
      border: `0.5px solid ${tokens.brand200}`,
      borderRadius: "8px",
      color: tokens.brand800,
      fontSize: "12px",
      fontWeight: 500,
      cursor: "pointer",
      transition: "background-color 0.15s ease",
      width: "100%",
    }}
    onMouseEnter={e => (e.currentTarget.style.backgroundColor = tokens.brand100)}
    onMouseLeave={e => (e.currentTarget.style.backgroundColor = tokens.brand50)}
  >
    {React.cloneElement(icon, { style: { width: "20px", height: "20px", color: tokens.brand600 } })}
    <span style={{ textAlign: "center", lineHeight: 1.3 }}>{label}</span>
  </button>
);

/* ─────────────────────────────────────────────
   MAIN PROFILE COMPONENT (RTL + Arabic)
   ───────────────────────────────────────────── */
const Profile = () => {
  const token = useSelector((state) => state.auth.token);
  const [profile, setProfile] = useState();

  const studentProfile =
    profile?.studentProfile ||
    profile?.scholarshipStudentProfile ||
    profile?.instituteStudentProfile;
  const role = profile?.user?.role;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error(translations.fetchError);
        const userData = await response.json();
        setProfile(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error(error.message);
      }
    };
    if (token) fetchUserProfile();
  }, [token]);

  return (
    <div dir="rtl" style={{ minHeight: "100vh", backgroundColor: tokens.surfacePage, padding: "24px 32px" }}>
      {/* Header Card */}
      <div
        style={{
          backgroundColor: tokens.surfaceCard,
          border: `0.5px solid ${tokens.borderSubtle}`,
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              backgroundColor: tokens.brand800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: tokens.textInverse,
              fontSize: "32px",
              fontWeight: 500,
              flexShrink: 0,
              border: `3px solid ${tokens.accent400}`,
            }}
          >
            {profile?.user.name?.[0] ?? "—"}
          </div>
          <div style={{ flex: 1, minWidth: "240px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <h1 style={{ fontSize: "22px", fontWeight: 500, color: tokens.textPrimary, margin: 0 }}>
                {profile?.user.name}
              </h1>
              <RoleBadge role={profile?.user.role} />
              <span style={{ color: tokens.accent400, fontSize: "18px", lineHeight: 1 }}>★</span>
            </div>
            <p style={{ color: tokens.textSecondary, fontSize: "13px", marginBottom: "14px" }}>
              {role === "Institute Student"
                ? studentProfile?.education_level || translations.programNotAvailable
                : studentProfile?.program_of_study || translations.programNotAvailable}{" "}
              · {translations.studentAt} {profile?.university?.name || translations.universityNotAvailable}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {[
                ["Certificates", profile?.statistics?.certificates],
                ["Courses", profile?.statistics?.courses],
                ["Financial Reports", profile?.statistics?.financialReports],
                ["Notes", profile?.statistics?.notes],
                ["Semesters", profile?.statistics?.semesters],
                ["Tickets", profile?.statistics?.tickets],
                ["Events", profile?.statistics?.events],
                ["Achievements", profile?.statistics?.achievements],
                ["Student Reports", profile?.statistics?.studentReports],
              ].map(([label, count]) => (
                <StatBadge key={label} count={count} label={label} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: "24px", alignItems: "start" }}>
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <SectionCard title={translations.academicInformation}>
              {role === "Institute Student" ? (
                <>
                  <DetailItem label={translations.educationLevel} value={studentProfile?.education_level} />
                  <DetailItem label={translations.talent} value={studentProfile?.talent} />
                  <DetailItem label={translations.parentPhone} value={studentProfile?.parent_phone} />
                </>
              ) : (
                <>
                  <DetailItem label={translations.universityId} value={studentProfile?.student_university_id} />
                  <DetailItem label={translations.enrollmentYear} value={studentProfile?.enrollment_year} />
                  <DetailItem
                    label={translations.expectedGraduation}
                    value={studentProfile?.expected_graduation_year || translations.notAvailable}
                  />
                  <DetailItem label={translations.universityType} value={studentProfile?.type_of_university} />
                  <DetailItem
                    label={translations.location}
                    value={studentProfile ? `${studentProfile.city}, ${studentProfile.country_of_studying}` : null}
                  />
                </>
              )}
            </SectionCard>
            <SectionCard title={translations.academicJourney}>
              <Timeline>
                {profile?.academicTimeline?.map((event, index) => (
                  <TimelineItem key={index} date={event.date} title={event.title} description={event.description} />
                ))}
              </Timeline>
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "12px",
                  backgroundColor: "transparent",
                  border: "none",
                  color: tokens.brand600,
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  padding: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = tokens.brand800)}
                onMouseLeave={e => (e.currentTarget.style.color = tokens.brand600)}
              >
                <PlusIcon style={{ width: "16px", height: "16px" }} />
                {translations.addMilestone}
              </button>
            </SectionCard>
          </div>
          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <SectionCard title={translations.featuredAchievements}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {profile?.achievements?.map((achievement, index) => (
                  <AchievementBadge key={index} title={achievement.title} date={achievement.date} />
                ))}
                <button
                  style={{
                    width: "100%",
                    padding: "9px 0",
                    backgroundColor: tokens.accent400,
                    color: tokens.accent900,
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: "pointer",
                    marginTop: "4px",
                    transition: "background-color 0.15s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = tokens.accent200)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = tokens.accent400)}
                >
                  {translations.addNewAchievement}
                </button>
              </div>
            </SectionCard>
            <SectionCard title={translations.quickLinks}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <ActionButton icon={<DocumentIcon />} label={translations.myCertificates} />
                <ActionButton icon={<CalendarIcon />} label={translations.eventsLink} />
                <ActionButton icon={<BookOpenIcon />} label={translations.coursesLink} />
                <ActionButton icon={<TrophyIcon />} label={translations.achievementsLink} />
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;