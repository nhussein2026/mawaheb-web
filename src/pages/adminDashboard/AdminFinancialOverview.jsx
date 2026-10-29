import React from "react";
import { useSelector } from "react-redux";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableStateRow } from "../../components/ui/DataTable";
import { Callout, EmptyState, SkeletonRows } from "../../components/ui/Feedback";
import { useResource } from "../../hooks/useResource";
import { API_BASE_URL } from "../../services/api/config";
import { formatDate } from "../../utils/format";

// Read-only list of financial reports. The endpoint currently returns only
// the signed-in account's reports (API report M2), so the page says so.
export default function AdminFinancialOverview() {
  const token = useSelector((state) => state.auth.token);
  const { data: rows, status, reload } = useResource(
    async () => {
      const res = await fetch(`${API_BASE_URL}/financial-report`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(String(res.status));
      return res.json();
    },
    [token],
    { initial: [], select: (d) => (Array.isArray(d) ? d : []) }
  );

  return (
    <div className="space-y-6">
      <PageHeader title="السجلات المالية" description="التقارير المالية المسجّلة، للاطلاع فقط." />

      <Callout tone="info" title="تعرض هذه الصفحة التقارير المرتبطة بحسابك فقط">
        عرض التقارير المالية لجميع الطلاب يحتاج إلى دعم من الخادم لم يُضَف بعد.
      </Callout>

      <Card>
        <Table caption="السجلات المالية">
          <TableHeader>
            <TableRow>
              <TableHead>التقرير</TableHead>
              <TableHead>تاريخ التقرير</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {status === "loading" ? (
              <TableStateRow colSpan={2}>
                <SkeletonRows rows={5} />
              </TableStateRow>
            ) : status === "failed" ? (
              <TableStateRow colSpan={2}>
                <EmptyState kind="failed" compact title="تعذّر تحميل التقارير المالية" onRetry={reload} />
              </TableStateRow>
            ) : rows.length === 0 ? (
              <TableStateRow colSpan={2}>
                <EmptyState kind="first-use" compact title="لا توجد تقارير مالية" />
              </TableStateRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>
                    <p dir="auto" className="font-semibold">
                      {r.title || "بدون عنوان"}
                    </p>
                    {r.description ? (
                      <p dir="auto" className="mt-0.5 line-clamp-2 text-xs text-text-secondary">
                        {r.description}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="num whitespace-nowrap text-text-secondary">{formatDate(r.date_of_report)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
