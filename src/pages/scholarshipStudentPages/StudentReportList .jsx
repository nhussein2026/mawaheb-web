import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  BookOpen,
  FileText,
  AlertTriangle,
  Trophy,
  Calendar,
  Award,
  Eye,
  ChevronDown,
  ChevronUp,
  XCircle,
  Clock,
  FolderOpen,
  Search,
  ExternalLink
} from "lucide-react";

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
      icon: BookOpen,
      title: "المقرر الدراسي",
      color: "bg-brand-50 border-brand-100",
      iconColor: "text-brand-600",
      fields: ["title", "description", "course_image"],
    },
    note: {
      icon: FileText,
      title: "ملاحظة",
      color: "bg-accent-50 border-accent-100",
      iconColor: "text-accent-600",
      fields: ["title", "description"],
    },
    difficulty: {
      icon: AlertTriangle,
      title: "صعوبة",
      color: "bg-error-bg border-error-border",
      iconColor: "text-error-text",
      fields: ["title", "description"],
    },
    userAchievement: {
      icon: Trophy,
      title: "إنجاز",
      color: "bg-success-bg border-success-border",
      iconColor: "text-success-text",
      fields: ["title", "description", "category", "achievement_image"],
    },
    event: {
      icon: Calendar,
      title: "فعالية",
      color: "bg-neutral-50 border-border-subtle",
      iconColor: "text-text-primary",
      fields: ["title", "description", "photo"],
    },
    certificate: {
      icon: Award,
      title: "شهادة",
      color: "bg-brand-50 border-brand-100",
      iconColor: "text-brand-600",
      fields: ["title", "description", "certificate_image", "certificate_link"],
    },
  };

  const renderImagePreview = (src, alt, className = "") => {
    if (!src) return <span className="text-text-muted text-xs">لا توجد صورة</span>;

    return (
      <div className={`relative group ${className} w-20 h-20`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-xl border border-border-subtle cursor-pointer hover:opacity-80 transition-all"
          onClick={() => setSelectedImageModal({ src, alt })}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-surface-overlay opacity-0 group-hover:opacity-100 rounded-xl transition-all">
          <Eye className="h-5 w-5 text-white" />
        </div>
      </div>
    );
  };

  const renderSectionContent = (report, sectionKey) => {
    const config = sectionConfig[sectionKey];
    const data = report[`${sectionKey}Id`] || report[`${sectionKey}sId`];

    if (!data) {
      return (
        <div className="text-center py-6 text-text-muted border border-dashed border-border-subtle rounded-xl">
          <config.icon className="h-6 w-6 mx-auto mb-2 opacity-30" />
          <p className="text-xs">لا توجد بيانات {config.title}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {data.title && (
          <div>
            <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">العنوان</h4>
            <p className="text-sm font-medium text-text-primary">{data.title}</p>
          </div>
        )}

        {data.description && (
          <div>
            <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">الوصف</h4>
            <p className="text-xs text-text-secondary leading-relaxed">{data.description}</p>
          </div>
        )}

        {data.category && (
          <div>
            <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">الفئة</h4>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-brand-600 border border-brand-100">
              {data.category}
            </span>
          </div>
        )}

        {(data.course_image ||
          data.achievement_image ||
          data.certificate_image ||
          data.photo) && (
          <div>
            <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">الصورة</h4>
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
          <div className="pt-2">
            <a
              href={data.certificate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              عرض الشهادة
            </a>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="max-w-md mx-auto text-center py-20">
          <XCircle className="h-16 w-16 text-error-text mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-primary mb-2">خطأ في تحميل التقارير</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            إعادة المحاولة
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center bg-surface-card p-6 rounded-2xl shadow-sm border border-border-subtle gap-4">
          <div className="text-center md:text-right">
            <h1 className="text-2xl font-bold text-text-primary flex items-center justify-center md:justify-start gap-2">
              <FileText className="text-brand-600" />
              تقاريري الدراسية
            </h1>
            <p className="text-text-secondary text-sm mt-1">إجمالي {reports.length} تقرير تم العثور عليه.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                placeholder="بحث في التقارير..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all text-sm"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all text-sm appearance-none"
            >
              <option value="date">حسب التاريخ</option>
              <option value="title">حسب العنوان</option>
            </select>
          </div>
        </div>

        {filteredAndSortedReports.length === 0 ? (
          <Card className="p-20 text-center border-none shadow-sm bg-surface-card">
            <FolderOpen className="h-20 w-20 text-neutral-200 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-text-primary mb-2">
              {searchTerm ? "لا توجد نتائج مطابقة لبحثك" : "لا توجد تقارير حالياً"}
            </h3>
            <p className="text-text-secondary max-w-sm mx-auto">
              {searchTerm
                ? "حاول تغيير كلمات البحث أو الفلاتر المستخدمة."
                : "ابدأ بتسجيل أول تقرير دراسي لك في المنصة."}
            </p>
            {searchTerm && (
              <Button onClick={() => setSearchTerm("")} variant="ghost" className="mt-4 text-brand-600">
                مسح البحث
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedReports.map((report) => {
              const isExpanded = expandedReports.has(report._id);

              return (
                <div
                  key={report._id}
                  className="bg-surface-card rounded-2xl shadow-sm border border-border-subtle overflow-hidden transition-all hover:border-brand-200"
                >
                  <div className="p-6 cursor-pointer" onClick={() => toggleReportExpansion(report._id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-text-primary mb-2 group-hover:text-brand-600 transition-colors">
                          {report.title || "تقرير بدون عنوان"}
                        </h2>
                        <div className="flex items-center text-xs text-text-secondary gap-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-brand-400" />
                            {new Date(report.date_of_report).toLocaleDateString("ar-SA", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-brand-400" />
                            {new Date(report.createdAt || report.date_of_report).toLocaleTimeString("ar-SA", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      <div className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-brand-50 text-brand-600' : 'text-text-muted hover:bg-neutral-50'}`}>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-6 pt-0 border-t border-border-subtle bg-neutral-50/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-6">
                        {Object.entries(sectionConfig).map(([key, config]) => {
                          const IconComponent = config.icon;

                          return (
                            <div
                              key={key}
                              className={`rounded-2xl border p-5 bg-white shadow-sm transition-all hover:shadow-md ${config.color}`}
                            >
                              <div className="flex items-center gap-3 mb-5 border-b border-white/50 pb-3">
                                <div className={`p-2 rounded-xl bg-white shadow-sm ${config.iconColor}`}>
                                  <IconComponent size={18} />
                                </div>
                                <h3 className="font-bold text-text-primary text-sm">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-overlay backdrop-blur-md" onClick={() => setSelectedImageModal(null)}>
            <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImageModal(null)}
                className="absolute -top-12 right-0 text-white hover:text-accent-400 transition-colors"
              >
                <XCircle size={32} />
              </button>
              <img
                src={selectedImageModal.src}
                alt={selectedImageModal.alt}
                className="w-full h-auto rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentReportList;
