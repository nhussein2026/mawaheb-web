import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StudentLayout from "../components/layout/StudentLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import Loading from "../components/ui/Loading";
import {
  AlertTriangle,
  PlusCircle,
  Edit3,
  Trash2,
  ChevronLeft,
  X,
  MessageCircle,
  HelpCircle
} from "lucide-react";

const DifficultyPage = () => {
  const [difficulties, setDifficulties] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchDifficulties();
  }, [token]);

  const fetchDifficulties = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/difficulties`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setDifficulties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching difficulties:", error);
      toast.error("فشل في تحميل الصعوبات");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/difficulties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setDifficulties([...difficulties, data.difficulty]);
      setShowForm(false);
      toast.success("تم تسجيل الصعوبة بنجاح");
    } catch (error) {
      toast.error("فشل في التسجيل");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/difficulties/${selectedDifficulty._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setDifficulties(difficulties.map(diff => diff._id === data.difficulty._id ? data.difficulty : diff));
      setShowForm(false);
      setSelectedDifficulty(null);
      toast.success("تم التحديث بنجاح");
    } catch (error) {
      toast.error("فشل في التحديث");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا السجل؟")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/difficulties/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setDifficulties(difficulties.filter(diff => diff._id !== id));
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
              <AlertTriangle className="text-error-text" />
              الصعوبات والتحديات
            </h1>
            <p className="text-text-secondary text-sm">أخبرنا عن أي تحديات تواجهك لنتمكن من مساعدتك.</p>
          </div>
          <Button onClick={() => { setSelectedDifficulty(null); setFormData({ title: "", description: "" }); setShowForm(true); }} variant="primary" className="bg-error-text hover:bg-error-text/90">
            <PlusCircle className="ml-2 w-4 h-4" />
            تسجيل صعوبة جديدة
          </Button>
        </div>

        {showForm && (
          <Card className="border-error-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">{selectedDifficulty ? "تعديل الصعوبة" : "تسجيل صعوبة جديدة"}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X size={20} className="text-text-muted" /></Button>
              </div>
              <form onSubmit={selectedDifficulty ? handleUpdate : handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">عنوان المشكلة</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-error-text outline-none transition-all" placeholder="مثال: صعوبات في المناهج، مشاكل تقنية..." required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">تفاصيل الصعوبات</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-error-text outline-none h-40 resize-none transition-all" placeholder="اشرح لنا بالتفصيل ما يواجهك..." required />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="submit" variant="primary" className="bg-error-text hover:bg-error-text/90 px-8">{selectedDifficulty ? "تحديث" : "إرسال"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Loading />
        ) : difficulties.length === 0 ? (
          <Card className="p-12 text-center border-none shadow-sm">
            <HelpCircle className="h-16 w-16 text-neutral-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">لا يوجد صعوبات مسجلة</h3>
            <p className="text-text-secondary">نأمل أن تكون أمورك ميسرة دائماً. نحن هنا إذا احتجت للمساعدة.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {difficulties.map((difficulty) => (
              <Card key={difficulty._id} className="border-none shadow-sm hover:shadow-md transition-all group border-r-4 border-r-error-text bg-surface-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-error-bg p-2 rounded-lg text-error-text border border-error-border">
                        <MessageCircle size={20} />
                      </div>
                      <h3 className="font-bold text-lg text-text-primary">{difficulty.title}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setSelectedDifficulty(difficulty); setFormData({ title: difficulty.title, description: difficulty.description }); setShowForm(true); }} className="p-1.5 text-text-muted hover:text-brand-600 transition-colors"><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(difficulty._id)} className="p-1.5 text-text-muted hover:text-error-text transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed bg-neutral-50 p-4 rounded-xl border border-border-subtle">{difficulty.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default DifficultyPage;
