import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MessageSquare, Clock, PlusCircle, User, CheckCircle2, Trash2, Send } from "lucide-react";
import { toast } from "react-toastify";

function statusBadge(status) {
  if (status === "Resolved") {
    return (
      <span className="inline-flex items-center rounded-full border border-success-border bg-success-bg px-2.5 py-0.5 text-[11px] font-medium text-success-text">
        تم الحل
      </span>
    );
  }
  if (status === "In Progress") {
    return (
      <span className="inline-flex items-center rounded-full border border-warning-border bg-warning-bg px-2.5 py-0.5 text-[11px] font-medium text-warning-text">
        قيد المعالجة
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-border-default bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-text-muted">
      مفتوحة
    </span>
  );
}

export default function AdminTickets() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState({});
  const [isSaving, setIsSaving] = useState({});

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await response.json();
      const fetchedTickets = json.success && Array.isArray(json.data) ? json.data : [];
      setTickets(fetchedTickets);
      
      // Initialize replies state
      const initialReplies = {};
      fetchedTickets.forEach(t => {
        initialReplies[t._id] = t.response || "";
      });
      setReplies(initialReplies);
    } catch (e) {
      console.error(e);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const handleUpdate = async (ticketId, payload, isReply = false) => {
    if (isReply) setIsSaving(prev => ({ ...prev, [ticketId]: true }));
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(isReply ? "تم حفظ الرد بنجاح" : "تم تحديث التذكرة بنجاح");
        if (!isReply) fetchTickets(); // Refresh for status updates
      } else {
        toast.error(data.message || "فشل التحديث");
      }
    } catch (e) {
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      if (isReply) setIsSaving(prev => ({ ...prev, [ticketId]: false }));
    }
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه التذكرة؟")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tickets/${ticketId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        toast.success("تم حذف التذكرة");
        fetchTickets();
      }
    } catch (e) {
      toast.error("فشل الحذف");
    }
  };

  return (
    <>
      <div className="space-y-6">
        <AdminPageHeader
          title="تذاكر الدعم"
          description="عرض شامل لجميع تذاكر الطلاب عبر المسار الجديد `/tickets`."
          actions={
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="rounded-md"
              onClick={() => navigate("/create-ticket")}
            >
              <PlusCircle className="ms-1.5 h-4 w-4" />
              تذكرة جديدة
            </Button>
          }
        />

        {loading ? (
          <p className="text-sm text-text-secondary">جاري التحميل…</p>
        ) : tickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
              <MessageSquare className="h-12 w-12 text-neutral-300" />
              <p className="text-sm text-text-secondary">لا توجد تذاكر للعرض.</p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-md"
                onClick={() => navigate("/ticket-list")}
              >
                صفحة التذاكر
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Card key={ticket._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-medium text-text-primary">{ticket.title}</h3>
                        {statusBadge(ticket.status)}
                      </div>
                      {ticket.description ? (
                        <p className="text-sm text-text-secondary">{ticket.description}</p>
                      ) : null}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-muted pt-1">
                        <p className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          {ticket.userId?.name || "مستخدم"}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString("en-US") : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <select
                        className="h-8 rounded-md border border-border-default bg-surface-page px-2 text-xs font-medium text-text-primary outline-none focus:ring-2 focus:ring-brand-600"
                        value={ticket.status}
                        onChange={(e) => handleUpdate(ticket._id, { status: e.target.value })}
                      >
                        <option value="Open">مفتوحة</option>
                        <option value="In Progress">قيد المعالجة</option>
                        <option value="Resolved">تم الحل</option>
                        <option value="Closed">مغلقة</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-md text-error-text hover:bg-error-bg"
                        onClick={() => handleDelete(ticket._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="border-t border-border-subtle bg-neutral-50/50 p-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        <MessageSquare className="h-3 w-3" />
                        الرد الإداري
                      </div>
                      <div className="relative space-y-3">
                        <textarea
                          className="w-full rounded-lg border border-border-default bg-surface-page p-3 text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand-600 min-h-[100px] transition-all"
                          placeholder="اكتب ردك الإداري هنا لتوضيح الإجراء المتخذ..."
                          value={replies[ticket._id] || ""}
                          onChange={(e) => setReplies(prev => ({ ...prev, [ticket._id]: e.target.value }))}
                        />
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="primary"
                            className="rounded-md h-9 px-4"
                            onClick={() => handleUpdate(ticket._id, { response: replies[ticket._id] }, true)}
                            disabled={isSaving[ticket._id] || replies[ticket._id] === (ticket.response || "")}
                          >
                            {isSaving[ticket._id] ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                              <>
                                <Send className="ms-1.5 h-3.5 w-3.5" />
                                حفظ الرد
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
