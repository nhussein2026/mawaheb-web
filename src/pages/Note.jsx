import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import StudentLayout from '../components/layout/StudentLayout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  StickyNote,
  PlusCircle,
  Edit3,
  Trash2,
  ChevronLeft,
  X,
  Clock,
  Search
} from 'lucide-react';
import Loading from '../components/ui/Loading';

const NotePage = () => {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [selectedNote, setSelectedNote] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchNotes();
  }, [token]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notes`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('فشل في تحميل الملاحظات');
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, user: user.id }),
      });
      const data = await response.json();
      if (data && data.note) {
        setNotes([...notes, data.note]);
        setShowForm(false);
        toast.success('تمت إضافة الملاحظة بنجاح');
      }
    } catch (error) {
      toast.error('فشل في الإضافة');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notes/${selectedNote._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data && data.note) {
        setNotes(notes.map((note) => (note._id === data.note._id ? data.note : note)));
        setShowForm(false);
        setSelectedNote(null);
        toast.success('تم التحديث بنجاح');
      }
    } catch (error) {
      toast.error('فشل في التحديث');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/notes/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setNotes(notes.filter((note) => note._id !== id));
          toast.success('تم الحذف بنجاح');
        }
      } catch (error) {
        toast.error('فشل في الحذف');
      }
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-card p-6 rounded-2xl shadow-sm border border-border-subtle gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <StickyNote className="text-brand-600" />
              مذكراتي
            </h1>
            <p className="text-text-secondary text-sm">سجل ملاحظاتك وأفكارك الهامة هنا.</p>
          </div>
          <Button onClick={() => { setSelectedNote(null); setFormData({ title: '', content: '' }); setShowForm(true); }} variant="primary">
            <PlusCircle className="ml-2 w-4 h-4" />
            إضافة ملاحظة جديدة
          </Button>
        </div>

        {showForm && (
          <Card className="border-brand-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">{selectedNote ? 'تعديل الملاحظة' : 'إضافة ملاحظة جديدة'}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X size={20} className="text-text-muted" /></Button>
              </div>
              <form onSubmit={selectedNote ? handleUpdate : handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">عنوان الملاحظة</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all" placeholder="اكتب عنواناً..." required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">المحتوى</label>
                  <textarea name="content" value={formData.content} onChange={handleInputChange} className="w-full p-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none h-40 resize-none transition-all" placeholder="ابدأ الكتابة هنا..." required />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="submit" variant="primary" className="px-8">{selectedNote ? 'تحديث' : 'حفظ'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Loading />
        ) : notes.length === 0 ? (
          <Card className="p-12 text-center border-none shadow-sm">
            <StickyNote className="h-16 w-16 text-neutral-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">لا توجد ملاحظات حالياً</h3>
            <p className="text-text-secondary">ابدأ بتدوين أول ملاحظة لك.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note._id} className="border-none shadow-sm hover:shadow-md transition-all group bg-surface-card border-t-4 border-t-brand-600">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-text-primary">{note.title}</h3>
                    <div className="flex gap-1">
                      <button onClick={() => { setSelectedNote(note); setFormData({ title: note.title, content: note.content }); setShowForm(true); }} className="p-1.5 text-text-muted hover:text-brand-600 transition-colors"><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(note._id)} className="p-1.5 text-text-muted hover:text-error-text transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-6 min-h-24">{note.content}</p>
                  <div className="mt-6 pt-4 border-t border-border-subtle flex items-center gap-2 text-xs text-text-muted">
                    <Clock size={12} className="text-brand-400" />
                    <span>{new Date(note.createdAt).toLocaleDateString('ar-SA')}</span>
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

export default NotePage;
