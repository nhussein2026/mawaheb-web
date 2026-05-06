import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  FileText,
  PlusCircle,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Trophy,
  AlertTriangle,
  Calendar,
  Award,
  X,
  CalendarDays,
  StickyNote,
  BarChart3,
  Sparkles,
} from "lucide-react";
import StudentReportForm from "./StudentReport";

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/studentReports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReports(data.studentReports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpansion = (id) => {
    const next = new Set(expandedReports);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedReports(next);
  };

  const handleSaveReport = () => {
    setShowForm(false);
    setEditingReportId(null);
    fetchReports();
  };

  const handleNewReport = () => {
    setEditingReportId(null);
    setShowForm(true);
    setTimeout(() => {
      document.getElementById("report-form-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const sectionConfig = {
    course: { icon: BookOpen, title: "الدورة", iconColor: "text-brand-600", bg: "bg-brand-50", border: "border-brand-100" },
    note: { icon: StickyNote, title: "الملاحظة", iconColor: "text-neutral-600", bg: "bg-neutral-50", border: "border-neutral-200" },
    difficulty: { icon: AlertTriangle, title: "الصعوبة", iconColor: "text-error-text", bg: "bg-error-bg", border: "border-error-border" },
    userAchievement: { icon: Trophy, title: "الإنجاز", iconColor: "text-success-text", bg: "bg-success-bg", border: "border-success-border" },
    event: { icon: CalendarDays, title: "الفعالية", iconColor: "text-accent-600", bg: "bg-accent-50", border: "border-accent-100" },
    certificate: { icon: Award, title: "الشهادة", iconColor: "text-accent-600", bg: "bg-accent-50", border: "border-accent-100" },
  };

  return (
    <>
      <div className="space-y-8 pb-10">

        {/* ══ Hero Header ══ */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 p-8 md:p-10 shadow-2xl shadow-brand-900/40">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-brand-700/40 blur-3xl" />
            <div className="absolute -bottom-10 right-10 w-48 h-48 rounded-full bg-accent-400/10 blur-2xl" />
            <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-brand-600/20 blur-xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3.5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shrink-0">
                <FileText size={28} className="text-accent-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={14} className="text-accent-400" />
                  <span className="text-[10px] font-bold text-accent-400 uppercase tracking-[3px]">بوابة التقارير</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  مركز التقارير الدراسية
                </h1>
                <p className="text-brand-300 text-sm mt-1.5">
                  إدارة وتقديم تقاريرك الدورية لمتابعة تقدمك الأكاديمي
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Stats badge */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <BarChart3 size={16} className="text-accent-300" />
                <span className="text-sm font-bold text-white">{reports.length}</span>
                <span className="text-xs text-brand-300">تقرير</span>
              </div>
              {/* CTA button */}
              {!showForm ? (
                <button
                  onClick={handleNewReport}
                  className="flex items-center gap-2 px-5 py-2.5 bg-accent-400 hover:bg-accent-200 text-accent-900 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-accent-900/20 hover:shadow-accent-900/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlusCircle size={18} />
                  إنشاء تقرير جديد
                </button>
              ) : (
                <button
                  onClick={() => { setShowForm(false); setEditingReportId(null); }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm transition-all border border-white/20"
                >
                  <X size={16} />
                  إغلاق النموذج
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ══ Report Form (inline) ══ */}
        {showForm && (
          <div id="report-form-anchor" className="animate-in fade-in slide-in-from-top-4 duration-500">
            <StudentReportForm reportId={editingReportId} onSave={handleSaveReport} />
          </div>
        )}

        {/* ══ Reports List ══ */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 rounded-xl">
              <FolderOpen size={18} className="text-brand-600" />
            </div>
            <h2 className="text-lg font-bold text-text-primary">تقاريري السابقة</h2>
            {reports.length > 0 && (
              <span className="ml-auto px-3 py-1 text-xs font-bold bg-brand-50 text-brand-700 rounded-full border border-brand-100">
                {reports.length} تقرير
              </span>
            )}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-neutral-100 animate-pulse" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            /* Empty state */
            <Card className="border-none shadow-sm bg-surface-card">
              <CardContent className="py-20 flex flex-col items-center text-center gap-4">
                <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center border border-brand-100">
                  <FileText size={36} className="text-brand-200" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-muted">لا توجد تقارير حالياً</h3>
                  <p className="text-sm text-text-muted/70 mt-1 max-w-xs">
                    ابدأ بتسجيل أول تقرير دراسي لك لتتبع إنجازاتك وتقدمك الأكاديمي.
                  </p>
                </div>
                <button
                  onClick={handleNewReport}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-800 hover:bg-brand-600 text-white rounded-xl font-bold text-sm transition-all mt-2"
                >
                  <PlusCircle size={16} />
                  إنشاء أول تقرير
                </button>
              </CardContent>
            </Card>
          ) : (
            /* Report cards */
            <div className="space-y-3">
              {reports.map((report) => {
                const isExpanded = expandedReports.has(report._id);
                const dateStr = report.date_of_report
                  ? new Date(report.date_of_report).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })
                  : "—";
                const filledSections = Object.keys(sectionConfig).filter(
                  (k) => report[`${k}Id`] || report[`${k}sId`]
                );

                return (
                  <div
                    key={report._id}
                    className="bg-surface-card rounded-2xl border border-border-subtle shadow-sm overflow-hidden transition-all hover:border-brand-200 hover:shadow-md group"
                  >
                    {/* Card Header (clickable) */}
                    <div
                      className="p-5 cursor-pointer select-none"
                      onClick={() => toggleExpansion(report._id)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100 shrink-0 group-hover:bg-brand-100 transition-colors">
                            <FileText size={22} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-text-primary group-hover:text-brand-700 transition-colors truncate">
                              {report.title || "تقرير بدون عنوان"}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="flex items-center gap-1 text-xs text-text-muted">
                                <Calendar size={11} />
                                {dateStr}
                              </span>
                              {filledSections.length > 0 && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-success-text bg-success-bg px-2 py-0.5 rounded-full border border-success-border">
                                  {filledSections.length} عناصر
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Section icons preview */}
                          <div className="hidden sm:flex items-center gap-1">
                            {filledSections.slice(0, 4).map((key) => {
                              const cfg = sectionConfig[key];
                              return (
                                <div key={key} className={`w-7 h-7 rounded-lg ${cfg.bg} border ${cfg.border} flex items-center justify-center`}>
                                  <cfg.icon size={12} className={cfg.iconColor} />
                                </div>
                              );
                            })}
                          </div>
                          <div className={`p-1.5 rounded-xl transition-all ${isExpanded ? "bg-brand-100 text-brand-600 rotate-0" : "text-text-muted group-hover:bg-neutral-100"}`}>
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-border-subtle bg-neutral-50/60 px-5 pb-5 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        {filledSections.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {Object.entries(sectionConfig).map(([key, cfg]) => {
                              const data = report[`${key}Id`] || report[`${key}sId`];
                              if (!data) return null;
                              return (
                                <div key={key} className={`rounded-2xl border p-4 ${cfg.bg} ${cfg.border} transition-all hover:shadow-sm`}>
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 rounded-lg bg-white shadow-sm">
                                      <cfg.icon size={13} className={cfg.iconColor} />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.iconColor}`}>
                                      {cfg.title}
                                    </span>
                                  </div>
                                  <p className="text-sm font-bold text-text-primary leading-snug">{data.title}</p>
                                  {data.description && (
                                    <p className="text-[11px] text-text-secondary mt-1 line-clamp-2">{data.description}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-text-muted text-center py-4">لا توجد تفاصيل مرفقة بهذا التقرير.</p>
                        )}
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => { setEditingReportId(report._id); setShowForm(true); }}
                            className="text-xs font-bold text-brand-600 hover:text-brand-800 hover:bg-brand-50 px-4 py-2 rounded-xl transition-colors"
                          >
                            تعديل هذا التقرير ←
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentReportPage;
