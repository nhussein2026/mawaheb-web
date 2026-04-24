import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import defaultProfileImage from "../assets/images/No-profile-pic.jpg";
import EditProfileModal from "../components/common/EditProfileModal";
import {
  FaLinkedin,
  FaGlobe,
  FaCertificate,
  FaBook,
  FaCalendarAlt,
  FaTrophy,
} from "react-icons/fa";
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [statistics, setStatistics] = useState({
    certificates: 0,
    courses: 0,
    events: 0,
    achievements: 0,
  });
  console.log("profile data: ", profile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const token = useSelector((state) => state.auth.token);

  // to visualize the style without calling backend we may use
  // useEffect(() => {
  //   const mockProfile = {
  //     imageUrl: "",
  //     name: "Nasser Hussein",
  //     email: "*****@example.com",
  //     university: "ABC University",
  //     department: "Engineering",
  //     gpa: "3.9",
  //     certificates: 8,
  //     courses: 12,
  //     events: 5,
  //     achievements: 10,
  //     bio: "Passionate about software development and open-source projects.",
  //     phone_number: "123-456-7890",
  //     date_of_birth: "1995-05-15",
  //     gender: "Male",
  //     current_education_level: "Nasser Hussein",
  //     linkedin_link: "https://www.linkedin.com/in/nhussein2026",
  //     website: "https://nhussein.io",
  //     role: "Student",
  //   };
  //   setProfile(mockProfile);
  //   setLoading(false);
  // }, []);

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
        setProfile(userData.user);
        console.log("this is data: ", userData);
        setStatistics(userData.statistics);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const handleSaveProfile = async (updatedProfile) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProfile),
        }
      );
      if (!response.ok) throw new Error("Failed to update profile.");
      const data = await response.json();
      setProfile(data.user);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">
          Failed to load profile information.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Profile Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          <div className="relative group">
            <img
              src={profile.imageUrl || defaultProfileImage}
              alt={`${profile.name}'s Profile`}
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-lg hover:border-gold transition-all duration-300"
            />
          </div>

          {/* Personal Information */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {profile.name}
            </h1>
            <p className="text-gray-600 mb-4">
              {profile.role} •{" "}
              {profile.university || "University not specified"}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-gray-500 mr-2">📧</span>
                <span className="text-gray-700 truncate">{profile.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-gray-500 mr-2">🎓</span>
                <span className="text-gray-700">
                  {profile.department || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-gray-500 mr-2">⭐</span>
                <span className="text-gray-700">
                  GPA: {profile.gpa || "N/A"}
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center md:justify-start space-x-4 mb-4">
              {profile.linkedin_link && (
                <a
                  href={profile.linkedin_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FaLinkedin className="mr-2" />
                  LinkedIn
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                >
                  <FaGlobe className="mr-2" />
                  Website
                </a>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-gold hover:bg-mutedGold text-white px-6 py-2 rounded-lg transition-colors duration-200 self-start md:self-center"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<FaCertificate className="w-6 h-6" />}
          value={statistics.certificates}
          label="Certificates"
          color="text-blue-500"
        />
        <StatCard
          icon={<FaBook className="w-6 h-6" />}
          value={statistics.courses}
          label="Courses"
          color="text-green-500"
        />
        <StatCard
          icon={<FaCalendarAlt className="w-6 h-6" />}
          value={statistics.events}
          label="Events"
          color="text-purple-500"
        />
        <StatCard
          icon={<FaTrophy className="w-6 h-6" />}
          value={statistics.achievements}
          label="Achievements"
          color="text-red-500"
        />
      </div>

      {/* Additional Information Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Me</h2>
        <p className="text-gray-600 mb-6">
          {profile.bio || "No bio available"}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InfoItem label="Phone" value={profile.phone_number} />
          <InfoItem label="Date of Birth" value={profile.date_of_birth} />
          <InfoItem label="Gender" value={profile.gender} />
          <InfoItem
            label="Education Level"
            value={profile.current_education_level}
          />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, value, label, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div className={`${color} bg-opacity-10 p-3 rounded-lg`}>{icon}</div>
      <div className="text-right">
        <p className="text-3xl font-bold text-gray-800">{value || 0}</p>
        <p className="text-gray-500">{label}</p>
      </div>
    </div>
  </div>
);

// Reusable Info Item Component
const InfoItem = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-gray-700 font-medium">{value || "N/A"}</p>
  </div>
);

export default ProfilePage;
