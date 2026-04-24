import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BookOpenIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  CalendarIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PhotoIcon,
  LinkIcon,
  XCircleIcon,
  ClockIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";

const StudentReportList = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReports, setExpandedReports] = useState(new Set());
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/studentReports`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const data = await response.json();
        setReports(data.studentReports || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

  const toggleReportExpansion = (reportId) => {
    const newExpanded = new Set(expandedReports);
    if (newExpanded.has(reportId)) {
      newExpanded.delete(reportId);
    } else {
      newExpanded.add(reportId);
    }
    setExpandedReports(newExpanded);
  };

  const filteredAndSortedReports = React.useMemo(() => {
    let filtered = reports.filter(
      (report) =>
        report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.courseId?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date_of_report) - new Date(a.date_of_report);
      } else if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      return 0;
    });
  }, [reports, searchTerm, sortBy]);

  const sectionConfig = {
    course: {
      icon: BookOpenIcon,
      title: "Course",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      fields: ["title", "description", "course_image"],
    },
    note: {
      icon: DocumentTextIcon,
      title: "Note",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      fields: ["title", "description"],
    },
    difficulty: {
      icon: ExclamationTriangleIcon,
      title: "Difficulty",
      color: "bg-yellow-50 border-yellow-200",
      iconColor: "text-yellow-600",
      fields: ["title", "description"],
    },
    userAchievement: {
      icon: TrophyIcon,
      title: "Achievement",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      fields: ["title", "description", "category", "achievement_image"],
    },
    event: {
      icon: CalendarDaysIcon,
      title: "Event",
      color: "bg-pink-50 border-pink-200",
      iconColor: "text-pink-600",
      fields: ["title", "description", "photo"],
    },
    certificate: {
      icon: AcademicCapIcon,
      title: "Certificate",
      color: "bg-indigo-50 border-indigo-200",
      iconColor: "text-indigo-600",
      fields: ["title", "description", "certificate_image", "certificate_link"],
    },
  };

  const renderImagePreview = (src, alt, className = "") => {
    if (!src) return <span className="text-gray-400">No image</span>;

    return (
      <div className={`relative group ${className}`}>
        <img
          src={src}
          alt={alt}
          className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-75 transition-opacity"
          onClick={() => setSelectedImageModal({ src, alt })}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all">
          <EyeIcon className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    );
  };

  const renderSectionContent = (report, sectionKey) => {
    const config = sectionConfig[sectionKey];
    const data = report[`${sectionKey}Id`] || report[`${sectionKey}sId`];

    if (!data) {
      return (
        <div className="text-center py-8 text-gray-500">
          <config.icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No {config.title.toLowerCase()} data available</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {data.title && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Title</h4>
            <p className="text-gray-700">{data.title}</p>
          </div>
        )}

        {data.description && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Description</h4>
            <p className="text-gray-700 leading-relaxed">{data.description}</p>
          </div>
        )}

        {data.category && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Category</h4>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {data.category}
            </span>
          </div>
        )}

        {(data.course_image ||
          data.achievement_image ||
          data.certificate_image ||
          data.photo) && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Image</h4>
            {renderImagePreview(
              data.course_image ||
                data.achievement_image ||
                data.certificate_image ||
                data.photo,
              `${config.title} image`
            )}
          </div>
        )}

        {data.certificate_link && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Certificate Link
            </h4>
            <a
              href={data.certificate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <LinkIcon className="h-4 w-4 mr-1" />
              View Certificate
            </a>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Reports
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your Reports
              </h1>
              <p className="text-gray-600">
                {reports.length} {reports.length === 1 ? "report" : "reports"}{" "}
                found
              </p>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports List */}
        {filteredAndSortedReports.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FolderOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchTerm ? "No matching reports found" : "No reports yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search terms or filters."
                : "Get started by creating your first report."}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedReports.map((report) => {
              const isExpanded = expandedReports.has(report._id);

              return (
                <div
                  key={report._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Report Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold text-gray-900 truncate mb-2">
                          {report.title || "Untitled Report"}
                        </h2>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {new Date(report.date_of_report).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {new Date(
                              report.createdAt || report.date_of_report
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleReportExpansion(report._id)}
                        className="ml-4 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                      >
                        {isExpanded ? (
                          <ChevronUpIcon className="h-5 w-5" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Report Content */}
                  {isExpanded && (
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Object.entries(sectionConfig).map(([key, config]) => {
                          const IconComponent = config.icon;

                          return (
                            <div
                              key={key}
                              className={`rounded-lg border p-4 ${config.color}`}
                            >
                              <div className="flex items-center mb-4">
                                <IconComponent
                                  className={`h-5 w-5 mr-2 ${config.iconColor}`}
                                />
                                <h3 className="font-semibold text-gray-900">
                                  {config.title}
                                </h3>
                              </div>
                              {renderSectionContent(report, key)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Image Modal */}
        {selectedImageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImageModal(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 focus:outline-none"
              >
                <XCircleIcon className="h-8 w-8" />
              </button>
              <img
                src={selectedImageModal.src}
                alt={selectedImageModal.alt}
                className="max-w-full max-h-full rounded-lg shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentReportList;
