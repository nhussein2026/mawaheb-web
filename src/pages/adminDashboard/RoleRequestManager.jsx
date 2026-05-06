import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { UserCheck, UserX, Clock, User, Mail, Shield } from "lucide-react";
import { toast } from "react-toastify";

import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { formatRoleAr } from "../../components/admin/adminCopy";
import { dispatchRoleRequestsRefresh } from "../../components/admin/adminRoleRequestEvents";

export default function RoleRequestManager() {
  const token = useSelector((state) => state.auth.token);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/admin/role-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("فشل تحميل طلبات الأدوار");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const handleAction = async (userId, status) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/admin/role-requests/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        toast.success(`تم ${status === "Approved" ? "قبول" : "رفض"} الطلب بنجاح`);
        await fetchRequests();
        dispatchRoleRequestsRefresh();
      } else {
        toast.error(data.message || "فشل معالجة الطلب");
      }
    } catch (error) {
      console.error("Error handling request:", error);
      toast.error("حدث خطأ أثناء معالجة الطلب");
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex min-h-[40vh] items-center justify-center">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"
            aria-hidden="true"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <AdminPageHeader
          title="طلبات تعديل الأدوار"
          description="إدارة طلبات المستخدمين لاعتماد أدوار جديدة في المنصة."
        />

        <div className="grid gap-4">
          {requests.length === 0 ? (
            <Card className="border-dashed border-border-default">
              <CardContent className="flex flex-col items-center py-14 text-center">
                <Clock className="mb-4 h-12 w-12 text-text-muted" />
                <h3 className="text-base font-medium text-text-primary">لا توجد طلبات معلقة</h3>
                <p className="mt-1 max-w-md text-sm text-text-secondary">
                  سيظهر هنا طلبات المستخدمين فور تقديمها.
                </p>
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request._id}>
                <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex shrink-0 items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-border-subtle">
                      <User className="h-8 w-8" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-2 text-center md:text-start">
                    <h3 className="text-lg font-medium text-text-primary">{request.name}</h3>
                    <div className="flex flex-wrap justify-center gap-4 text-sm text-text-secondary md:justify-start">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4 shrink-0" />
                        <span>{request.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 shrink-0" />
                        <span>الدور الحالي: {formatRoleAr(request.role)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 rounded-md border-[0.5px] border-border-subtle bg-surface-page px-4 py-3 md:items-end">
                    <span className="text-[11px] font-medium uppercase tracking-[0.07em] text-text-muted">
                      الدور المطلوب
                    </span>
                    <span className="text-base font-medium text-text-brand">
                      {formatRoleAr(request.requestedRole)}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 md:justify-end">
                    <Button
                      type="button"
                      variant="primary"
                      className="rounded-md"
                      onClick={() => handleAction(request._id, "Approved")}
                    >
                      <UserCheck className="ms-1.5 h-4 w-4" />
                      قبول
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      className="rounded-md"
                      onClick={() => handleAction(request._id, "Rejected")}
                    >
                      <UserX className="ms-1.5 h-4 w-4" />
                      رفض
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
