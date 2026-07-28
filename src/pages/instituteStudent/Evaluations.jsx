import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/DataTable";
import instituteApi from "../../services/api/instituteApi";
import { evaluationPeriodLabel } from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleDateString("ar") : "—");

const Evaluations = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    instituteApi
      .getMyEvaluations()
      .then((res) => setRows(res.data?.data || []))
      .catch(() => toast.error("تعذر تحميل التقارير"));
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="تقارير التقويم" description="تقارير تقويمك الدورية المعتمدة من المعهد." />
      <Card className="border-none shadow-sm">
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الفترة / نوع التقرير</TableHead>
                <TableHead>ملاحظات</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الملف</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((e) => (
                <TableRow key={e._id}>
                  <TableCell className="text-sm">{evaluationPeriodLabel(e.periodType)}</TableCell>
                  <TableCell className="text-sm text-text-secondary">{e.notes || "—"}</TableCell>
                  <TableCell className="text-sm">{dt(e.createdAt)}</TableCell>
                  <TableCell>
                    {e.fileUrl ? (
                      <a href={e.fileUrl} target="_blank" rel="noreferrer" className="text-brand-600 underline">
                        عرض التقرير
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-text-secondary">لا توجد تقارير بعد.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Evaluations;
