import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/DataTable";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Search, Edit, Trash2, Download } from "lucide-react";
import { formatRoleAr } from "../../components/admin/adminCopy";

const roleBadge =
  "inline-flex items-center rounded-full border-[0.5px] border-success-border bg-success-bg px-2.5 py-0.5 text-[11px] font-medium text-success-text";

export default function AllUsers() {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    setSearchTerm(q);
    setPage(1);
  }, [location.search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: "10",
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (searchTerm) queryParams.append("search", searchTerm);
      if (roleFilter) queryParams.append("role", roleFilter);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/users?${queryParams}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("تعذّر جلب المستخدمين");

      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
        setTotalPages(data.pages);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, roleFilter, token]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchUsers]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("فشل الحذف");

      fetchUsers();
    } catch (err) {
      alert("خطأ أثناء الحذف: " + err.message);
    }
  };

  const exportCsv = () => {
    const header = ["الاسم", "البريد", "الدور", "الهاتف"];
    const lines = [header.join(",")].concat(
      users.map((u) =>
        [u.name, u.email, formatRoleAr(u.role), u.phone_number || ""]
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
    );
    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mawaheb-users-page-${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectClass =
    "flex h-10 w-full items-center rounded-md border-[0.5px] border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 disabled:opacity-50";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AdminPageHeader
          title="دليل المستخدمين"
          description="بحث، تصفية، تصدير، وحذف الحسابات. يُفضّل تعديل الأدوار من صفحة الأدوار المخصصة."
        />

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>كل المستخدمين</CardTitle>
                <CardDescription>قائمة مرقّمة من مسار `/admin/users`.</CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="pointer-events-none absolute start-2.5 top-2.5 h-4 w-4 text-text-muted" />
                  <Input
                    type="search"
                    placeholder="ابحث عن مستخدم…"
                    className="ps-9 sm:w-64"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <select
                  className={selectClass + " sm:w-52"}
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">كل الأدوار</option>
                  <option value="Admin">مسؤول</option>
                  <option value="Employee">موظف</option>
                  <option value="Institute Student">طالب معهد</option>
                  <option value="Scholarship Student">طالب منحة</option>
                  <option value="User">مستخدم</option>
                </select>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-md"
                  disabled={!users.length}
                  onClick={exportCsv}
                >
                  <Download className="ms-1.5 h-4 w-4" />
                  تصدير CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading && users.length === 0 ? (
              <div className="py-10 text-center text-sm text-text-secondary">جاري تحميل المستخدمين…</div>
            ) : error ? (
              <div className="py-10 text-center text-sm text-error-text">{error}</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>المستخدم</TableHead>
                      <TableHead>الدور</TableHead>
                      <TableHead className="hidden md:table-cell">الهاتف</TableHead>
                      <TableHead className="text-end">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              className="h-10 w-10 rounded-full border-[0.5px] border-border-subtle object-cover bg-neutral-100"
                              src={
                                user.imageUrl ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=EAF3EC&color=1A3A2A`
                              }
                              alt=""
                            />
                            <div>
                              <div className="font-medium text-text-primary">{user.name}</div>
                              <div className="text-sm text-text-secondary">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={roleBadge}>{formatRoleAr(user.role)}</span>
                        </TableCell>
                        <TableCell className="hidden text-text-secondary md:table-cell">
                          {user.phone_number || "—"}
                        </TableCell>
                        <TableCell className="text-end">
                          <div className="flex justify-end gap-1">
                            <Link
                              to="/admin-dashboard/roles"
                              title="تعيين الدور"
                              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-neutral-100 hover:text-text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="حذف المستخدم"
                              className="rounded-md text-error-text hover:bg-error-bg"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-text-secondary">
                          لا يوجد مستخدمون.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between gap-2 py-4">
                  <div className="text-sm text-text-muted">
                    الصفحة {page} من {totalPages || 1}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-md"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      السابق
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-md"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages || totalPages === 0}
                    >
                      التالي
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
