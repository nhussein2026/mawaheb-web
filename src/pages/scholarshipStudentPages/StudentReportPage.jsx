import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import StudentLayout from "../../components/layout/StudentLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  FileText,
  PlusCircle,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  Layout,
  BookOpen,
  Trophy,
  AlertTriangle,
  Calendar,
  Award
} from "lucide-react";
import StudentReportForm from './StudentReport';

const StudentReportPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingReportId, setEditingReportId] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReports, setExpandedReports] = useState(new Set());
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchReports();
  }, [token]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/studentReports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setReports(data.studentReports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleReportExpansion = (reportId) => {
    const newExpanded = new Set(expandedReports);
    if (newExpanded.has(reportId)) {
      newExpanded.delete(reportId);
    } else {
      newExpanded.add(reportId);
    }
    setExpandedReports(newExpanded);
  };

  const sectionConfig = {
    course: { icon: BookOpen, title: "الدورة", color: "bg-brand-50 border-brand-100", iconColor: "text-brand-600" },
    note: { icon: FileText, title: "الملاحظة", color: "bg-neutral-50 border-border-subtle", iconColor: "text-text-primary" },
    difficulty: { icon: AlertTriangle, title: "الصعوبات", color: "bg-error-bg border-error-border", iconColor: "text-error-text" },
    userAchievement: { icon: Trophy, title: "الإنجاز", color: "bg-success-bg border-success-border", iconColor: "text-success-text" },
    event: { icon: Calendar, title: "الفعالية", color: "bg-accent-50 border-accent-100", iconColor: "text-accent-600" },
    certificate: { icon: Award, title: "الشهادة", color: "bg-brand-50 border-brand-100", iconColor: "text-brand-600" },
  };

  const handleSaveReport = () => {
    setShowForm(false);
    setEditingReportId(null);
    fetchReports();
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-surface-card p-6 rounded-2xl shadow-sm border border-border-subtle gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <FileText className="text-brand-600" />
              مركز التقارير الدراسية
            </h1>
            <p className="text-text-secondary text-sm">إدارة وتقديم تقاريرك الدورية لمتابعة تقدمك الدراسي.</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "secondary" : "primary"}>
            {showForm ? "إغلاق النموذج" : (
              <>
                <PlusCircle className="ml-2 w-4 h-4" />
                إنشاء تقرير جديد
              </>
            )}
          </Button>
        </div>

        {/* Report Form Component */}
        {showForm && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <StudentReportForm reportId={editingReportId} onSave={handleSaveReport} />
          </div>
        )}

        {/* Existing Reports Section */}
        {!showForm && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <FolderOpen className="text-brand-600" size={20} />
              <h2 className="text-xl font-bold text-text-primary">تقاريري السابقة</h2>
            </div>

            {reports.length === 0 ? (
              <Card className="p-20 text-center border-none shadow-sm bg-surface-card">
                <FileText className="h-20 w-20 text-neutral-200 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-text-muted">لا توجد تقارير حالياً</h3>
                <p className="text-text-secondary max-w-sm mx-auto mb-8">ابدأ بتسجيل أول تقرير دراسي لك في المنصة لتتبع إنجازاتك.</p>
                <Button onClick={() => setShowForm(true)} variant="primary">
                  إنشاء أول تقرير
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {reports.map((report) => {
                  const isExpanded = expandedReports.has(report._id);
                  return (
                    <div
                      key={report._id}
                      className="bg-surface-card rounded-2xl shadow-sm border border-border-subtle overflow-hidden transition-all hover:border-brand-200"
                    >
                      <div className="p-6 cursor-pointer group" onClick={() => toggleReportExpansion(report._id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100">
                              <Layout size={24} />
                            </div>
                            <div>
                              <h2 className="text-lg font-bold text-text-primary group-hover:text-brand-600 transition-colors">
                                {report.title || "تقرير بدون عنوان"}
                              </h2>
                              <p className="text-xs text-text-secondary font-medium">
                                تم التقديم في: {report.date_of_report ? new Date(report.date_of_report).toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric' }) : "—"}
                              </p>
                            </div>
                          </div>
                          <div className={`p-2 rounded-lg transition-all ${isExpanded ? 'bg-brand-50 text-brand-600' : 'text-text-muted group-hover:bg-neutral-50'}`}>
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-6 pb-6 border-t border-border-subtle pt-6 bg-neutral-50/20">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(sectionConfig).map(([key, config]) => {
                              const data = report[`${key}Id`] || report[`${key}sId`];
                              if (!data) return null;
                              return (
                                <div key={key} className={`rounded-2xl border p-5 bg-white shadow-sm transition-all hover:shadow-md ${config.color}`}>
                                  <div className="flex items-center gap-2 mb-4 border-b border-white/50 pb-2">
                                    <div className="p-1.5 rounded-lg bg-white shadow-sm">
                                      <config.icon className={config.iconColor} size={16} />
                                    </div>
                                    <h3 className={`text-[10px] font-bold uppercase tracking-wider ${config.iconColor}`}>{config.title}</h3>
                                  </div>
                                  <p className="text-sm text-text-primary font-bold leading-tight mb-1">{data.title}</p>
                                  {data.description && <p className="text-[11px] text-text-secondary line-clamp-2">{data.description}</p>}
                                </div>
                              );
                            })}
                          </div>
                          <div className="mt-6 flex justify-end">
                            <Button variant="ghost" onClick={() => { setEditingReportId(report._id); setShowForm(true); }} className="text-brand-600 hover:bg-brand-50 text-xs font-bold">
                              تعديل هذا التقرير
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentReportPage;
