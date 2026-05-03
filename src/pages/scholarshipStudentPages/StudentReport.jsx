import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StudentLayout from "../../components/layout/StudentLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  Plus,
  X,
  Check,
  Calendar,
  BookOpen,
  Award,
  Trophy,
  FileText,
  AlertTriangle,
  CalendarDays,
  Pencil,
  Trash2,
  ChevronDown,
  Layout,
  Upload,
  Link as LinkIcon
} from "lucide-react";
import { Loading } from "../../components/ui/Loading";

const StudentReport = ({ reportId, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    courseId: "",
    noteId: "",
    difficultiesId: "",
    userAchievementId: "",
    eventId: "",
    date_of_report: "",
    certificateId: "",
  });
  const [options, setOptions] = useState({
    courses: [],
    notes: [],
    difficulties: [],
    userAchievements: [],
    events: [],
    certificates: [],
  });

  const [creatingNew, setCreatingNew] = useState({
    course: false,
    note: false,
    difficulty: false,
    userAchievement: false,
    event: false,
    certificate: false,
  });

  const [newItems, setNewItems] = useState({
    course: { title: "", description: "", course_image: "" },
    note: { title: "", description: "" },
    difficulty: { title: "", description: "" },
    userAchievement: {
      title: "",
      description: "",
      category: "",
      achievement_image: "",
    },
    event: { title: "", description: "", photo: "" },
    certificate: {
      title: "",
      description: "",
      certificate_image: "",
      certificate_link: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const token = useSelector((state) => state.auth.token);
  const [reports, setReports] = useState([]);

  // Configuration for different item types
  const itemConfig = {
    course: {
      icon: BookOpen,
      label: "الدورة",
      color: "bg-brand-50 border-brand-100 text-brand-700",
      buttonColor: "variant-primary",
      fields: [{ name: "course_image", label: "رابط صورة الدورة", type: "url", icon: Upload }]
    },
    note: {
      icon: FileText,
      label: "الملاحظة",
      color: "bg-neutral-50 border-border-subtle text-text-primary",
      buttonColor: "variant-secondary",
      fields: []
    },
    difficulty: {
      icon: AlertTriangle,
      label: "الصعوبة",
      color: "bg-error-bg border-error-border text-error-text",
      buttonColor: "variant-error",
      fields: []
    },
    userAchievement: {
      icon: Trophy,
      label: "الإنجاز",
      color: "bg-success-bg border-success-border text-success-text",
      buttonColor: "variant-success",
      fields: [
        { name: "category", label: "الفئة", type: "text", icon: Layout },
        { name: "achievement_image", label: "رابط صورة الإنجاز", type: "url", icon: Upload }
      ]
    },
    event: {
      icon: CalendarDays,
      label: "الفعالية",
      color: "bg-accent-50 border-accent-100 text-accent-600",
      buttonColor: "variant-accent",
      fields: [{ name: "photo", label: "رابط صورة الفعالية", type: "url", icon: Upload }]
    },
    certificate: {
      icon: Award,
      label: "الشهادة",
      color: "bg-brand-50 border-brand-100 text-brand-700",
      buttonColor: "variant-primary",
      fields: [
        { name: "certificate_image", label: "رابط صورة الشهادة", type: "url", icon: Upload },
        { name: "certificate_link", label: "رابط الشهادة المباشر", type: "url", icon: LinkIcon }
      ]
    },
  };

  const pluralMap = {
    course: "courses",
    note: "notes",
    difficulty: "difficulties",
    userAchievement: "userAchievements",
    event: "events",
    certificate: "certificates",
  };

  useEffect(() => {
    fetchOptions();
    fetchStudentReports();
  }, [token]);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/studentReports/options`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch options");

      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error("Error fetching options:", error);
      toast.error("فشل تحميل خيارات النموذج");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !options.courses?.length) {
    return (
      <StudentLayout>
        <Loading />
      </StudentLayout>
    );
  }

  const fetchStudentReports = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/studentReports`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch reports");

      const data = await response.json();
      setReports(data.studentReports || data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("فشل تحميل التقارير الحالية");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = "العنوان مطلوب";
    if (!form.date_of_report) errors.date_of_report = "التاريخ مطلوب";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNewItemChange = (e, itemType) => {
    const { name, value } = e.target;
    setNewItems((prevItems) => ({
      ...prevItems,
      [itemType]: { ...prevItems[itemType], [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        reportId
          ? `${import.meta.env.VITE_API_URL}/studentReport/${reportId}`
          : `${import.meta.env.VITE_API_URL}/studentReport`,
        {
          method: reportId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) throw new Error("Failed to save report");

      const data = await response.json();
      if (onSave) onSave(data);
      toast.success(reportId ? "تم تحديث التقرير بنجاح!" : "تم إنشاء التقرير بنجاح!");

      if (!reportId) {
        setForm({
          title: "",
          courseId: "",
          noteId: "",
          difficultiesId: "",
          userAchievementId: "",
          eventId: "",
          date_of_report: "",
          certificateId: "",
        });
      }

      fetchStudentReports();
    } catch (error) {
      console.error("Error saving report:", error);
      toast.error("فشل في حفظ التقرير");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewItem = async (itemType) => {
    const endpoint = itemType === "difficulty" ? "difficulties" : `${itemType}s`;

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newItems[itemType]),
        }
      );

      if (!response.ok) throw new Error(`Failed to create ${itemType}`);

      const newItem = await response.json();
      setOptions((prevOptions) => ({
        ...prevOptions,
        [`${itemType}s`]: [...(prevOptions[`${itemType}s`] || []), newItem],
      }));

      setForm((prevForm) => ({
        ...prevForm,
        [`${itemType}Id`]: newItem._id,
      }));

      setCreatingNew((prevCreatingNew) => ({
        ...prevCreatingNew,
        [itemType]: false,
      }));

      setNewItems((prevNewItems) => ({
        ...prevNewItems,
        [itemType]: getEmptyItemStructure(itemType),
      }));

      toast.success(`تم إنشاء ${itemConfig[itemType].label} بنجاح!`);
    } catch (error) {
      console.error(`Error creating new ${itemType}:`, error);
      toast.error(`فشل في إنشاء ${itemConfig[itemType].label}`);
    } finally {
      setLoading(false);
    }
  };

  const getEmptyItemStructure = (itemType) => {
    const baseStructure = { title: "", description: "" };
    const additions = {
      course: { course_image: "" },
      userAchievement: { category: "", achievement_image: "" },
      event: { photo: "" },
      certificate: { certificate_image: "", certificate_link: "" },
    };
    return { ...baseStructure, ...(additions[itemType] || {}) };
  };

  const renderNewItemForm = (itemType) => {
    const config = itemConfig[itemType];
    const IconComponent = config.icon;

    return (
      <div className={`p-5 rounded-2xl border-2 border-dashed ${config.color} space-y-4 animate-in fade-in slide-in-from-top-4 duration-300`}>
        <div className="flex items-center gap-2 pb-2 border-b border-white/50">
          <div className="p-1.5 rounded-lg bg-white shadow-sm">
            <IconComponent size={16} />
          </div>
          <h4 className="text-sm font-bold">إضافة {config.label} جديد</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-muted px-1 uppercase tracking-wider">العنوان *</label>
            <input
              type="text"
              name="title"
              value={newItems[itemType].title}
              onChange={(e) => handleNewItemChange(e, itemType)}
              className="w-full px-3 py-2 bg-white/80 border border-white/50 rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-text-muted px-1 uppercase tracking-wider">الوصف *</label>
            <textarea
              name="description"
              value={newItems[itemType].description}
              onChange={(e) => handleNewItemChange(e, itemType)}
              className="w-full px-3 py-2 bg-white/80 border border-white/50 rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all text-sm resize-none"
              rows="1"
              required
            />
          </div>
        </div>

        {config.fields.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.fields.map(field => (
              <div key={field.name} className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted px-1 uppercase tracking-wider">{field.label}</label>
                <div className="relative">
                  <field.icon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type={field.type}
                    name={field.name}
                    value={newItems[itemType][field.name]}
                    onChange={(e) => handleNewItemChange(e, itemType)}
                    className="w-full pr-10 pl-3 py-2 bg-white/80 border border-white/50 rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={() => setCreatingNew(prev => ({ ...prev, [itemType]: false }))} className="h-9 px-4 text-xs font-bold text-text-muted hover:text-text-primary">
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={() => handleCreateNewItem(itemType)}
            disabled={loading || !newItems[itemType].title || !newItems[itemType].description}
            className="h-9 px-4 text-xs font-bold bg-brand-800 text-white hover:bg-brand-600"
          >
            <Check size={14} className="ml-1.5" />
            حفظ {config.label}
          </Button>
        </div>
      </div>
    );
  };

  const renderSelectField = (itemType) => {
    const config = itemConfig[itemType];
    const IconComponent = config.icon;
    const pluralKey = pluralMap[itemType];

    return (
      <div className="space-y-2 group">
        <label className="flex items-center gap-2 text-xs font-bold text-text-muted px-1 group-focus-within:text-brand-600 transition-colors uppercase tracking-widest">
          <IconComponent size={14} />
          {config.label}
        </label>

        {creatingNew[itemType] ? (
          renderNewItemForm(itemType)
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                name={`${itemType}Id`}
                value={form[`${itemType}Id`]}
                onChange={handleChange}
                className="w-full pr-4 pl-10 py-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="">اختر {config.label}</option>
                {options[pluralKey]?.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
            </div>
            <Button
              type="button"
              onClick={() => setCreatingNew((prev) => ({ ...prev, [itemType]: true }))}
              variant="outline"
              className="px-3 border-border-default hover:bg-brand-50 hover:border-brand-200 text-brand-600"
              title={`إضافة ${config.label} جديد`}
            >
              <Plus size={18} />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-surface-card p-6 rounded-2xl shadow-sm border border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-right">
            <h1 className="text-2xl font-bold text-text-primary flex items-center justify-center md:justify-start gap-2">
              <div className="p-2 bg-brand-50 rounded-xl text-brand-600">
                <FileText size={24} />
              </div>
              {reportId ? "تعديل التقرير" : "إنشاء تقرير جديد"}
            </h1>
            <p className="text-text-secondary text-sm mt-1">قم بتعبئة البيانات الدراسية لتقريرك الدوري.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-success-bg text-success-text rounded-full border border-success-border text-xs font-bold">
            <Check size={14} />
            نظام التقارير المتكامل
          </div>
        </div>

        {/* Main Form Section */}
        <Card className="border-none shadow-sm overflow-visible">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Primary Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-border-subtle">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted px-1 uppercase tracking-widest">عنوان التقرير *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 bg-neutral-50 border rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all text-sm ${
                      formErrors.title ? "border-error-border bg-error-bg/20" : "border-border-default"
                    }`}
                    placeholder="مثال: تقرير الفصل الدراسي الأول"
                  />
                  {formErrors.title && <p className="text-[10px] text-error-text font-bold px-1">{formErrors.title}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted px-1 uppercase tracking-widest">تاريخ التقرير *</label>
                  <div className="relative">
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={16} />
                    <input
                      type="date"
                      name="date_of_report"
                      value={form.date_of_report}
                      onChange={handleChange}
                      className={`w-full pr-11 pl-4 py-2.5 bg-neutral-50 border rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all text-sm ${
                        formErrors.date_of_report ? "border-error-border bg-error-bg/20" : "border-border-default"
                      }`}
                    />
                  </div>
                  {formErrors.date_of_report && <p className="text-[10px] text-error-text font-bold px-1">{formErrors.date_of_report}</p>}
                </div>
              </div>

              {/* Dynamic Components Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                {Object.keys(pluralMap).map((itemType) => (
                  <div key={itemType}>{renderSelectField(itemType)}</div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-border-subtle">
                <Button type="submit" disabled={loading} className="px-10 py-6 bg-brand-800 text-white hover:bg-brand-600 shadow-lg shadow-brand-200">
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-b-white"></div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Check size={18} />
                      <span className="font-bold">{reportId ? "تحديث التقرير" : "حفظ وإرسال التقرير"}</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Previous Reports Table */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Layout size={20} className="text-brand-600" />
            <h2 className="text-lg font-bold text-text-primary">التقارير السابقة</h2>
          </div>

          <Card className="border-none shadow-sm overflow-hidden bg-surface-card">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead className="bg-neutral-50 border-b border-border-subtle">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">معلومات التقرير</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">التاريخ</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">الحالة</th>
                    <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-widest">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center">
                        <FileText size={48} className="mx-auto text-neutral-200 mb-4" />
                        <h3 className="text-lg font-bold text-text-muted">لا توجد تقارير سابقة</h3>
                        <p className="text-sm text-text-muted/60 mt-1">ابدأ بإنشاء أول تقرير لك الآن.</p>
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report._id} className="hover:bg-brand-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-white transition-colors border border-brand-100">
                              <FileText size={20} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-text-primary">{report.title || "بدون عنوان"}</div>
                              <div className="text-[10px] text-text-muted font-mono mt-0.5">#{report._id.slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary font-medium">
                          {report.date_of_report ? new Date(report.date_of_report).toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric' }) : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-success-bg text-success-text border border-success-border">
                            <div className="w-1.5 h-1.5 rounded-full bg-success-text animate-pulse"></div>
                            نشط
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" className="p-2 h-9 w-9 text-brand-600 hover:bg-brand-50 rounded-lg">
                              <Pencil size={16} />
                            </Button>
                            <Button variant="ghost" className="p-2 h-9 w-9 text-error-text hover:bg-error-bg/30 rounded-lg">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentReport;
