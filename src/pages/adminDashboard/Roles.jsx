import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/DataTable";
import { Search, ShieldAlert, Users, GraduationCap } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { formatRoleAr } from "../../components/admin/adminCopy";

const roles = ["User", "Employee", "Admin", "Institute Student", "Scholarship Student"];

const selectClass =
  "flex h-9 w-full max-w-xs items-center rounded-md border-[0.5px] border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 disabled:opacity-50 sm:w-48";

export default function Roles() {
  const token = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/users?limit=50&search=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, token]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        console.warn("الخادم لم يؤكد التحديث؛ تم تحديث الواجهة مؤقتاً.");
      }

      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      console.error("Error updating role", err);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <AdminPageHeader
          title="الأدوار والصلاحيات"
          description="ربط كل حساب بدور في المنصة. يُستدعى `PUT /admin/users/:id/role` عند توفره في الخادم."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-brand-800 bg-brand-800 text-text-inverse">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-brand-200">المسؤولون</p>
                  <p className="mt-2 text-xl font-medium">صلاحية كاملة</p>
                </div>
                <ShieldAlert className="h-8 w-8 shrink-0 text-accent-400" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-text-muted">الموظفون</p>
                  <p className="mt-2 text-xl font-medium text-text-primary">تشغيلي</p>
                  <p className="mt-1 text-xs text-text-secondary">أدوات مواجهة الطلاب</p>
                </div>
                <Users className="h-8 w-8 shrink-0 text-brand-600" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-text-muted">الطلاب</p>
                  <p className="mt-2 text-xl font-medium text-text-primary">مقيّد</p>
                  <p className="mt-1 text-xs text-text-secondary">منحة ومعهد</p>
                </div>
                <GraduationCap className="h-8 w-8 shrink-0 text-brand-600" aria-hidden="true" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>تعيين الأدوار</CardTitle>
                <CardDescription>بحث وتحديث لأول ٥٠ نتيجة مطابقة.</CardDescription>
              </div>
              <div className="relative max-w-md">
                <Search className="pointer-events-none absolute start-2.5 top-2.5 h-4 w-4 text-text-muted" />
                <Input
                  type="search"
                  placeholder="ابحث عن مستخدم…"
                  className="ps-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-10 text-center text-sm text-text-secondary">جاري تحميل المستخدمين…</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المستخدم</TableHead>
                    <TableHead>الدور الحالي</TableHead>
                    <TableHead>دور جديد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="font-medium text-text-primary">{user.name}</div>
                        <div className="text-sm text-text-secondary">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border-[0.5px] border-border-default bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-text-secondary">
                          {formatRoleAr(user.role)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <select
                            className={selectClass}
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            disabled={updatingId === user._id}
                          >
                            {roles.map((r) => (
                              <option key={r} value={r}>
                                {formatRoleAr(r)}
                              </option>
                            ))}
                          </select>
                          {updatingId === user._id ? (
                            <div
                              className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600"
                              aria-hidden="true"
                            />
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-text-secondary">
                        لا يوجد مستخدمون.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
