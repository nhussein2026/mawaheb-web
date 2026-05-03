import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import StudentLayout from "../../components/layout/StudentLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  FileText,
  User,
  BookOpen,
  AlertTriangle,
  Trophy,
  Calendar,
  Award,
  ChevronRight,
  Filter
} from "lucide-react";

const AllReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/allReports`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }

        const data = await response.json();
        if (data.studentReports) {
          setReports(data.studentReports);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [token]);

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
        <div className="flex flex-col md:flex-row justify-between items-center bg-surface-card p-6 rounded-2xl shadow-sm border border-border-subtle gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <FileText className="text-brand-600" />
              تقارير الطلاب
            </h1>
            <p className="text-text-secondary text-sm">استعراض كافة تقارير الطلاب المسجلة في المنصة.</p>
          </div>
          <Button variant="outline" className="text-text-secondary border-border-default">
            <Filter size={16} className="ml-2" />
            تصفية النتائج
          </Button>
        </div>

        {reports.length === 0 ? (
          <Card className="p-20 text-center border-none shadow-sm bg-surface-card">
            <FileText className="h-20 w-20 text-neutral-200 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-text-muted">لا توجد تقارير متاحة</h3>
            <p className="text-text-secondary max-w-sm mx-auto">لم يتم العثور على أي تقارير طلاب في النظام حالياً.</p>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Card key={report._id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow group">
                <CardContent className="p-0">
                  <div className="p-5 border-b border-border-subtle bg-neutral-50/50 group-hover:bg-brand-50/30 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-lg font-bold text-text-primary group-hover:text-brand-600 transition-colors leading-tight">
                        {report.title || "تقرير بدون عنوان"}
                      </h2>
                      <div className="p-1.5 rounded-lg bg-white shadow-sm border border-border-subtle text-brand-600">
                        <FileText size={16} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-muted font-medium">
                      <Calendar size={14} className="text-brand-400" />
                      {new Date(report.date_of_report).toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-text-muted">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">بواسطة</p>
                          <p className="text-text-primary font-bold">{report.userId?.name || "طالب مجهول"}</p>
                        </div>
                      </div>

                      {report.courseId && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                            <BookOpen size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">الدورة</p>
                            <p className="text-text-primary font-medium">{report.courseId.name || report.courseId.title}</p>
                          </div>
                        </div>
                      )}

                      {report.difficultiesId && report.difficultiesId.length > 0 && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-error-bg flex items-center justify-center text-error-text">
                            <AlertTriangle size={16} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">الصعوبات</p>
                            <p className="text-text-primary font-medium">{report.difficultiesId.map(d => d.name || d.title).join(', ')}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border-subtle flex justify-between items-center">
                      <div className="flex gap-1.5">
                        {report.userAchievementId && (
                          <div title="يحتوي على إنجاز" className="w-7 h-7 rounded-full bg-success-bg text-success-text flex items-center justify-center border border-success-border">
                            <Trophy size={14} />
                          </div>
                        )}
                        {report.certificateId && (
                          <div title="يحتوي على شهادة" className="w-7 h-7 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center border border-accent-100">
                            <Award size={14} />
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" className="text-brand-600 text-xs font-bold p-0 h-auto hover:bg-transparent">
                        تفاصيل التقرير
                        <ChevronRight size={14} className="mr-1 rotate-180" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default AllReports;
