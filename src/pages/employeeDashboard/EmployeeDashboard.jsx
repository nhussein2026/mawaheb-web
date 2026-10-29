/**
 * Employee directory (Workspace home for employees).
 * GET /employee → { total, page, pages, employees: [{ _id, job_title,
 * hire_date, bank_account_number, social_security_number,
 * user: { name, email, phone_number, role } }] }
 * The backend filters by job_title; name and email are matched on the page.
 */
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Lock } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { StatTile, StatTiles } from "../../components/ui/StatTile";
import { SearchInput } from "../../components/ui/SearchInput";
import { Pagination } from "../../components/ui/Pagination";
import { Drawer } from "../../components/ui/Drawer";
import { Avatar } from "../../components/ui/Avatar";
import { StatusBadge } from "../../components/ui/Badge";
import { EmptyState, SkeletonCard } from "../../components/ui/Feedback";
import { formatRoleAr } from "../../components/admin/adminCopy";
import { useResource } from "../../hooks/useResource";
import { API_BASE_URL } from "../../services/api/config";
import { matchesSearch } from "../../utils/arabic";
import { formatDate } from "../../utils/format";

const PAGE_SIZE = 12;

// Restricted values (§6.2) are never shown in full here.
const Masked = ({ value }) =>
  value ? (
    <span className="inline-flex items-center gap-1.5 text-text-secondary">
      <Lock className="size-4" aria-hidden="true" /> مسجّل ومخفي
    </span>
  ) : (
    "—"
  );

function Detail({ label, children }) {
  return (
    <div className="grid gap-0.5 py-3 md:grid-cols-[35%_1fr] md:gap-3">
      <dt className="text-sm text-text-tertiary">{label}</dt>
      <dd className="text-sm text-text-primary">{children || "—"}</dd>
    </div>
  );
}

const EmployeeDashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(query.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const { data, status, reload } = useResource(
    async () => {
      const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
      if (search) params.append("job_title", search);
      const res = await fetch(`${API_BASE_URL}/employee?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    },
    [page, search, token],
    { initial: { employees: [], total: 0, pages: 1 }, select: (d) => d }
  );

  const employees = useMemo(
    () =>
      search
        ? (data.employees || []).filter((e) => matchesSearch(`${e.job_title || ""} ${e.user?.name || ""} ${e.user?.email || ""}`, search))
        : data.employees || [],
    [data, search]
  );

  return (
    <div className="space-y-6">
      <PageHeader title="الموظفون" description="بيانات موظفي المؤسسة ومسمياتهم الوظيفية." />

      <StatTiles cols={2}>
        <StatTile label="إجمالي الموظفين" value={status === "ready" ? data.total ?? 0 : "—"} />
        <StatTile label="الصفحة" value={status === "ready" ? `${data.page || page} / ${data.pages || 1}` : "—"} />
      </StatTiles>

      <Card>
        <div className="border-b border-border-default px-4 py-3 sm:px-6">
          <SearchInput
            label="بحث في الموظفين"
            placeholder="ابحث بالمسمى الوظيفي أو الاسم أو البريد…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-96"
          />
        </div>

        <div className="p-4 sm:p-6">
          {status === "loading" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <SkeletonCard lines={2} />
              <SkeletonCard lines={2} />
              <SkeletonCard lines={2} />
            </div>
          ) : status === "failed" ? (
            <EmptyState kind="failed" title="تعذّر تحميل بيانات الموظفين" onRetry={reload} />
          ) : employees.length === 0 ? (
            search ? (
              <EmptyState kind="no-results" title={`لا توجد نتائج لـ «${search}»`} description="جرّب كلمة أقصر أو ابحث بالمسمى الوظيفي." />
            ) : (
              <EmptyState kind="first-use" title="لا يوجد موظفون مسجّلون بعد" />
            )
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {employees.map((emp) => (
                <li key={emp._id}>
                  <button
                    type="button"
                    onClick={() => setSelected(emp)}
                    className="flex w-full items-center gap-3 rounded-lg border border-border-default bg-surface p-4 text-start transition-shadow hover:shadow-raised"
                  >
                    <Avatar name={emp.user?.name} src={emp.user?.photoURL} size={40} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-text-primary">{emp.user?.name || "—"}</span>
                      <span className="block truncate text-sm text-text-secondary">{emp.job_title || "—"}</span>
                      <span className="num block text-xs text-text-tertiary">منذ {formatDate(emp.hire_date)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {status === "ready" ? (
          <Pagination page={page} pages={data.pages || 1} total={data.total} pageSize={PAGE_SIZE} onChange={setPage} />
        ) : null}
      </Card>

      <Drawer open={Boolean(selected)} onClose={() => setSelected(null)} title="بيانات الموظف">
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={selected.user?.name} src={selected.user?.photoURL} size={56} />
              <div className="min-w-0">
                <p className="text-heading-4 text-text-primary">{selected.user?.name}</p>
                <p className="truncate text-sm text-text-tertiary">
                  <bdi>{selected.user?.email}</bdi>
                </p>
                {selected.user?.role ? <StatusBadge className="mt-1">{formatRoleAr(selected.user.role)}</StatusBadge> : null}
              </div>
            </div>
            <dl className="divide-y divide-border-subtle">
              <Detail label="المسمى الوظيفي">{selected.job_title}</Detail>
              <Detail label="تاريخ التعيين">
                <span className="num">{formatDate(selected.hire_date)}</span>
              </Detail>
              <Detail label="رقم الهاتف">
                {selected.user?.phone_number ? <bdi className="num">{selected.user.phone_number}</bdi> : null}
              </Detail>
              <Detail label="رقم الضمان الاجتماعي">
                <Masked value={selected.social_security_number} />
              </Detail>
              <Detail label="رقم الحساب البنكي">
                <Masked value={selected.bank_account_number} />
              </Detail>
            </dl>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
};

export default EmployeeDashboard;
