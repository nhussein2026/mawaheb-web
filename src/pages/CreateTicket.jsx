import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MessageSquare, Send, ChevronRight } from 'lucide-react';

const CreateTicket = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/ticket`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      });

      if (response.ok) {
        toast.success('تم إرسال التذكرة بنجاح');
        navigate('/ticket-list');
      } else {
        toast.error('فشل في إرسال التذكرة');
      }
    } catch (error) {
      toast.error('حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-text-muted hover:text-brand-600 transition-colors cursor-pointer" onClick={() => navigate(-1)}>
          <ChevronRight size={20} />
          <span className="font-medium text-sm">العودة</span>
        </div>

        <Card className="border-none shadow-xl overflow-hidden bg-surface-card">
          <div className="bg-brand-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-800/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <MessageSquare size={40} className="mb-4 text-accent-400 opacity-80 relative z-10" />
            <h1 className="text-2xl font-bold relative z-10">فتح تذكرة دعم جديدة</h1>
            <p className="text-brand-200 text-sm mt-1 relative z-10">اشرح لنا مشكلتك وسنقوم بالرد عليك في أقرب وقت ممكن.</p>
          </div>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary">عنوان التذكرة</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: مشكلة في رفع التقرير"
                  required
                  className="w-full p-3 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary">وصف المشكلة</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب تفاصيل مشكلتك هنا..."
                  required
                  rows="5"
                  className="w-full p-3 bg-neutral-50 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-600 outline-none transition-all resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full h-12 rounded-xl text-lg"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="ml-2" size={18} />
                    إرسال التذكرة
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};


export default CreateTicket;
