import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/DataTable";
import instituteApi from "../../services/api/instituteApi";
import {
  resultTermLabel,
  resultExamTypeLabel,
  RESULT_CLASSIFICATION_LABELS,
} from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleDateString("ar") : "—");

const Results = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    instituteApi
      .getMyResults()
      .then((res) => setRows(res.data?.data || []))
      .catch(() => toast.error("تعذر تحميل النتائج"));
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="النتائج الدراسية" description="كشوف درجاتك المعتمدة من إدارة المعهد." />
      <Card className="border-none shadow-sm">
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الفصل الدراسي</TableHead>
                <TableHead>نوع الاختبار</TableHead>
                <TableHead>التصنيف</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>كشف الدرجات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="text-sm">{resultTermLabel(r.term)}</TableCell>
                  <TableCell className="text-sm">{resultExamTypeLabel(r.examType)}</TableCell>
                  <TableCell className="text-xs">{RESULT_CLASSIFICATION_LABELS[r.classification] || "—"}</TableCell>
                  <TableCell className="text-sm">{dt(r.createdAt)}</TableCell>
                  <TableCell>
                    {r.imageUrl ? (
                      <a href={r.imageUrl} target="_blank" rel="noreferrer" className="text-brand-600 underline">
                        عرض الكشف
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-text-secondary">لا توجد نتائج بعد.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
