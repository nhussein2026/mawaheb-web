import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/DataTable";
import guardianApi from "../../services/api/guardianApi";
import { evaluationPeriodLabel } from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleDateString("ar") : "—");

const GuardianEvaluations = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    guardianApi
      .getEvaluations()
      .then((res) => setRows(res.data?.data || []))
      .catch(() => toast.error("تعذر تحميل التقارير"));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-text-primary">تقارير التقويم</h1>
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

export default GuardianEvaluations;
