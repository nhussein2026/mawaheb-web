import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StudentLayout from "../components/layout/StudentLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import Loading from "../components/ui/Loading"
import {
  Award,
  PlusCircle,
  Edit3,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  ChevronLeft,
  X,
  Eye,
  Link as LinkIcon
} from "lucide-react";

const CertificatePage = () => {
  const [certificates, setCertificates] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", certificate_link: "", certificate_image: null });
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewingImage, setViewingImage] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchCertificates();
  }, [token]);

  const fetchCertificates = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/certificates`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCertificates(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("فشل في تحميل الشهادات");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/certificates`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });
      const data = await response.json();
      setCertificates([...certificates, data.certificate]);
      setShowForm(false);
      toast.success("تمت إضافة الشهادة بنجاح");
    } catch (error) {
      toast.error("فشل في إضافة الشهادة");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/certificates/${selectedCertificate._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });
      const data = await response.json();
      setCertificates(certificates.map(cert => cert._id === data.updatedCertificate._id ? data.updatedCertificate : cert));
      setShowForm(false);
      setSelectedCertificate(null);
      toast.success("تم تحديث الشهادة بنجاح");
    } catch (error) {
      toast.error("فشل في تحديث الشهادة");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الشهادة؟")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/certificates/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setCertificates(certificates.filter(cert => cert._id !== id));
          toast.success("تم الحذف بنجاح");
        }
      } catch (error) {
        toast.error("فشل في الحذف");
      }
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-card p-6 rounded-2xl shadow-sm border border-border-subtle gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <Award className="text-brand-600" />
              الشهادات المهنية
            </h1>
            <p className="text-text-secondary text-sm">أضف ووثق شهاداتك التي حصلت عليها.</p>
          </div>
          <Button onClick={() => { setSelectedCertificate(null); setFormData({ title: "", description: "", certificate_link: "", certificate_image: null }); setShowForm(true); }} variant="primary">
            <PlusCircle className="ml-2 w-4 h-4" />
            إضافة شهادة جديدة
          </Button>
        </div>

        {showForm && (
          <Card className="border-brand-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">{selectedCertificate ? "تعديل الشهادة" : "إضافة شهادة جديدة"}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X size={20} className="text-text-muted" /></Button>
              </div>
              <form onSubmit={selectedCertificate ? handleUpdate : handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">اسم الشهادة</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">وصف الشهادة</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all h-32" required />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">رابط الشهادة (إن وجد)</label>
                    <div className="relative">
                      <LinkIcon className="absolute right-3 top-3 text-text-muted" size={18} />
                      <input type="url" name="certificate_link" value={formData.certificate_link} onChange={handleInputChange} className="w-full p-2.5 pr-10 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all" placeholder="https://..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">صورة الشهادة</label>
                    <div className="border-2 border-dashed border-border-default rounded-xl p-8 text-center space-y-2 hover:bg-neutral-50 transition-colors cursor-pointer relative">
                      <input type="file" name="certificate_image" onChange={handleInputChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="cert-img" accept="image/*" />
                      <ImageIcon size={32} className="mx-auto text-brand-600 mb-2" />
                      <span className="text-sm text-text-muted block">انقر لرفع صورة الشهادة</span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button type="submit" variant="primary" className="px-8">{selectedCertificate ? "تحديث" : "حفظ"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Loading />
        ) : certificates.length === 0 ? (
          <Card className="p-12 text-center border-none shadow-sm">
            <Award className="h-16 w-16 text-neutral-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">لا توجد شهادات مسجلة</h3>
            <p className="text-text-secondary">ابدأ بتوثيق إنجازاتك المهنية والتعليمية.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate._id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden bg-surface-card">
                <CardContent className="p-0">
                  <div className="relative h-48 bg-neutral-100 overflow-hidden">
                    <img src={`${import.meta.env.VITE_API_URL}/uploads/${certificate.certificate_image}`} alt={certificate.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Certificate"; }} />
                    <div className="absolute inset-0 bg-surface-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="accent" onClick={() => setViewingImage(`${import.meta.env.VITE_API_URL}/uploads/${certificate.certificate_image}`)}><Eye size={16} className="ml-1" /> عرض</Button>
                      {certificate.certificate_link && (
                        <a href={certificate.certificate_link} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="secondary"><ExternalLink size={16} className="ml-1" /> الرابط</Button>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-text-primary">{certificate.title}</h3>
                      <div className="flex gap-1">
                        <button onClick={() => { setSelectedCertificate(certificate); setFormData({ title: certificate.title, description: certificate.description, certificate_link: certificate.certificate_link || "", certificate_image: null }); setShowForm(true); }} className="p-1.5 text-text-muted hover:text-brand-600 transition-colors"><Edit3 size={16} /></button>
                        <button onClick={() => handleDelete(certificate._id)} className="p-1.5 text-text-muted hover:text-error-text transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed h-15">{certificate.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {viewingImage && (
          <div className="fixed inset-0 bg-surface-overlay backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer" onClick={() => setViewingImage(null)}>
            <img src={viewingImage} alt="Certificate" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" onError={(e) => { e.target.src = "https://placehold.co/1200x800?text=Certificate"; }} />
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default CertificatePage;
