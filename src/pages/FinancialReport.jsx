import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import Loading from "../components/ui/Loading";
import {
  DollarSign,
  PlusCircle,
  Edit3,
  Trash2,
  FileText,
  Calendar,
  Image as ImageIcon,
  TrendingUp,
  Eye,
  X
} from "lucide-react";

const FinancialReport = () => {
  const [financialReports, setFinancialReports] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    financial_report_image: null,
    date_of_report: "",
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchReports();
  }, [token]);

  const fetchReports = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/financial-report`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setFinancialReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("فشل في تحميل التقارير المالية");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, financial_report_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) form.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/financial-report`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await response.json();
      setFinancialReports([...financialReports, data.financialReport]);
      setShowForm(false);
      toast.success("تمت إضافة التقرير المالي بنجاح");
    } catch (error) {
      toast.error("فشل في إضافة التقرير");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) form.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/financial-report/${selectedReport._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await response.json();
      setFinancialReports(financialReports.map(r => r._id === data.financialReport._id ? data.financialReport : r));
      setShowForm(false);
      setSelectedReport(null);
      toast.success("تم تحديث التقرير بنجاح");
    } catch (error) {
      toast.error("فشل في تحديث التقرير");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التقرير المالي؟")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/financial-report/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setFinancialReports(financialReports.filter(r => r._id !== id));
          toast.success("تم الحذف بنجاح");
        }
      } catch (error) {
        toast.error("فشل في الحذف");
      }
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-card p-6 rounded-2xl shadow-sm border border-border-subtle gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <DollarSign className="text-brand-600" />
              التقارير المالية
            </h1>
            <p className="text-text-secondary text-sm">إدارة ومتابعة التقارير المالية والوصولات.</p>
          </div>
          <Button onClick={() => { setSelectedReport(null); setFormData({ title: "", description: "", financial_report_image: null, date_of_report: "" }); setShowForm(true); }} variant="primary">
            <PlusCircle className="ml-2 w-4 h-4" />
            إضافة تقرير مالي
          </Button>
        </div>

        {showForm && (
          <Card className="border-brand-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">{selectedReport ? "تعديل التقرير" : "إنشاء تقرير مالي جديد"}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X size={20} className="text-text-muted" /></Button>
              </div>
              <form onSubmit={selectedReport ? handleUpdate : handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">العنوان</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">التاريخ</label>
                    <input type="date" name="date_of_report" value={formData.date_of_report} onChange={handleInputChange} className="w-full p-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">الوصف</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all h-32" required />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">صورة الوصول / التقرير</label>
                  <div className="relative w-full p-6 border-2 border-dashed border-border-default rounded-xl hover:bg-neutral-50 transition-colors flex flex-col items-center justify-center cursor-pointer">
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                    <ImageIcon className="text-neutral-300 mb-2" size={32} />
                    <span className="text-sm text-text-muted">اضغط هنا أو اسحب الملف لرفعه</span>
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button type="submit" variant="primary" className="px-8">{selectedReport ? "تحديث" : "حفظ"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Loading />
        ) : financialReports.length === 0 ? (
          <Card className="p-12 text-center border-none shadow-sm">
            <DollarSign className="h-16 w-16 text-neutral-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">لا يوجد تقارير مالية</h3>
            <p className="text-text-secondary">سجل أول تقرير مالي لك اليوم.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financialReports.map((report) => (
              <Card key={report._id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-48 bg-neutral-100 overflow-hidden">
                    {report.financial_report_image ? (
                      <img src={`${import.meta.env.VITE_API_URL}/${report.financial_report_image}`} alt={report.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300"><ImageIcon size={48} /></div>
                    )}
                    <div className="absolute inset-0 bg-surface-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="accent" onClick={() => setViewingImage(`${import.meta.env.VITE_API_URL}/${report.financial_report_image}`)}><Eye size={16} className="ml-1" /> عرض</Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-text-primary">{report.title}</h3>
                      <div className="flex gap-1">
                        <button onClick={() => { setSelectedReport(report); setFormData({ title: report.title, description: report.description, date_of_report: report.date_of_report?.split('T')[0], financial_report_image: null }); setShowForm(true); }} className="p-1.5 text-text-muted hover:text-brand-600 transition-colors"><Edit3 size={16} /></button>
                        <button onClick={() => handleDelete(report._id)} className="p-1.5 text-text-muted hover:text-error-text transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-4 h-10">{report.description}</p>
                    <div className="flex items-center text-xs text-text-muted gap-2 mt-auto">
                      <Calendar size={14} className="text-brand-400" />
                      {report.date_of_report ? new Date(report.date_of_report).toLocaleDateString("ar-SA") : "غير محدد"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {viewingImage && (
          <div className="fixed inset-0 bg-surface-overlay backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer" onClick={() => setViewingImage(null)}>
            <img src={viewingImage} alt="Fullscreen" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
          </div>
        )}
      </div>
    </>
  );
};

export default FinancialReport;
