import { useState, useEffect } from "react";
import { Button } from "../../components/ui/Button";
import { Plus, Trash2, X, Image as ImageIcon, BookOpen } from "lucide-react";

const SemesterForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    semesterNumber: "",
    semesterGPA: "",
    totalGPA: "",
    courses: [],
    resultImage: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        resultImage: initialData.resultImage || null,
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...formData.courses];
    updatedCourses[index][field] = value;
    setFormData({ ...formData, courses: updatedCourses });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, resultImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewCourse = () => {
    setFormData({
      ...formData,
      courses: [
        ...formData.courses,
        {
          courseCode: "",
          courseName: "",
          grade: 0,
          credits: 0,
          ects: 0,
          lg: "AA",
        },
      ],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-surface-overlay backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-surface-card p-8 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border-subtle relative">
        <button onClick={onCancel} className="absolute top-4 left-4 text-text-muted hover:text-error-text transition-colors">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-8 text-text-primary flex items-center gap-2">
          {initialData?._id ? "تعديل بيانات الفصل" : "إضافة فصل دراسي جديد"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary">رقم الفصل</label>
              <input
                type="number"
                name="semesterNumber"
                value={formData.semesterNumber}
                onChange={handleInputChange}
                className="w-full p-3 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all"
                required
                min="1"
                placeholder="1, 2, 3..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary">المعدل الفصلي</label>
              <input
                type="number"
                name="semesterGPA"
                value={formData.semesterGPA}
                onChange={handleInputChange}
                className="w-full p-3 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all"
                step="0.01"
                min="0"
                max="4.0"
                placeholder="0.0 - 4.0"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-text-secondary">المعدل التراكمي</label>
              <input
                type="number"
                name="totalGPA"
                value={formData.totalGPA}
                onChange={handleInputChange}
                className="w-full p-3 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all"
                step="0.01"
                min="0"
                max="4.0"
                placeholder="0.0 - 4.0"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-text-secondary block">صورة السجل / النتيجة</label>
            <div className="border-2 border-dashed border-border-default rounded-2xl p-8 text-center space-y-2 hover:bg-neutral-50 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <ImageIcon className="text-brand-600 mx-auto" size={32} />
              <span className="text-sm text-text-muted block">انقر لرفع صورة النتيجة</span>
            </div>
            {formData.resultImage && (
              <div className="mt-4 p-2 bg-neutral-50 rounded-xl border border-border-subtle inline-block">
                <img
                  src={formData.resultImage}
                  alt="Result preview"
                  className="max-w-xs h-auto max-h-40 object-contain rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <BookOpen className="text-brand-600" size={20} />
                المواد الدراسية
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={addNewCourse}>
                <Plus className="ml-1 w-4 h-4" /> إضافة مادة
              </Button>
            </div>

            <div className="space-y-4">
              {formData.courses.map((course, index) => (
                <div key={index} className="bg-neutral-50 p-6 rounded-2xl border border-border-subtle relative group transition-all hover:border-brand-200">
                  <button
                    type="button"
                    onClick={() => {
                      const updatedCourses = [...formData.courses];
                      updatedCourses.splice(index, 1);
                      setFormData({ ...formData, courses: updatedCourses });
                    }}
                    className="absolute top-4 left-4 text-text-muted hover:text-error-text opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">كود المادة</label>
                      <input
                        type="text"
                        value={course.courseCode}
                        onChange={(e) => handleCourseChange(index, "courseCode", e.target.value)}
                        className="w-full p-2.5 bg-white border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all text-sm"
                        required
                        placeholder="CS101"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">اسم المادة</label>
                      <input
                        type="text"
                        value={course.courseName}
                        onChange={(e) => handleCourseChange(index, "courseName", e.target.value)}
                        className="w-full p-2.5 bg-white border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all text-sm"
                        required
                        placeholder="برمجة 1"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">الدرجة (0-100)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={course.grade}
                        onChange={(e) => handleCourseChange(index, "grade", e.target.value)}
                        className="w-full p-2.5 bg-white border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">الساعات</label>
                      <input
                        type="number"
                        min="0"
                        value={course.credits}
                        onChange={(e) => handleCourseChange(index, "credits", e.target.value)}
                        className="w-full p-2.5 bg-white border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">ECTS</label>
                      <input
                        type="number"
                        min="0"
                        value={course.ects}
                        onChange={(e) => handleCourseChange(index, "ects", e.target.value)}
                        className="w-full p-2.5 bg-white border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider">التقدير</label>
                      <select
                        value={course.lg}
                        onChange={(e) => handleCourseChange(index, "lg", e.target.value)}
                        className="w-full p-2.5 bg-white border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all text-sm appearance-none"
                      >
                        {["AA", "AB", "BA", "BB", "CB", "CC", "DC", "DD", "FF"].map((grade) => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-8 border-t border-border-subtle">
            <Button type="button" variant="ghost" onClick={onCancel} className="text-text-muted">
              إلغاء
            </Button>
            <Button type="submit" variant="primary" className="px-10">
              حفظ بيانات الفصل
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SemesterForm;
