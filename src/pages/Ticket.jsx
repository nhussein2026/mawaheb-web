import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import StudentLayout from "../components/layout/StudentLayout";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  MessageSquare,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import Loading from "../components/ui/Loading";

const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/ticket`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("فشل في تحميل التذاكر");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Resolved":
        return <span className="bg-success-bg text-success-text px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-success-border"><CheckCircle2 size={12} /> تم الحل</span>;
      case "In Progress":
        return <span className="bg-accent-50 text-accent-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-accent-100"><Clock size={12} /> قيد المعالجة</span>;
      case "Closed":
        return <span className="bg-neutral-100 text-text-muted px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-border-default">مغلقة</span>;
      default:
        return <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-brand-100"><AlertCircle size={12} /> مفتوحة</span>;
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-card p-6 rounded-2xl shadow-sm border border-border-subtle gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <MessageSquare className="text-brand-600" />
              الدعم الفني والطلبات
            </h1>
            <p className="text-text-secondary text-sm">نحن هنا لمساعدتك في أي استفسار أو مشكلة تواجهها.</p>
          </div>
          <Link to="/create-ticket">
            <Button variant="primary">
              <PlusCircle className="ml-2 w-4 h-4" />
              فتح تذكرة جديدة
            </Button>
          </Link>
        </div>

        {loading ? (
          <Loading />
        ) : tickets.length === 0 ? (
          <Card className="p-12 text-center border-none shadow-sm">
            <MessageSquare className="h-16 w-16 text-neutral-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">لا توجد تذاكر حالية</h3>
            <p className="text-text-secondary">إذا كان لديك أي سؤال، لا تتردد في التواصل معنا.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tickets.map((ticket) => (
              <Card key={ticket._id} className="border-none shadow-sm hover:shadow-md transition-all group bg-surface-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        {getStatusBadge(ticket.status)}
                        <h3 className="font-bold text-lg text-text-primary">{ticket.title}</h3>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{ticket.description}</p>
                      <div className="flex items-center text-xs text-text-muted gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-brand-400" />
                          {new Date(ticket.createdAt).toLocaleDateString("ar-SA")}
                        </div>
                      </div>
                    </div>
                    {ticket.response && (
                      <div className="bg-neutral-50 p-6 border-t md:border-t-0 md:border-r border-border-default md:w-1/3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-600"></div>
                          <p className="text-xs font-bold text-brand-600 uppercase tracking-wider">رد الإدارة:</p>
                        </div>
                        <p className="text-sm text-text-primary leading-relaxed">{ticket.response}</p>
                      </div>
                    )}
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

export default Ticket;
