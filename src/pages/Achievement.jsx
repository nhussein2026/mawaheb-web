import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StudentLayout from "../components/layout/StudentLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import Loading from "../components/ui/Loading";
import {
  Trophy,
  PlusCircle,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Search,
  ChevronLeft,
  X,
  Eye,
  Tag
} from "lucide-react";

const categories = [
  "مشروع",
  "جائزة",
  "شهادة",
  "ابتكار",
  "ورقة بحثية",
  "نشاط تطوعي",
  "أخرى",
];

const UserAchievementPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: categories[0],
    achievement_image: null,
  });
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewingImage, setViewingImage] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchAchievements();
  }, [token]);

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/userAchievements`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAchievements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("فشل في تحميل الإنجازات");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, achievement_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) form.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/userAchievements`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await response.json();
      if (response.ok && data.userAchievement) {
        setAchievements([...achievements, data.userAchievement]);
        setShowForm(false);
        toast.success("تمت إضافة الإنجاز بنجاح");
      } else {
        toast.error(data.message || "فشل في إضافة الإنجاز");
      }
    } catch (error) {
      console.error("Error adding achievement:", error);
      toast.error("فشل في إضافة الإنجاز");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) form.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/userAchievements/${selectedAchievement._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await response.json();
      if (response.ok && data.userAchievement) {
        setAchievements(achievements.map(ach => ach._id === data.userAchievement._id ? data.userAchievement : ach));
        setShowForm(false);
        setSelectedAchievement(null);
        toast.success("تم تحديث الإنجاز بنجاح");
      } else {
        toast.error(data.message || "فشل في تحديث الإنجاز");
      }
    } catch (error) {
      console.error("Error updating achievement:", error);
      toast.error("فشل في تحديث الإنجاز");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الإنجاز؟")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/userAchievements/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setAchievements(achievements.filter(ach => ach._id !== id));
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
              <Trophy className="text-brand-600" />
              إنجازاتي
            </h1>
            <p className="text-text-secondary text-sm">سجل ووثق أهم محطات نجاحك وتفوقك.</p>
          </div>
          <Button onClick={() => { setSelectedAchievement(null); setFormData({ title: "", description: "", category: categories[0], achievement_image: null }); setShowForm(true); }} variant="primary">
            <PlusCircle className="ml-2 w-4 h-4" />
            إضافة إنجاز جديد
          </Button>
        </div>

        {showForm && (
          <Card className="border-brand-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">{selectedAchievement ? "تعديل الإنجاز" : "إضافة إنجاز جديد"}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X size={20} className="text-text-muted" /></Button>
              </div>
              <form onSubmit={selectedAchievement ? handleUpdate : handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">عنوان الإنجاز</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">الفئة</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all" required>
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">الوصف</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all h-32" required />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-1">صورة الإنجاز / الشهادة</label>
                  <div className="border-2 border-dashed border-border-default rounded-xl p-6 text-center space-y-2 hover:bg-neutral-50 transition-colors cursor-pointer relative">
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                    <ImageIcon className="text-neutral-300 mx-auto" size={32} />
                    <span className="text-sm text-text-muted block">انقر لرفع صورة الإنجاز</span>
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button type="submit" variant="primary" className="px-8">{selectedAchievement ? "تحديث" : "حفظ"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Loading />
        ) : achievements.length === 0 ? (
          <Card className="p-12 text-center border-none shadow-sm">
            <Trophy className="h-16 w-16 text-neutral-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">لا يوجد إنجازات مسجلة</h3>
            <p className="text-text-secondary">سجل أول إنجاز لك وشاركه مع الإدارة.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              if (!achievement) return null;
              return (
                <Card key={achievement._id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden bg-surface-card">
                  <CardContent className="p-0">
                    <div className="relative h-48 bg-neutral-100 overflow-hidden">
                      {achievement.achievement_image ? (
                        <>
                          <img src={`${import.meta.env.VITE_API_URL}/${achievement.achievement_image}`} alt={achievement.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-surface-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button size="sm" variant="accent" onClick={() => setViewingImage(`${import.meta.env.VITE_API_URL}/${achievement.achievement_image}`)}><Eye size={16} className="ml-1" /> عرض</Button>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300"><ImageIcon size={48} /></div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-text-primary">{achievement.title}</h3>
                        <div className="flex gap-1">
                          <button onClick={() => { setSelectedAchievement(achievement); setFormData({ title: achievement.title, description: achievement.description, category: achievement.category, achievement_image: null }); setShowForm(true); }} className="p-1.5 text-text-muted hover:text-brand-600 transition-colors"><Edit3 size={16} /></button>
                          <button onClick={() => handleDelete(achievement._id)} className="p-1.5 text-text-muted hover:text-error-text transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-accent-600 mb-3 bg-accent-50 px-2 py-0.5 rounded-full border border-accent-100 w-fit uppercase tracking-wider">
                        <Tag size={10} />
                        {achievement.category}
                      </div>
                      <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed h-15">{achievement.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {viewingImage && (
          <div className="fixed inset-0 bg-surface-overlay backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer" onClick={() => setViewingImage(null)}>
            <img src={viewingImage} alt="Achievement" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default UserAchievementPage;
