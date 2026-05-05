// src/components/SemestersList.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import SemesterForm from "./SemesterForm";
import StudentLayout from "../../components/layout/StudentLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  Edit3,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  GraduationCap
} from "lucide-react";
import Loading from "../../components/ui/Loading";

const API_URL = import.meta.env.VITE_API_URL;

export default function SemestersList() {
  const token = useSelector((state) => state.auth.token);
  const [semesters, setSemesters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSemesters, setExpandedSemesters] = useState({});
  const [viewingImage, setViewingImage] = useState(null);

  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await api.get("/semester/all");
      setSemesters(response.data);
      const initialExpanded = {};
      response.data.forEach((sem) => {
        initialExpanded[sem._id] = false;
      });
      setExpandedSemesters(initialExpanded);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingSemester?._id) {
        await api.put(`/semester/${editingSemester._id}`, formData);
      } else {
        await api.post("/semester", formData);
      }
      fetchSemesters();
      setShowForm(false);
      setEditingSemester(null);
    } catch (error) {
      console.error("Error saving semester:", error);
    }
  };

  const deleteSemester = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الفصل؟")) {
      try {
        await api.delete(`/semester/${id}`);
        fetchSemesters();
      } catch (error) {
        console.error("Error deleting semester:", error);
      }
    }
  };

  const toggleSemester = (id) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading)
    return (
      <StudentLayout>
        <Loading />
      </StudentLayout>
    );

  return (
    <StudentLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-card p-6 rounded-2xl shadow-sm border border-border-subtle gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <GraduationCap className="text-brand-600" />
              السجل الأكاديمي
            </h1>
            <p className="text-text-secondary text-sm">تابع معدلك الدراسي وفصولك الدراسية السابقة.</p>
          </div>
          <Button onClick={() => setShowForm(true)} variant="primary">
            <Plus className="ml-2 w-4 h-4" />
            إضافة فصل دراسي
          </Button>
        </div>

        {showForm && (
          <div className="bg-surface-card p-6 rounded-2xl shadow-lg border border-brand-200">
            <SemesterForm
              initialData={editingSemester || { semesterNumber: "", semesterGPA: "", totalGPA: "", courses: [], resultImage: null }}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditingSemester(null); }}
            />
          </div>
        )}

        {viewingImage && (
          <div className="fixed inset-0 bg-surface-overlay backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer" onClick={() => setViewingImage(null)}>
            <img src={viewingImage} alt="Result" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
          </div>
        )}

        {semesters.length === 0 ? (
          <Card className="p-12 text-center border-none shadow-sm">
            <GraduationCap className="h-16 w-16 text-neutral-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">لا يوجد فصول دراسية</h3>
            <p className="text-text-secondary">ابدأ بإضافة أول فصل دراسي لك الآن.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {[...semesters].sort((a, b) => a.semesterNumber - b.semesterNumber).map((semester) => (
              <div key={semester._id} className="bg-surface-card rounded-2xl shadow-sm border border-border-subtle overflow-hidden transition-all hover:border-brand-200">
                <div className="p-6 cursor-pointer" onClick={() => toggleSemester(semester._id)}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-brand-50 text-brand-800 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border border-brand-200">
                        {semester.semesterNumber}
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-text-primary">الفصل الدراسي {semester.semesterNumber}</h2>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <div className="bg-success-bg px-3 py-0.5 rounded-full text-[11px] font-medium text-success-text border border-success-border uppercase tracking-wider">
                            المعدل الفصلي: {semester.semesterGPA || "0.0"}
                          </div>
                          <div className="bg-accent-50 px-3 py-0.5 rounded-full text-[11px] font-medium text-accent-600 border border-accent-100 uppercase tracking-wider">
                            المعدل التراكمي: {semester.totalGpa || "0.0"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setEditingSemester(semester); setShowForm(true); }} className="p-2 text-text-muted hover:text-brand-600 rounded-lg transition-colors">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteSemester(semester._id); }} className="p-2 text-text-muted hover:text-error-text rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                      <div className="text-border-subtle mx-2">|</div>
                      {expandedSemesters[semester._id] ? <ChevronUp className="text-brand-600" /> : <ChevronDown className="text-text-muted" />}
                    </div>
                  </div>
                </div>

                {expandedSemesters[semester._id] && (
                  <div className="px-6 pb-6 pt-2 border-t border-border-subtle bg-neutral-50/30">
                    <div className="overflow-x-auto rounded-lg border border-border-subtle bg-surface-card">
                      <table className="w-full text-sm text-right">
                        <thead className="bg-neutral-100 text-neutral-700">
                          <tr>
                            <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">كود المادة</th>
                            <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">اسم المادة</th>
                            <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">الدرجة</th>
                            <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">الساعات</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                          {semester.courses.map((course) => (
                            <tr key={course.courseCode} className="hover:bg-brand-50 transition-colors">
                              <td className="px-4 py-3 font-medium text-text-primary">{course.courseCode}</td>
                              <td className="px-4 py-3 text-text-secondary">{course.courseName}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-brand-50 text-brand-800 border border-brand-200">
                                  {course.lg}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-text-secondary">{course.credits}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {semester.resultImage && (
                      <div className="mt-6">
                        <h3 className="font-medium text-text-primary text-sm mb-3 flex items-center gap-2">
                          <ImageIcon size={16} className="text-brand-600" /> صورة النتيجة
                        </h3>
                        <div className="relative w-48 h-32 rounded-xl border-2 border-dashed border-border-subtle overflow-hidden cursor-pointer group bg-neutral-50" onClick={() => setViewingImage(semester.resultImage)}>
                          <img src={semester.resultImage} alt="Results" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-surface-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-medium">عرض الصورة</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
