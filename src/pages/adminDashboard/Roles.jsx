import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableStateRow } from "../../components/ui/DataTable";
import { Select } from "../../components/ui/Input";
import { SearchInput } from "../../components/ui/SearchInput";
import { StatusBadge } from "../../components/ui/Badge";
import { PersonCell } from "../../components/ui/PersonCell";
import { EmptyState, SkeletonRows, Spinner } from "../../components/ui/Feedback";
import { useConfirm } from "../../components/ui/confirmContext";
import { formatRoleAr } from "../../components/admin/adminCopy";
import { API_BASE_URL } from "../../services/api/config";
import { useLoadEffect } from "../../hooks/useLoadEffect";

const ROLES = ["User", "Employee", "Admin", "Institute Student", "Scholarship Student"];

// Assign a platform role to an account. A change is shown only after the
// server confirms it; a failure is reported on the row and nothing changes.
export default function Roles() {
  const token = useSelector((state) => state.auth.token);
  const confirm = useConfirm();
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [rowError, setRowError] = useState({});

  useEffect(() => {
    const t = setTimeout(() => setSearch(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users?limit=50&search=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      setUsers(data.success ? data.data : []);
      setStatus("ready");
    } catch {
      setStatus("failed");
    }
  }, [search, token]);

  useLoadEffect(fetchUsers);

  const retry = () => {
    setStatus("loading");
    fetchUsers();
  };

  const handleRoleChange = async (user, newRole) => {
    if (newRole === user.role) return;
    const ok = await confirm({
      title: `تغيير دور ${user.name}؟`,
      body: `سيتغير الدور من «${formatRoleAr(user.role)}» إلى «${formatRoleAr(newRole)}»، وتتغير معه الصفحات والصلاحيات المتاحة له بعد تسجيل دخوله التالي.`,
      confirmLabel: "تغيير الدور",
    });
    if (!ok) return;
    setUpdatingId(user._id);
    setRowError((e) => ({ ...e, [user._id]: "" }));
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${user._id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u)));
      toast.success("تم تغيير الدور");
    } catch {
      setRowError((e) => ({
        ...e,
        [user._id]: "تعذّر تغيير الدور ولم يُحفظ. يمكن تعيين الأدوار حاليًا من صفحة طلبات الأدوار.",
      }));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="الأدوار والصلاحيات" description="ربط كل حساب بدور في المنصة. يأخذ الدور الجديد أثره بعد تسجيل الدخول التالي." />

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-border-default px-4 py-3 sm:px-6">
          <SearchInput
            label="بحث في المستخدمين"
            placeholder="ابحث بالاسم أو البريد…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-72"
          />
          <p className="text-xs text-text-tertiary">تظهر أول 50 نتيجة مطابقة.</p>
        </div>
        <Table caption="أدوار المستخدمين">
          <TableHeader>
            <TableRow>
              <TableHead>المستخدم</TableHead>
              <TableHead>الدور الحالي</TableHead>
              <TableHead>تغيير الدور</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {status === "loading" ? (
              <TableStateRow colSpan={3}>
                <SkeletonRows rows={8} />
              </TableStateRow>
            ) : status === "failed" ? (
              <TableStateRow colSpan={3}>
                <EmptyState kind="failed" compact title="تعذّر تحميل المستخدمين" onRetry={retry} />
              </TableStateRow>
            ) : users.length === 0 ? (
              <TableStateRow colSpan={3}>
                <EmptyState kind="no-results" compact title={search ? `لا توجد نتائج لـ «${search}»` : "لا يوجد مستخدمون"} />
              </TableStateRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="min-w-60">
                    <PersonCell name={user.name} secondary={user.email} secondaryLtr src={user.imageUrl} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge>{formatRoleAr(user.role)}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select
                        aria-label={`دور ${user.name}`}
                        className="w-full sm:w-52"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user, e.target.value)}
                        disabled={updatingId === user._id}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {formatRoleAr(r)}
                          </option>
                        ))}
                      </Select>
                      {updatingId === user._id ? <Spinner label="جارٍ الحفظ" className="text-text-tertiary" /> : null}
                    </div>
                    {rowError[user._id] ? (
                      <p role="alert" className="mt-1 max-w-sm text-xs font-semibold text-danger-700">
                        {rowError[user._id]}
                      </p>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
