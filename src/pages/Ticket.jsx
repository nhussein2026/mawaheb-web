import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { StatusBadge } from "../components/ui/Badge";
import { EmptyState, SkeletonRows } from "../components/ui/Feedback";
import { HistoryItem } from "../components/ui/HistoryCard";
import { useResource } from "../hooks/useResource";
import { API_BASE_URL } from "../services/api/config";
import { ticketStatus } from "../constants/tickets";
import { formatDate } from "../utils/format";

const primaryLinkCls =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-strong px-4 text-sm font-semibold text-brand-on-strong hover:bg-brand-strong-hover [&_svg]:size-5";

// The signed-in user's support tickets and the administration's replies.
const Ticket = () => {
  const token = useSelector((state) => state.auth.token);
  const { data: tickets, status, reload } = useResource(
    async () => {
      const res = await fetch(`${API_BASE_URL}/tickets/my`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    },
    [token],
    { initial: [], select: (json) => (json?.success && Array.isArray(json.data) ? json.data : []) }
  );

  const newTicket = (
    <Link to="/create-ticket" className={primaryLinkCls}>
      <Plus aria-hidden="true" /> فتح تذكرة
    </Link>
  );

  return (
    <div className="space-y-6">
      <PageHeader title="التذاكر والدعم" description="اطرح سؤالك أو مشكلتك وتابع رد الإدارة." actions={newTicket} />
      <Card>
        {status === "loading" ? (
          <SkeletonRows rows={4} />
        ) : status === "failed" ? (
          <EmptyState kind="failed" title="تعذّر تحميل التذاكر" onRetry={reload} />
        ) : tickets.length === 0 ? (
          <EmptyState kind="first-use" title="لا توجد تذاكر" description="إن كان لديك سؤال أو مشكلة، افتح تذكرة وسيرد عليك فريق الدعم." action={newTicket} />
        ) : (
          <ul className="divide-y divide-border-subtle px-4 py-4 sm:px-6">
            {tickets.map((t) => {
              const st = ticketStatus(t.status);
              return (
                <HistoryItem
                  key={t._id}
                  title={t.title}
                  status={<StatusBadge tone={st.tone}>{st.label}</StatusBadge>}
                  meta={<span className="num">{formatDate(t.createdAt)}</span>}
                  reply={t.response}
                  replyLabel="رد الإدارة"
                >
                  {t.description}
                </HistoryItem>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default Ticket;
