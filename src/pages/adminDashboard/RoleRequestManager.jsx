import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { UserCheck, UserX, Clock, User, Mail, Shield } from "lucide-react";
import { toast } from "react-toastify";
import AdminLayout from "../../components/admin/AdminLayout";

const RoleRequestManager = () => {
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
        fetchRequests();
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
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">طلبات تعديل الأدوار</h1>
          <p className="text-gray-500 dark:text-gray-400">إدارة طلبات المستخدمين الجدد لتحديد أدوارهم في المنصة.</p>
        </div>

        <div className="grid gap-6">
          {requests.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <div className="flex flex-col items-center">
                <Clock className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">لا توجد طلبات معلقة</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">سيظهر هنا طلبات المستخدمين الجدد فور تقديمها.</p>
              </div>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request._id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <User size={32} />
                    </div>
                  </div>
                  
                  <div className="flex-grow space-y-2 text-center md:text-right">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{request.name}</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Mail size={14} />
                        <span>{request.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield size={14} />
                        <span>الدور الحالي: {request.role}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">الدور المطلوب</span>
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{request.requestedRole}</span>
                  </div>

                  <div className="flex gap-3 mt-4 md:mt-0">
                    <Button
                      onClick={() => handleAction(request._id, "Approved")}
                      className="bg-green-600 hover:bg-green-700 text-white gap-2"
                    >
                      <UserCheck size={18} />
                      <span>قبول</span>
                    </Button>
                    <Button
                      onClick={() => handleAction(request._id, "Rejected")}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 gap-2"
                    >
                      <UserX size={18} />
                      <span>رفض</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RoleRequestManager;
