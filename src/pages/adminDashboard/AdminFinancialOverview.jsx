import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/DataTable";
import { Button } from "../../components/ui/Button";
import { Wallet, Calendar, ExternalLink } from "lucide-react";

export default function AdminFinancialOverview() {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/financial-report`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("تعذّر تحميل التقارير المالية");
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  return (
    <>
      <div className="space-y-6">
        <AdminPageHeader
          title="السجلات المالية"
          description="عرض قراءة فقط للتقارير المالية. الرفع والتعديل يبقى في صفحة الطالب لتجنّب تكرار النماذج."
          actions={
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="rounded-md"
              onClick={() => navigate("/student/financial-report")}
            >
              <ExternalLink className="ms-1.5 h-4 w-4" />
              المحرّر الكامل
            </Button>
          }
        />

        <Card>
          <CardContent className="p-0 sm:p-0">
            {loading ? (
              <p className="p-8 text-center text-sm text-text-secondary">جاري التحميل…</p>
            ) : error ? (
              <p className="p-8 text-center text-sm text-error-text">{error}</p>
            ) : rows.length === 0 ? (
              <p className="p-8 text-center text-sm text-text-secondary">لا توجد تقارير مالية بعد.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العنوان</TableHead>
                    <TableHead className="hidden sm:table-cell">التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <Wallet className="mt-0.5 h-4 w-4 text-brand-600" />
                          <span className="font-medium">{r.title || "بدون عنوان"}</span>
                        </div>
                        {r.description ? (
                          <p className="mt-1 line-clamp-2 text-xs text-text-secondary">{r.description}</p>
                        ) : null}
                      </TableCell>
                      <TableCell className="hidden text-text-secondary sm:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {r.date_of_report ? new Date(r.date_of_report).toLocaleDateString("ar-SA") : "—"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
