import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableStateRow } from "../../components/ui/DataTable";
import { SearchInput } from "../../components/ui/SearchInput";
import { PersonCell } from "../../components/ui/PersonCell";
import { EmptyState, SkeletonRows } from "../../components/ui/Feedback";
import { useResource } from "../../hooks/useResource";
import { API_BASE_URL } from "../../services/api/config";
import { matchesSearch } from "../../utils/arabic";
import { formatDate } from "../../utils/format";

// All students' semester reports. Shared by the admin and employee areas;
// when the server refuses access (403) the page says so and who can grant it.
export default function AdminStudentReports() {
  const token = useSelector((state) => state.auth.token);
  const [query, setQuery] = useState("");

  const { data: reports, status, error, reload } = useResource(
    async () => {
      const response = await fetch(`${API_BASE_URL}/allReports`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.status === 403) {
        const err = new Error("forbidden");
        err.forbidden = true;
        throw err;
      }
      if (!response.ok) throw new Error(String(response.status));
      return response.json();
    },
    [token],
    {
      initial: [],
      select: (json) =>
        json?.success && Array.isArray(json.data) ? json.data : Array.isArray(json?.studentReports) ? json.studentReports : [],
    }
  );

  const forbidden = Boolean(error?.forbidden);

  const rows = useMemo(
    () => (query ? reports.filter((r) => matchesSearch(`${r.title || ""} ${r.userId?.name || ""}`, query)) : reports),
    [reports, query]
  );

  return (
    <div className="space-y-6">
      <PageHeader title="تقارير الطلاب" description="التقارير الفصلية التي يرفعها طلاب المنح، الأحدث أولًا." />

      <Card>
        {status === "failed" && forbidden ? (
          <EmptyState
            kind="no-access"
            title="لا تملك صلاحية عرض تقارير الطلاب"
            description="يمكن لمدير النظام منحك الصلاحية إن كنت تحتاج إليها في عملك."
          />
        ) : (
          <>
            <div className="border-b border-border-default px-4 py-3 sm:px-6">
              <SearchInput
                label="بحث في التقارير"
                placeholder="ابحث بعنوان التقرير أو اسم الطالب…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full sm:w-80"
              />
            </div>
            <Table caption="تقارير الطلاب">
              <TableHeader>
                <TableRow>
                  <TableHead>الطالب</TableHead>
                  <TableHead>عنوان التقرير</TableHead>
                  <TableHead>تاريخ التقرير</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {status === "loading" ? (
                  <TableStateRow colSpan={3}>
                    <SkeletonRows rows={8} />
                  </TableStateRow>
                ) : status === "failed" ? (
                  <TableStateRow colSpan={3}>
                    <EmptyState kind="failed" compact title="تعذّر تحميل التقارير" onRetry={reload} />
                  </TableStateRow>
                ) : rows.length === 0 ? (
                  <TableStateRow colSpan={3}>
                    {query ? (
                      <EmptyState kind="no-results" compact title={`لا توجد نتائج لـ «${query}»`} />
                    ) : (
                      <EmptyState kind="first-use" compact title="لم يرفع الطلاب أي تقارير بعد" />
                    )}
                  </TableStateRow>
                ) : (
                  rows.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell className="min-w-56">
                        <PersonCell name={report.userId?.name} secondary={report.userId?.email} secondaryLtr />
                      </TableCell>
                      <TableCell dir="auto" className="font-semibold">
                        {report.title || "بدون عنوان"}
                      </TableCell>
                      <TableCell className="num whitespace-nowrap text-text-secondary">{formatDate(report.date_of_report)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </>
        )}
      </Card>
    </div>
  );
}
