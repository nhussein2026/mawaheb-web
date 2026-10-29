import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { StatusBadge, Count } from "../../components/ui/Badge";
import { PersonCell } from "../../components/ui/PersonCell";
import { EmptyState, SkeletonRows } from "../../components/ui/Feedback";
import { useConfirm } from "../../components/ui/confirmContext";
import { useResource } from "../../hooks/useResource";
import { formatRoleAr } from "../../components/admin/adminCopy";
import { dispatchRoleRequestsRefresh } from "../../components/admin/adminRoleRequestEvents";
import { API_BASE_URL } from "../../services/api/config";
import { formatRelative } from "../../utils/format";

// Review queue for membership requests, oldest first (§4.9 "Sorting").
export default function RoleRequestManager() {
  const token = useSelector((state) => state.auth.token);
  const confirm = useConfirm();
  const [busyId, setBusyId] = useState(null);

  const { data, status, reload } = useResource(
    async () => {
      const res = await fetch(`${API_BASE_URL}/user/admin/role-requests`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    },
    [token],
    { initial: [], select: (json) => (json?.success && Array.isArray(json.data) ? json.data : []) }
  );

  const requests = useMemo(
    () => [...data].sort((a, b) => new Date(a.updatedAt || a.createdAt || 0) - new Date(b.updatedAt || b.createdAt || 0)),
    [data]
  );

  const handleAction = async (request, decision) => {
    const approve = decision === "Approved";
    const ok = await confirm({
      title: approve ? `قبول طلب ${request.name}؟` : `رفض طلب ${request.name}؟`,
      body: approve
        ? `سيصبح دوره «${formatRoleAr(request.requestedRole)}» وتتاح له صفحاته بعد تسجيل دخوله التالي.`
        : "سيبقى دوره الحالي كما هو، ويمكنه تقديم طلب جديد.",
      confirmLabel: approve ? "قبول الطلب" : "رفض الطلب",
      destructive: !approve,
    });
    if (!ok) return;
    setBusyId(request._id);
    try {
      const response = await fetch(`${API_BASE_URL}/user/admin/role-requests/${request._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: decision }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok || !json.success) throw new Error(json.message);
      toast.success(approve ? "تم قبول الطلب" : "تم رفض الطلب");
      await reload();
      dispatchRoleRequestsRefresh();
    } catch (err) {
      toast.error(err.message || "تعذّر معالجة الطلب. يُرجى المحاولة مرة أخرى.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="طلبات الأدوار"
        description="طلبات المستخدمين للحصول على دور في المنصة، الأقدم أولًا."
        status={status === "ready" && requests.length ? <Count value={requests.length} label={`${requests.length} طلبات`} /> : null}
      />

      <Card>
        {status === "loading" ? (
          <SkeletonRows rows={4} />
        ) : status === "failed" ? (
          <EmptyState kind="failed" title="تعذّر تحميل طلبات الأدوار" onRetry={reload} />
        ) : requests.length === 0 ? (
          <EmptyState kind="all-done" title="لا توجد طلبات بانتظار المراجعة" />
        ) : (
          <ul className="divide-y divide-border-subtle">
            {requests.map((r) => (
              <li key={r._id} className="flex flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <PersonCell name={r.name} secondary={r.email} secondaryLtr src={r.imageUrl} />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-text-secondary md:w-72">
                  <StatusBadge>{formatRoleAr(r.role)}</StatusBadge>
                  <span aria-hidden="true">إلى</span>
                  <span className="sr-only">يطلب دور</span>
                  <StatusBadge tone="info">{formatRoleAr(r.requestedRole)}</StatusBadge>
                  {r.updatedAt ? <span className="num text-xs text-text-tertiary">{formatRelative(r.updatedAt)}</span> : null}
                </div>
                <div className="flex gap-2 max-md:[&>*]:flex-1">
                  <Button variant="danger-secondary" size="sm" disabled={busyId === r._id} onClick={() => handleAction(r, "Rejected")}>
                    رفض
                  </Button>
                  <Button size="sm" loading={busyId === r._id} onClick={() => handleAction(r, "Approved")}>
                    قبول
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
