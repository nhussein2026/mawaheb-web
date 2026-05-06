import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  GraduationCap,
  MapPin,
  Building2,
  BookOpen,
  Calendar,
  Edit3,
  Save,
  X,
  Info,
  Building
} from "lucide-react";
import Loading from "../../components/ui/Loading";

const ScholarshipStudent = () => {
  const token = useSelector((state) => state.auth.token);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasRecord, setHasRecord] = useState(false);
  const [formData, setFormData] = useState({
    country_of_studying: "",
    city: "",
    university: "",
    type_of_university: "",
    program_of_study: "",
    student_university_id: "",
    enrollment_year: "",
    expected_graduation_year: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/scholarship-student`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(response.data);
      setHasRecord(response.data.length > 0);
      setLoading(false);
    } catch (err) {
      toast.error("فشل في تحميل بيانات الطالب");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      if (editMode) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/scholarship-student/${currentStudentId}`,
          formData,
          config
        );
        toast.success("تم تحديث البيانات بنجاح");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/scholarship-student`,
          formData,
          config
        );
        toast.success("تم إنشاء السجل بنجاح");
      }

      fetchStudents();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ ما");
    }
  };

  const handleEdit = (student) => {
    setFormData({
      country_of_studying: student.country_of_studying,
      city: student.city,
      university: student.university,
      type_of_university: student.type_of_university,
      program_of_study: student.program_of_study,
      student_university_id: student.student_university_id,
      enrollment_year: student.enrollment_year,
      expected_graduation_year: student.expected_graduation_year,
    });
    setEditMode(true);
    setCurrentStudentId(student._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      country_of_studying: "",
      city: "",
      university: "",
      type_of_university: "",
      program_of_study: "",
      student_university_id: "",
      enrollment_year: "",
      expected_graduation_year: "",
    });
    setEditMode(false);
    setCurrentStudentId(null);
  };

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-card p-6 rounded-2xl shadow-sm border border-border-subtle gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <GraduationCap className="text-brand-600" />
              بيانات المنحة الدراسية
            </h1>
            <p className="text-text-secondary text-sm">إدارة وتحديث بياناتك الأكاديمية والجامعية.</p>
          </div>
          {!editMode && hasRecord && (
            <Button onClick={() => handleEdit(students[0])} variant="primary">
              <Edit3 className="ml-2 w-4 h-4" />
              تعديل البيانات
            </Button>
          )}
        </div>

        {/* Info message when user has a record but not in edit mode */}
        {hasRecord && !editMode && (
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 flex items-start gap-3">
            <Info className="text-brand-600 mt-0.5" size={20} />
            <div>
              <h3 className="text-sm font-bold text-brand-900">لديك سجل منحة دراسية مفعل</h3>
              <p className="text-xs text-brand-700 mt-1">
                يمكنك تحديث معلوماتك الحالية من خلال زر التعديل. لا يمكنك إنشاء أكثر من سجل واحد.
              </p>
            </div>
          </div>
        )}

        {/* Show form only if user doesn't have a record OR is in edit mode */}
        {(!hasRecord || editMode) && (
          <Card className="border-brand-200 shadow-lg overflow-hidden">
            <div className="bg-brand-900 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-800/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <h2 className="text-xl font-bold relative z-10">
                {editMode ? "تعديل السجل الحالي" : "إنشاء سجل جديد"}
              </h2>
              <p className="text-brand-200 text-xs mt-1 relative z-10">يرجى إدخال البيانات الأكاديمية بدقة لضمان صحة السجلات.</p>
            </div>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                      <MapPin size={16} className="text-brand-400" />
                      بلد الدراسة
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all"
                      value={formData.country_of_studying}
                      onChange={(e) => setFormData({ ...formData, country_of_studying: e.target.value })}
                      placeholder="مثال: المملكة العربية السعودية"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                      <MapPin size={16} className="text-brand-400" />
                      المدينة
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="مثال: الرياض"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                      <Building2 size={16} className="text-brand-400" />
                      الجامعة
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all"
                      value={formData.university}
                      onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                      placeholder="مثال: جامعة الملك سعود"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                      <Building size={16} className="text-brand-400" />
                      نوع الجامعة
                    </label>
                    <select
                      className="w-full p-3 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all appearance-none"
                      value={formData.type_of_university}
                      onChange={(e) => setFormData({ ...formData, type_of_university: e.target.value })}
                      required
                    >
                      <option value="">اختر النوع</option>
                      <option value="Public">حكومية</option>
                      <option value="Private">أهلية</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                      <BookOpen size={16} className="text-brand-400" />
                      التخصص الدراسي
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all"
                      value={formData.program_of_study}
                      onChange={(e) => setFormData({ ...formData, program_of_study: e.target.value })}
                      placeholder="مثال: هندسة برمجيات"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                      <GraduationCap size={16} className="text-brand-400" />
                      الرقم الجامعي
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all"
                      value={formData.student_university_id}
                      onChange={(e) => setFormData({ ...formData, student_university_id: e.target.value })}
                      placeholder="أدخل رقمك الجامعي"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                      <Calendar size={16} className="text-brand-400" />
                      سنة الالتحاق
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all"
                      value={formData.enrollment_year}
                      onChange={(e) => setFormData({ ...formData, enrollment_year: e.target.value })}
                      min="1900"
                      max="2099"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
                      <Calendar size={16} className="text-brand-400" />
                      سنة التخرج المتوقعة
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all"
                      value={formData.expected_graduation_year}
                      onChange={(e) => setFormData({ ...formData, expected_graduation_year: e.target.value })}
                      min="1900"
                      max="2099"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-border-subtle">
                  {editMode && (
                    <Button type="button" variant="ghost" onClick={resetForm} className="text-text-muted hover:text-error-text">
                      <X className="ml-2 w-4 h-4" />
                      إلغاء التعديل
                    </Button>
                  )}
                  <Button type="submit" variant="primary" className="px-10">
                    <Save className="ml-2 w-4 h-4" />
                    {editMode ? "تحديث البيانات" : "حفظ السجل"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Show data table */}
        <div className="bg-surface-card shadow-sm rounded-2xl border border-border-subtle overflow-hidden">
          <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center">
            <h2 className="text-lg font-bold text-text-primary">
              {hasRecord ? "السجل الحالي" : "لا توجد سجلات"}
            </h2>
          </div>

          {hasRecord ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-subtle">الجامعة</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-subtle">التخصص</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-subtle">سنة الالتحاق</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider border-b border-border-subtle text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-text-primary font-medium">{student.university}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{student.program_of_study}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{student.enrollment_year}</td>
                      <td className="px-6 py-4 text-sm text-left">
                        <Button
                          onClick={() => handleEdit(student)}
                          variant="ghost"
                          size="sm"
                          className="text-brand-600 hover:bg-brand-50"
                        >
                          <Edit3 size={14} className="ml-1" />
                          تعديل
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <GraduationCap className="mx-auto h-16 w-16 text-neutral-200 mb-4" />
              <h3 className="text-lg font-bold text-text-primary">لا توجد بيانات مسجلة</h3>
              <p className="text-text-secondary text-sm mt-1">ابدأ بإضافة بيانات المنحة الدراسية الخاصة بك.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ScholarshipStudent;
