import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/DataTable";
import { FileText, Calendar, User, ExternalLink } from "lucide-react";

export default function AdminStudentReports() {
  const token = useSelector((state) => state.auth.token);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/allReports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("تعذّر تحميل التقارير");
        const json = await response.json();

        // Handle standardized { success, data } or legacy { studentReports }
        const data = json.success && Array.isArray(json.data)
          ? json.data
          : (Array.isArray(json.studentReports) ? json.studentReports : []);

        setReports(data);
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [token]);

  return (
    <>
      <div className="space-y-6">
        <AdminPageHeader
          title="تقارير الطلاب"
          description="جميع تقارير الطلاب المسجّلة عبر المسار `/reports`. يمكنك فتح عرض البطاقات من الرابط أدناه."
          actions={
            <Link
              to="/try-report-list"
              className="inline-flex items-center gap-1.5 rounded-md border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-medium text-brand-800 hover:bg-brand-100"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              عرض القائمة
            </Link>
          }
        />

        <Card>
          <CardContent className="p-0 sm:p-0">
            {loading ? (
              <p className="p-8 text-center text-sm text-text-secondary">جاري التحميل…</p>
            ) : error ? (
              <p className="p-8 text-center text-sm text-error-text">{error}</p>
            ) : reports.length === 0 ? (
              <p className="p-8 text-center text-sm text-text-secondary">لا توجد تقارير.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العنوان</TableHead>
                    <TableHead>الطالب</TableHead>
                    <TableHead className="hidden md:table-cell">التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report._id}>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                          <span className="font-medium">{report.title || "بدون عنوان"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-text-muted" />
                          {report.userId?.name || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-text-secondary md:table-cell">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {report.date_of_report
                            ? new Date(report.date_of_report).toLocaleDateString("ar-SA")
                            : "—"}
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
