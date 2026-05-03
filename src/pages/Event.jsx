import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StudentLayout from "../components/layout/StudentLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Loading } from "../components/ui/Loading";
import { 
  Calendar, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Image as ImageIcon,
  Search,
  ChevronLeft,
  X,
  Eye,
  MapPin
} from "lucide-react";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", photo: null });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewingImage, setViewingImage] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("فشل في تحميل الفعاليات");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) form.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await response.json();
      setEvents([...events, data.event]);
      setShowForm(false);
      toast.success("تمت إضافة الفعالية بنجاح");
    } catch (error) {
      toast.error("فشل في إضافة الفعالية");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) form.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${selectedEvent._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await response.json();
      setEvents(events.map(evt => evt._id === data.event._id ? data.event : evt));
      setShowForm(false);
      setSelectedEvent(null);
      toast.success("تم تحديث الفعالية بنجاح");
    } catch (error) {
      toast.error("فشل في تحديث الفعالية");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الفعالية؟")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setEvents(events.filter(evt => evt._id !== id));
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
              <Calendar className="text-brand-600" />
              الفعاليات والأنشطة
            </h1>
            <p className="text-text-secondary text-sm">شارك في الفعاليات والأنشطة الطلابية.</p>
          </div>
          <Button onClick={() => { setSelectedEvent(null); setFormData({ title: "", description: "", photo: null }); setShowForm(true); }} variant="primary">
            <PlusCircle className="ml-2 w-4 h-4" />
            إضافة فعالية جديدة
          </Button>
        </div>

        {showForm && (
          <Card className="border-brand-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary">{selectedEvent ? "تعديل الفعالية" : "إضافة فعالية جديدة"}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X size={20} className="text-text-muted" /></Button>
              </div>
              <form onSubmit={selectedEvent ? handleUpdate : handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">اسم الفعالية</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">وصف الفعالية</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2.5 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all h-32" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">صورة الفعالية</label>
                  <div className="border-2 border-dashed border-border-default rounded-xl p-8 text-center space-y-4 hover:bg-neutral-50 transition-colors">
                    <input type="file" onChange={handleFileChange} className="hidden" id="event-img" accept="image/*" />
                    <label htmlFor="event-img" className="cursor-pointer block">
                      <div className="bg-brand-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-brand-600 border border-brand-200">
                        <ImageIcon size={24} />
                      </div>
                      <span className="text-sm text-text-muted">انقر لرفع صورة الفعالية</span>
                    </label>
                  </div>
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button type="submit" variant="primary" className="px-8">{selectedEvent ? "تحديث" : "حفظ"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Loading />
        ) : events.length === 0 ? (
          <Card className="p-12 text-center border-none shadow-sm">
            <Calendar className="h-16 w-16 text-neutral-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">لا توجد فعاليات حالياً</h3>
            <p className="text-text-secondary">كن أول من يضيف فعالية أو نشاط طلابي.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event._id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden bg-surface-card">
                <CardContent className="p-0">
                  <div className="relative h-48 bg-neutral-100 overflow-hidden">
                    {event.photo ? (
                      <img src={`${import.meta.env.VITE_API_URL}/${event.photo}`} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300"><ImageIcon size={48} /></div>
                    )}
                    <div className="absolute inset-0 bg-surface-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button size="sm" variant="accent" onClick={() => setViewingImage(`${import.meta.env.VITE_API_URL}/${event.photo}`)}><Eye size={16} className="ml-1" /> عرض</Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-text-primary">{event.title}</h3>
                      <div className="flex gap-1">
                        <button onClick={() => { setSelectedEvent(event); setFormData({ title: event.title, description: event.description, photo: null }); setShowForm(true); }} className="p-1.5 text-text-muted hover:text-brand-600 transition-colors"><Edit3 size={16} /></button>
                        <button onClick={() => handleDelete(event._id)} className="p-1.5 text-text-muted hover:text-error-text transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed h-15">{event.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {viewingImage && (
          <div className="fixed inset-0 bg-surface-overlay backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer" onClick={() => setViewingImage(null)}>
            <img src={viewingImage} alt="Event" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default EventPage;
