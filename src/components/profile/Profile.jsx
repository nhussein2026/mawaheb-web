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

const Profile = () => {
  const token = useSelector((state) => state.auth.token);
  const [profile, setProfile] = useState();
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
        if (!response.ok) throw new Error("Failed to fetch profile.");
        const userData = await response.json();
        setProfile(userData);
        // setStatistics(userData.statistics);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error(error.message);
      } finally {
        // setLoading(false);
      }
    };
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  // New role display component
  const RoleBadge = ({ role }) => {
    const roleConfig = {
      Admin: {
        color: "bg-red-100 text-red-800",
        icon: <ShieldCheckIcon className="w-4 h-4 mr-1" />,
      },
      Employee: {
        color: "bg-blue-100 text-blue-800",
        icon: <BriefcaseIcon className="w-4 h-4 mr-1" />,
      },
      "Institute Student": {
        color: "bg-green-100 text-green-800",
        icon: <AcademicCapIcon className="w-4 h-4 mr-1" />,
      },
      "Scholarship Student": {
        color: "bg-purple-100 text-purple-800",
        icon: <BanknotesIcon className="w-4 h-4 mr-1" />,
      },
    };

    const config = roleConfig[role] || { color: "bg-gray-100 text-gray-800" };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          config.color
        } ${role ? "mt-2 md:mt-0" : ""}`}
      >
        {config.icon}
        {role}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-veryLightGray p-4 md:p-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-maroon flex items-center justify-center text-white text-4xl font-bold">
            {profile?.user.name[0]}
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-darkMaroon">
                {profile?.user.name}
              </h1>
              <RoleBadge role={profile?.user.role} />
              <span className="text-gold text-xl hidden md:inline-block">
                ★
              </span>
            </div>
            <p className="text-mediumGray text-base md:text-lg">
              {profile?.program_of_study || "Program not available"} Student at{" "}
              {profile?.university?.name || "University not available"}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <StatBadge
                count={profile?.statistics.certificates}
                label="Certificates"
                className="text-sm"
              />
              <StatBadge
                count={profile?.statistics.courses}
                label="Courses"
                className="text-sm"
              />
              <StatBadge
                count={profile?.statistics.financialReports}
                label="Financial Reports"
                className="text-sm"
              />
              <StatBadge
                count={profile?.statistics.notes}
                label="Notes"
                className="text-sm"
              />
              <StatBadge
                count={profile?.statistics.semesters}
                label="Semesters"
                className="text-sm"
              />
              <StatBadge
                count={profile?.statistics.tickets}
                label="Tickets"
                className="text-sm"
              />
              <StatBadge
                count={profile?.statistics.events}
                label="Events"
                className="text-sm"
              />
              <StatBadge
                count={profile?.statistics.achievements}
                label="Achievements"
                className="text-sm"
              />
              <StatBadge
                count={profile?.statistics.studentReports}
                label="Student Reports"
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic Details Section */}
        <div className="md:col-span-2 space-y-6">
          <SectionCard title="Academic Information">
            <DetailItem
              label="University ID"
              value={profile?.scholarshipStudentProfile.student_university_id}
            />
            <DetailItem
              label="Enrollment Year"
              value={profile?.scholarshipStudentProfile.enrollment_year}
            />
            <DetailItem
              label="Expected Graduation"
              value={
                profile?.scholarshipStudentProfile.expected_graduation_year ||
                "Not Available"
              }
            />
            <DetailItem
              label="University Type"
              value={profile?.scholarshipStudentProfile.type_of_university}
            />
            <DetailItem
              label="Location"
              value={`${profile?.scholarshipStudentProfile.city}, ${profile?.scholarshipStudentProfile.country_of_studying}`}
            />
          </SectionCard>

          <SectionCard title="Academic Journey">
            <Timeline>
              {profile?.academicTimeline?.map((event, index) => (
                <TimelineItem
                  key={index}
                  date={event.date}
                  title={event.title}
                  description={event.description}
                />
              ))}
            </Timeline>
            <button className="text-gold hover:text-darkMaroon mt-4 flex items-center">
              <PlusIcon className="w-5 h-5 mr-1" />
              Add Milestone
            </button>
          </SectionCard>
        </div>

        {/* Achievements & Quick Actions */}
        <div className="space-y-6">
          <SectionCard title="Featured Achievements">
            <div className="space-y-4">
              {profile?.achievements?.map((achievement, index) => (
                <AchievementBadge
                  key={index}
                  title={achievement.title}
                  date={achievement.date}
                />
              ))}
              <button className="w-full py-2 bg-lightGold hover:bg-gold text-darkMaroon rounded-lg transition-all">
                Add New Achievement
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Quick Links">
            <div className="grid grid-cols-2 gap-3">
              <ActionButton icon={<DocumentIcon />} label="My Certificates" />
              <ActionButton icon={<CalendarIcon />} label="Events" />
              <ActionButton icon={<BookOpenIcon />} label="Courses" />
              <ActionButton icon={<TrophyIcon />} label="Achievements" />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
export default Profile;

// Helper Components
const StatBadge = ({ count, label }) => (
  <div className="bg-lightGold px-3 py-1 md:px-4 md:py-2 rounded-full text-sm md:text-base">
    <span className="text-darkMaroon font-bold">{count || 0}</span>
    <span className="text-mediumGray ml-1 md:ml-2">{label}</span>
  </div>
);

const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <h2 className="text-xl font-semibold text-maroon mb-4 border-b-2 border-gold pb-2">
      {title}
    </h2>
    {children}
  </div>
);

const DetailItem = ({ label, value }) => (
  <div className="flex flex-col md:flex-row justify-between py-2 border-b border-lightGray">
    <span className="text-mediumGray text-sm md:text-base">{label}</span>
    <span className="text-darkGray font-medium text-sm md:text-base truncate">
      {value || "N/A"}
    </span>
  </div>
);

const Timeline = ({ children }) => <div>{children}</div>;
const TimelineItem = ({ date, title, description }) => (
  <div>
    <strong>{title}</strong> - {date}: {description}
  </div>
);

const AchievementBadge = ({ title, date }) => (
  <div className="bg-gold text-darkMaroon rounded px-3 py-1">
    {title} - {date}
  </div>
);

const ActionButton = ({ icon, label }) => (
  <button className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 p-2 md:p-3 border rounded-lg hover:bg-veryLightGray transition-all text-sm md:text-base">
    {React.cloneElement(icon, { className: "w-5 h-5 md:w-6 md:h-6" })}
    <span className="text-center">{label}</span>
  </button>
);
