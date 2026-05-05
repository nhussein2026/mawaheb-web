import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import {
  Plus,
  Check,
  Calendar,
  BookOpen,
  Award,
  Trophy,
  FileText,
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  Layout,
  Upload,
  Link as LinkIcon,
} from "lucide-react";

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
    userAchievement: { title: "", description: "", category: "", achievement_image: "" },
    event: { title: "", description: "", photo: "" },
    certificate: { title: "", description: "", certificate_image: "", certificate_link: "" },
  });

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const token = useSelector((state) => state.auth.token);

  const itemConfig = {
    course: {
      icon: BookOpen,
      label: "الدورة التدريبية",
      borderColor: "border-r-brand-500",
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
      cardBg: "bg-brand-50/40",
      newFormBg: "bg-brand-50 border-brand-200 text-brand-800",
      fields: [{ name: "course_image", label: "رابط صورة الدورة", type: "url", icon: Upload }],
    },
    note: {
      icon: FileText,
      label: "الملاحظة الدراسية",
      borderColor: "border-r-neutral-400",
      iconBg: "bg-neutral-100",
      iconColor: "text-neutral-600",
      cardBg: "bg-neutral-50/50",
      newFormBg: "bg-neutral-50 border-neutral-300 text-neutral-700",
      fields: [],
    },
    difficulty: {
      icon: AlertTriangle,
      label: "الصعوبة أو التحدي",
      borderColor: "border-r-error-text",
      iconBg: "bg-error-bg",
      iconColor: "text-error-text",
      cardBg: "bg-error-bg/20",
      newFormBg: "bg-error-bg border-error-border text-error-dark",
      fields: [],
    },
    userAchievement: {
      icon: Trophy,
      label: "الإنجاز الشخصي",
      borderColor: "border-r-success-text",
      iconBg: "bg-success-bg",
      iconColor: "text-success-text",
      cardBg: "bg-success-bg/20",
      newFormBg: "bg-success-bg border-success-border text-success-text",
      fields: [
        { name: "category", label: "الفئة", type: "text", icon: Layout },
        { name: "achievement_image", label: "رابط صورة الإنجاز", type: "url", icon: Upload },
      ],
    },
    event: {
      icon: CalendarDays,
      label: "الفعالية أو النشاط",
      borderColor: "border-r-accent-400",
      iconBg: "bg-accent-50",
      iconColor: "text-accent-600",
      cardBg: "bg-accent-50/30",
      newFormBg: "bg-accent-50 border-accent-100 text-accent-800",
      fields: [{ name: "photo", label: "رابط صورة الفعالية", type: "url", icon: Upload }],
    },
    certificate: {
      icon: Award,
      label: "الشهادة المهنية",
      borderColor: "border-r-accent-400",
      iconBg: "bg-accent-50",
      iconColor: "text-accent-600",
      cardBg: "bg-accent-50/30",
      newFormBg: "bg-accent-50 border-accent-100 text-accent-800",
      fields: [
        { name: "certificate_image", label: "رابط صورة الشهادة", type: "url", icon: Upload },
        { name: "certificate_link", label: "رابط الشهادة المباشر", type: "url", icon: LinkIcon },
      ],
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
  }, [token]);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/studentReports/options`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setOptions(await res.json());
    } catch {
      toast.error("فشل تحميل خيارات النموذج");
    } finally {
      setLoading(false);
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
    setForm((p) => ({ ...p, [name]: value }));
    if (formErrors[name]) setFormErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleNewItemChange = (e, itemType) => {
    const { name, value } = e.target;
    setNewItems((p) => ({ ...p, [itemType]: { ...p[itemType], [name]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { toast.error("يرجى ملء جميع الحقول المطلوبة"); return; }
    try {
      setLoading(true);
      const url = reportId
        ? `${import.meta.env.VITE_API_URL}/studentReport/${reportId}`
        : `${import.meta.env.VITE_API_URL}/studentReport`;
      const res = await fetch(url, {
        method: reportId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (onSave) onSave(data);
      toast.success(reportId ? "تم تحديث التقرير بنجاح!" : "تم إنشاء التقرير بنجاح!");
      if (!reportId) {
        setForm({ title: "", courseId: "", noteId: "", difficultiesId: "", userAchievementId: "", eventId: "", date_of_report: "", certificateId: "" });
      }
    } catch {
      toast.error("فشل في حفظ التقرير");
    } finally {
      setLoading(false);
    }
  };

  const getEmptyItemStructure = (itemType) => {
    const base = { title: "", description: "" };
    const extras = {
      course: { course_image: "" },
      userAchievement: { category: "", achievement_image: "" },
      event: { photo: "" },
      certificate: { certificate_image: "", certificate_link: "" },
    };
    return { ...base, ...(extras[itemType] || {}) };
  };

  const handleCreateNewItem = async (itemType) => {
    const endpoint = itemType === "difficulty" ? "difficulties" : `${itemType}s`;
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newItems[itemType]),
      });
      if (!res.ok) throw new Error();
      const newItem = await res.json();
      setOptions((p) => ({ ...p, [`${itemType}s`]: [...(p[`${itemType}s`] || []), newItem] }));
      setForm((p) => ({ ...p, [`${itemType}Id`]: newItem._id }));
      setCreatingNew((p) => ({ ...p, [itemType]: false }));
      setNewItems((p) => ({ ...p, [itemType]: getEmptyItemStructure(itemType) }));
      toast.success(`تم إنشاء ${itemConfig[itemType].label} بنجاح!`);
    } catch {
      toast.error(`فشل في إنشاء ${itemConfig[itemType].label}`);
    } finally {
      setLoading(false);
    }
  };

  const renderNewItemForm = (itemType) => {
    const config = itemConfig[itemType];
    const Icon = config.icon;
    const valid = newItems[itemType].title && newItems[itemType].description;
    return (
      <div className={`mt-3 p-5 rounded-2xl border-2 border-dashed space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 ${config.newFormBg}`}>
        <div className="flex items-center gap-2 pb-3 border-b border-current/10">
          <div className={`p-1.5 rounded-lg ${config.iconBg}`}>
            <Icon size={14} className={config.iconColor} />
          </div>
          <span className="text-xs font-bold">إضافة {config.label} جديد</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider opacity-70">العنوان *</label>
            <input
              type="text" name="title" value={newItems[itemType].title}
              onChange={(e) => handleNewItemChange(e, itemType)}
              className="w-full px-3 py-2 bg-white/80 border border-white/60 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm text-text-primary transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider opacity-70">الوصف *</label>
            <input
              type="text" name="description" value={newItems[itemType].description}
              onChange={(e) => handleNewItemChange(e, itemType)}
              className="w-full px-3 py-2 bg-white/80 border border-white/60 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm text-text-primary transition-all"
            />
          </div>
        </div>
        {config.fields.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {config.fields.map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider opacity-70">{field.label}</label>
                <div className="relative">
                  <field.icon size={13} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type={field.type} name={field.name} value={newItems[itemType][field.name]}
                    onChange={(e) => handleNewItemChange(e, itemType)}
                    className="w-full pr-9 pl-3 py-2 bg-white/80 border border-white/60 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm text-text-primary transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={() => setCreatingNew((p) => ({ ...p, [itemType]: false }))}
            className="px-4 py-1.5 text-xs font-bold rounded-xl border border-current/20 hover:bg-white/30 transition-colors"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={() => handleCreateNewItem(itemType)}
            disabled={loading || !valid}
            className="px-4 py-1.5 text-xs font-bold rounded-xl bg-brand-800 text-white hover:bg-brand-600 disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            <Check size={12} />
            حفظ
          </button>
        </div>
      </div>
    );
  };

  const renderSelectField = (itemType) => {
    const config = itemConfig[itemType];
    const Icon = config.icon;
    const pluralKey = pluralMap[itemType];
    const selectedId = form[`${itemType}Id`];
    const hasValue = !!selectedId;

    return (
      <div className={`rounded-2xl border-2 border-r-4 ${config.borderColor} border-border-subtle p-4 transition-all hover:shadow-sm ${config.cardBg}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${config.iconBg}`}>
              <Icon size={14} className={config.iconColor} />
            </div>
            <span className="text-xs font-bold text-text-secondary">{config.label}</span>
          </div>
          {hasValue && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-success-text bg-success-bg px-2 py-0.5 rounded-full border border-success-border">
              <Check size={10} />
              محدد
            </span>
          )}
        </div>

        {creatingNew[itemType] ? (
          renderNewItemForm(itemType)
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                name={`${itemType}Id`}
                value={form[`${itemType}Id`]}
                onChange={handleChange}
                className="w-full pr-3 pl-9 py-2.5 bg-white border border-border-default rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm text-text-primary appearance-none cursor-pointer transition-all"
              >
                <option value="">اختر {config.label}</option>
                {options[pluralKey]?.map((opt) => (
                  <option key={opt._id} value={opt._id}>{opt.title}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
            <button
              type="button"
              onClick={() => setCreatingNew((p) => ({ ...p, [itemType]: true }))}
              title={`إضافة ${config.label} جديد`}
              className={`px-3 rounded-xl border-2 border-dashed border-border-default hover:border-brand-400 hover:bg-brand-50 ${config.iconColor} transition-all`}
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading && !options.courses?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand-200 border-t-brand-600" />
        <p className="text-xs text-text-muted">جارٍ تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 p-7 text-white shadow-xl shadow-brand-900/20">
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shrink-0">
            <FileText size={24} className="text-accent-300" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {reportId ? "تعديل التقرير الدراسي" : "إنشاء تقرير دراسي جديد"}
            </h2>
            <p className="text-brand-200 text-xs mt-1 leading-relaxed">
              قم بتعبئة بيانات التقرير الدوري بدقة لمتابعة تقدمك الأكاديمي
            </p>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-brand-600/30 blur-3xl pointer-events-none" />
        <div className="absolute right-10 -top-6 w-28 h-28 rounded-full bg-accent-400/10 blur-2xl pointer-events-none" />
      </div>

      {/* Main Form Card */}
      <Card className="border border-border-subtle shadow-sm bg-surface-card">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* ── Primary Info ── */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-border-subtle" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">المعلومات الأساسية</span>
                <div className="h-px flex-1 bg-border-subtle" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-600 inline-block" />
                    عنوان التقرير
                    <span className="text-error-text">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="مثال: تقرير الفصل الدراسي الأول"
                    className={`w-full px-4 py-3 bg-neutral-50 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm transition-all ${formErrors.title ? "border-error-border bg-error-bg/20" : "border-border-default hover:border-brand-300"}`}
                  />
                  {formErrors.title && <p className="text-[10px] text-error-text font-bold">{formErrors.title}</p>}
                </div>
                {/* Date */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-600 inline-block" />
                    تاريخ التقرير
                    <span className="text-error-text">*</span>
                  </label>
                  <div className="relative">
                    <Calendar size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                      type="date"
                      name="date_of_report"
                      value={form.date_of_report}
                      onChange={handleChange}
                      className={`w-full pr-11 pl-4 py-3 bg-neutral-50 border rounded-xl outline-none focus:ring-2 focus:ring-brand-500 text-sm transition-all ${formErrors.date_of_report ? "border-error-border bg-error-bg/20" : "border-border-default hover:border-brand-300"}`}
                    />
                  </div>
                  {formErrors.date_of_report && <p className="text-[10px] text-error-text font-bold">{formErrors.date_of_report}</p>}
                </div>
              </div>
            </div>

            {/* ── Components ── */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1 bg-border-subtle" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">مكونات التقرير</span>
                <div className="h-px flex-1 bg-border-subtle" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(pluralMap).map((itemType) => (
                  <div key={itemType}>{renderSelectField(itemType)}</div>
                ))}
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="pt-4 border-t border-border-subtle flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-brand-800 hover:bg-brand-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-900/20 transition-all hover:shadow-brand-900/30 flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <Check size={16} />
                    {reportId ? "تحديث التقرير" : "حفظ وإرسال التقرير"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentReport;
