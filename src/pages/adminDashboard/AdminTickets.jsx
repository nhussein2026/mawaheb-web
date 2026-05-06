import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { MessageSquare, Clock, PlusCircle } from "lucide-react";

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

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/ticket`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setTickets(Array.isArray(data) ? data : data.tickets || []);
      } catch (e) {
        console.error(e);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [token]);

  return (
    <>
      <div className="space-y-6">
        <AdminPageHeader
          title="تذاكر الدعم"
          description="التذاكر المُعادة للحساب الحالي (`/user/ticket`). لعرض شامل لجميع التذاكر أضف مساراً إدارياً في الخادم واربطه هنا."
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
              <Card key={ticket._id}>
                <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-medium text-text-primary">{ticket.title}</h3>
                      {statusBadge(ticket.status)}
                    </div>
                    {ticket.description ? (
                      <p className="line-clamp-2 text-sm text-text-secondary">{ticket.description}</p>
                    ) : null}
                    <p className="flex items-center gap-1.5 text-[11px] text-text-muted">
                      <Clock className="h-3.5 w-3.5" />
                      {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString("ar-SA") : "—"}
                    </p>
                  </div>
                  {ticket.response ? (
                    <div className="max-w-md rounded-md border-[0.5px] border-border-subtle bg-surface-page p-3 text-sm text-text-secondary">
                      <span className="text-[11px] font-medium uppercase tracking-[0.07em] text-text-muted">
                        الرد
                      </span>
                      <p className="mt-1 whitespace-pre-wrap">{ticket.response}</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
