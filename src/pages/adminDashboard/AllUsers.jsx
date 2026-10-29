import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Download, UserCog, Trash2 } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableStateRow } from "../../components/ui/DataTable";
import { Button, IconButton } from "../../components/ui/Button";
import { Select } from "../../components/ui/Input";
import { SearchInput } from "../../components/ui/SearchInput";
import { StatusBadge } from "../../components/ui/Badge";
import { PersonCell } from "../../components/ui/PersonCell";
import { Pagination } from "../../components/ui/Pagination";
import { EmptyState, SkeletonRows } from "../../components/ui/Feedback";
import { formatRoleAr } from "../../components/admin/adminCopy";
import { useConfirm } from "../../components/ui/confirmContext";
import { API_BASE_URL } from "../../services/api/config";
import { useLoadEffect } from "../../hooks/useLoadEffect";

const ROLES = ["Admin", "Employee", "Scholarship Student", "Institute Student", "User"];
const ROLE_TONE = { Admin: "info", Employee: "info", "Scholarship Student": "success", "Institute Student": "success", User: "neutral" };

// User directory. Search, role filter and page live in the URL so any view
// can be bookmarked and Back keeps its place. Destructive and role actions
// are shown to administrators only.
export default function AllUsers() {
  const token = useSelector((state) => state.auth.token);
  const isAdmin = useSelector((state) => state.auth.user?.role === "Admin");
  const confirm = useConfirm();
  const [params, setParams] = useSearchParams();

  const page = Math.max(1, Number(params.get("page")) || 1);
  const search = params.get("search") || "";
  const role = params.get("role") || "";

  const [query, setQuery] = useState(search);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(null);

  const update = useCallback(
    (next) => {
      const p = new URLSearchParams(params);
      Object.entries(next).forEach(([k, v]) => (v ? p.set(k, String(v)) : p.delete(k)));
      if (!("page" in next)) p.delete("page");
      setParams(p, { replace: true });
    },
    [params, setParams]
  );

  // Search as you type, 300 ms after typing stops.
  useEffect(() => {
    if (query === search) return undefined;
    const t = setTimeout(() => update({ search: query.trim() }), 300);
    return () => clearTimeout(t);
  }, [query, search, update]);

  const fetchUsers = useCallback(async () => {
    try {
      const q = new URLSearchParams({ page: String(page), limit: "10", sortBy: "createdAt", sortOrder: "desc" });
      if (search) q.append("search", search);
      if (role) q.append("role", role);
      const response = await fetch(`${API_BASE_URL}/admin/users?${q}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      setUsers(data.success ? data.data : []);
      setTotalPages(data.pages || 1);
      setTotal(data.total ?? null);
      setStatus("ready");
    } catch {
      setStatus("failed");
    }
  }, [page, search, role, token]);

  useLoadEffect(fetchUsers);

  const retry = () => {
    setStatus("loading");
    fetchUsers();
  };

  const handleDeleteUser = async (user) => {
    const ok = await confirm({
      title: `حذف المستخدم ${user.name}؟`,
      body: "سيُحذف الحساب نهائيًا ولن يتمكن صاحبه من تسجيل الدخول.",
      confirmLabel: "حذف المستخدم",
      destructive: true,
    });
    if (!ok) return;
    try {
      const response = await fetch(`${API_BASE_URL}/user/users/${user._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(String(response.status));
      toast.success("تم حذف المستخدم");
      fetchUsers();
    } catch {
      toast.error("تعذّر حذف المستخدم. يُرجى المحاولة مرة أخرى.");
    }
  };

  // Exports the current page with its filters; the file holds personal data.
  const exportCsv = () => {
    const header = ["الاسم", "البريد", "الدور", "الهاتف"];
    const lines = [header.join(",")].concat(
      users.map((u) =>
        [u.name, u.email, formatRoleAr(u.role), u.phone_number || ""]
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
    );
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mawaheb-users-page-${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = Boolean(search || role);
  const clear = () => {
    setQuery("");
    setParams(new URLSearchParams(), { replace: true });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="المستخدمون"
        description={isAdmin ? "البحث في الحسابات وتصفيتها وتصديرها. تُعدَّل الأدوار من صفحة الأدوار والصلاحيات." : "البحث في حسابات المنصة وتصفيتها."}
        actions={
          <Button variant="secondary" onClick={exportCsv} disabled={!users.length}>
            <Download aria-hidden="true" /> تصدير CSV
          </Button>
        }
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-border-default px-4 py-3 sm:px-6">
          <SearchInput
            label="بحث في المستخدمين"
            placeholder="ابحث بالاسم أو البريد…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-72"
          />
          <Select aria-label="الدور" className="w-full sm:w-52" value={role} onChange={(e) => update({ role: e.target.value })}>
            <option value="">كل الأدوار</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {formatRoleAr(r)}
              </option>
            ))}
          </Select>
          {filtered ? (
            <Button variant="tertiary" size="sm" onClick={clear}>
              مسح الفلاتر
            </Button>
          ) : null}
        </div>

        <Table caption="المستخدمون">
          <TableHeader>
            <TableRow>
              <TableHead>المستخدم</TableHead>
              <TableHead>الدور</TableHead>
              <TableHead>الهاتف</TableHead>
              {isAdmin ? (
                <TableHead>
                  <span className="sr-only">إجراءات</span>
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {status === "loading" ? (
              <TableStateRow colSpan={4}>
                <SkeletonRows rows={8} />
              </TableStateRow>
            ) : status === "failed" ? (
              <TableStateRow colSpan={4}>
                <EmptyState kind="failed" compact title="تعذّر تحميل المستخدمين" onRetry={retry} />
              </TableStateRow>
            ) : users.length === 0 ? (
              <TableStateRow colSpan={4}>
                {filtered ? (
                  <EmptyState
                    kind="no-results"
                    compact
                    title={search ? `لا توجد نتائج لـ «${search}» مع الفلاتر الحالية` : "لا يوجد مستخدمون بهذا الدور"}
                    description="جرّب كلمة أقصر أو ابحث بالبريد الإلكتروني."
                    action={
                      <Button variant="secondary" onClick={clear}>
                        مسح الفلاتر
                      </Button>
                    }
                  />
                ) : (
                  <EmptyState kind="first-use" compact title="لا يوجد مستخدمون بعد" />
                )}
              </TableStateRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="min-w-60">
                    <PersonCell name={user.name} secondary={user.email} secondaryLtr src={user.imageUrl} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={ROLE_TONE[user.role] || "neutral"}>{formatRoleAr(user.role)}</StatusBadge>
                  </TableCell>
                  <TableCell className="num text-text-secondary">
                    <bdi>{user.phone_number || "—"}</bdi>
                  </TableCell>
                  {isAdmin ? (
                    <TableCell className="w-24">
                      <div className="flex justify-end gap-1">
                        <Link
                          to="/admin-dashboard/roles"
                          aria-label={`تعيين دور ${user.name}`}
                          title="تعيين الدور"
                          className="inline-grid size-8 place-items-center rounded-md text-text-secondary hover:bg-subtle hover:text-text-primary pointer-coarse:size-11"
                        >
                          <UserCog className="size-4" aria-hidden="true" />
                        </Link>
                        <IconButton label={`حذف ${user.name}`} size="sm" tone="danger" onClick={() => handleDeleteUser(user)}>
                          <Trash2 />
                        </IconButton>
                      </div>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination page={page} pages={totalPages} total={total} pageSize={10} onChange={(p) => update({ page: p })} />
      </Card>
    </div>
  );
}
