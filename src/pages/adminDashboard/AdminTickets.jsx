import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button, IconButton } from "../../components/ui/Button";
import { Field, Select, Textarea } from "../../components/ui/Input";
import { StatusBadge } from "../../components/ui/Badge";
import { Tabs } from "../../components/ui/Tabs";
import { Avatar } from "../../components/ui/Avatar";
import { EmptyState, SkeletonRows } from "../../components/ui/Feedback";
import { useConfirm } from "../../components/ui/confirmContext";
import { useResource } from "../../hooks/useResource";
import { API_BASE_URL } from "../../services/api/config";
import { TICKET_STATUS, ticketStatus } from "../../constants/tickets";
import { formatRelative, formatDateTime } from "../../utils/format";

const SEGMENTS = ["all", "Open", "In Progress", "Resolved", "Closed"];

// Support tickets from all users. Status segments live in the URL; each
// ticket can be moved between statuses and answered in place.
export default function AdminTickets() {
  const token = useSelector((state) => state.auth.token);
  const isAdmin = useSelector((state) => state.auth.user?.role === "Admin");
  const confirm = useConfirm();
  const [params, setParams] = useSearchParams();
  const segment = SEGMENTS.includes(params.get("status")) ? params.get("status") : "all";
  const [replies, setReplies] = useState({});
  const [saving, setSaving] = useState({});

  const { data: tickets, status, reload, setData } = useResource(
    async () => {
      const response = await fetch(`${API_BASE_URL}/tickets`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    },
    [token],
    { initial: [], select: (json) => (json?.success && Array.isArray(json.data) ? json.data : []) }
  );

  const counts = useMemo(() => {
    const c = { all: tickets.length };
    tickets.forEach((t) => {
      const key = TICKET_STATUS[t.status] ? t.status : "Open";
      c[key] = (c[key] || 0) + 1;
    });
    return c;
  }, [tickets]);

  const visible = segment === "all" ? tickets : tickets.filter((t) => (TICKET_STATUS[t.status] ? t.status : "Open") === segment);

  const update = async (ticket, payload, isReply) => {
    if (isReply) setSaving((s) => ({ ...s, [ticket._id]: true }));
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${ticket._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error(data.message);
      setData((list) => list.map((t) => (t._id === ticket._id ? { ...t, ...payload } : t)));
      toast.success(isReply ? "تم حفظ الرد" : `أصبحت التذكرة «${ticketStatus(payload.status).label}»`);
    } catch (err) {
      toast.error(err.message || "تعذّر تحديث التذكرة. يُرجى المحاولة مرة أخرى.");
    } finally {
      if (isReply) setSaving((s) => ({ ...s, [ticket._id]: false }));
    }
  };

  const remove = async (ticket) => {
    const ok = await confirm({
      title: "حذف التذكرة؟",
      body: `ستُحذف التذكرة «${ticket.title}» وردّها نهائيًا.`,
      confirmLabel: "حذف التذكرة",
      destructive: true,
    });
    if (!ok) return;
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${ticket._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) throw new Error();
      setData((list) => list.filter((t) => t._id !== ticket._id));
      toast.success("تم حذف التذكرة");
    } catch {
      toast.error("تعذّر حذف التذكرة. يُرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="تذاكر الدعم"
        description="أسئلة الطلاب ومشكلاتهم وردود الإدارة عليها."
        actions={
          <Link
            to="/create-ticket"
            className="inline-flex h-10 items-center justify-center rounded-md border border-border-control bg-surface px-4 text-sm font-semibold text-text-primary hover:bg-subtle"
          >
            فتح تذكرة
          </Link>
        }
      />

      <Card>
        <Tabs
          label="حالة التذاكر"
          className="px-2 sm:px-4"
          value={segment}
          onChange={(v) => setParams(v === "all" ? {} : { status: v }, { replace: true })}
          items={SEGMENTS.map((s) => ({
            value: s,
            label: s === "all" ? "الكل" : TICKET_STATUS[s].label,
            count: status === "ready" ? counts[s] || 0 : undefined,
          }))}
        />
        {status === "loading" ? (
          <SkeletonRows rows={5} />
        ) : status === "failed" ? (
          <EmptyState kind="failed" title="تعذّر تحميل التذاكر" onRetry={reload} />
        ) : visible.length === 0 ? (
          <EmptyState
            kind={segment === "all" ? "first-use" : "all-done"}
            title={segment === "all" ? "لا توجد تذاكر بعد" : `لا توجد تذاكر «${TICKET_STATUS[segment].label}»`}
          />
        ) : (
          <ul className="divide-y divide-border-subtle">
            {visible.map((ticket) => {
              const st = ticketStatus(ticket.status);
              const reply = replies[ticket._id] ?? ticket.response ?? "";
              const changed = reply !== (ticket.response || "");
              return (
                <li key={ticket._id} className="px-4 py-5 sm:px-6">
                  <article className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <Avatar name={ticket.userId?.name} size={40} />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 dir="auto" className="text-heading-4 text-text-primary">
                              {ticket.title}
                            </h2>
                            <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
                          </div>
                          <p className="text-xs text-text-tertiary">
                            <bdi>{ticket.userId?.name || "مستخدم"}</bdi> ·{" "}
                            <time className="num" dateTime={ticket.createdAt} title={formatDateTime(ticket.createdAt)}>
                              {formatRelative(ticket.createdAt)}
                            </time>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Select
                          aria-label={`حالة التذكرة ${ticket.title}`}
                          className="h-8 w-auto text-sm"
                          value={TICKET_STATUS[ticket.status] ? ticket.status : "Open"}
                          onChange={(e) => update(ticket, { status: e.target.value })}
                        >
                          {Object.entries(TICKET_STATUS).map(([value, s]) => (
                            <option key={value} value={value}>
                              {s.label}
                            </option>
                          ))}
                        </Select>
                        {isAdmin ? (
                          <IconButton label={`حذف التذكرة ${ticket.title}`} size="sm" tone="danger" onClick={() => remove(ticket)}>
                            <Trash2 />
                          </IconButton>
                        ) : null}
                      </div>
                    </div>
                    {ticket.description ? (
                      <p dir="auto" className="reading whitespace-pre-wrap text-sm text-text-secondary">
                        {ticket.description}
                      </p>
                    ) : null}
                    <form
                      className="space-y-2 rounded-lg bg-subtle p-3 sm:p-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        update(ticket, { response: reply }, true);
                      }}
                    >
                      <Field label="رد الإدارة" hint="يظهر للطالب في صفحة تذاكره" id={`reply-${ticket._id}`}>
                        <Textarea
                          value={reply}
                          onChange={(e) => setReplies((r) => ({ ...r, [ticket._id]: e.target.value }))}
                          dir="auto"
                        />
                      </Field>
                      <div className="flex justify-end">
                        <Button type="submit" size="sm" loading={saving[ticket._id]} disabled={!changed} aria-disabled={!changed || undefined}>
                          حفظ الرد
                        </Button>
                      </div>
                    </form>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
