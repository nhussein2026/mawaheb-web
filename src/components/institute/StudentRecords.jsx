import React from "react";
import { ExternalLink } from "lucide-react";
import { PageHeader } from "../ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { StatusBadge } from "../ui/Badge";
import { EmptyState, SkeletonRows } from "../ui/Feedback";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableStateRow } from "../ui/DataTable";
import { useResource } from "../../hooks/useResource";
import {
  resultTermLabel,
  resultExamTypeLabel,
  RESULT_CLASSIFICATION_LABELS,
  evaluationPeriodLabel,
  behaviorTypeLabel,
  BEHAVIOR_TYPE_TONE,
} from "../../constants/institute";
import { formatDate, formatDateTime, formatNumber } from "../../utils/format";

// Read-only views of one student's records, shared by the institute student
// portal and the guardian portal. Each takes the loader for its endpoint.

const FileLink = ({ href, children }) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-semibold text-brand-strong underline underline-offset-4"
    >
      {children}
      <ExternalLink className="icon-dir size-4" aria-hidden="true" />
      <span className="sr-only">(يفتح في نافذة جديدة)</span>
    </a>
  ) : (
    <span className="text-text-tertiary">—</span>
  );

function TableStates({ status, colSpan, empty, onRetry, failed }) {
  if (status === "loading")
    return (
      <TableStateRow colSpan={colSpan}>
        <SkeletonRows rows={4} />
      </TableStateRow>
    );
  if (status === "failed")
    return (
      <TableStateRow colSpan={colSpan}>
        <EmptyState kind="failed" compact title={failed} onRetry={onRetry} />
      </TableStateRow>
    );
  return (
    <TableStateRow colSpan={colSpan}>
      <EmptyState kind="first-use" compact title={empty} />
    </TableStateRow>
  );
}

export function ResultsView({ load, title = "النتائج الدراسية", description }) {
  const { data, status, reload } = useResource(load, [], { initial: [] });
  const rows = status === "ready" ? data : [];
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <Card>
        <Table caption={title}>
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
            {rows.length ? (
              rows.map((r) => (
                <TableRow key={r._id}>
                  <TableCell>{resultTermLabel(r.term)}</TableCell>
                  <TableCell>{resultExamTypeLabel(r.examType)}</TableCell>
                  <TableCell>{RESULT_CLASSIFICATION_LABELS[r.classification] || "—"}</TableCell>
                  <TableCell className="num">{formatDate(r.createdAt)}</TableCell>
                  <TableCell>
                    <FileLink href={r.imageUrl}>عرض الكشف</FileLink>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableStates status={status} colSpan={5} empty="لا توجد نتائج بعد" failed="تعذّر تحميل النتائج" onRetry={reload} />
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export function EvaluationsView({ load, title = "تقارير التقويم", description }) {
  const { data, status, reload } = useResource(load, [], { initial: [] });
  const rows = status === "ready" ? data : [];
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <Card>
        <Table caption={title}>
          <TableHeader>
            <TableRow>
              <TableHead>الفترة</TableHead>
              <TableHead>ملاحظات</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الملف</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((e) => (
                <TableRow key={e._id}>
                  <TableCell>{evaluationPeriodLabel(e.periodType)}</TableCell>
                  <TableCell dir="auto" className="text-text-secondary">
                    {e.notes || "—"}
                  </TableCell>
                  <TableCell className="num">{formatDate(e.createdAt)}</TableCell>
                  <TableCell>
                    <FileLink href={e.fileUrl}>عرض التقرير</FileLink>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableStates status={status} colSpan={4} empty="لا توجد تقارير بعد" failed="تعذّر تحميل التقارير" onRetry={reload} />
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export function BehaviorView({ load, title = "السجل السلوكي", description, showAttachments = true }) {
  const { data, status, reload } = useResource(load, [], { initial: [] });
  const rows = status === "ready" ? data : [];
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <Card>
        {status === "loading" ? (
          <SkeletonRows rows={4} />
        ) : status === "failed" ? (
          <EmptyState kind="failed" title="تعذّر تحميل السجل السلوكي" onRetry={reload} />
        ) : rows.length === 0 ? (
          <EmptyState kind="first-use" title="لا توجد سجلات سلوكية" />
        ) : (
          <ul className="divide-y divide-border-subtle">
            {rows.map((en) => (
              <li key={en._id} className="px-4 py-4 sm:px-6">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={BEHAVIOR_TYPE_TONE[en.type]}>{behaviorTypeLabel(en.type)}</StatusBadge>
                  <span dir="auto" className="font-semibold text-text-primary">
                    {en.title}
                  </span>
                </div>
                {en.description ? (
                  <p dir="auto" className="reading mt-1 text-sm text-text-secondary">
                    {en.description}
                  </p>
                ) : null}
                <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-text-tertiary">
                  <span className="num">{formatDateTime(en.createdAt)}</span>
                  {showAttachments && en.attachmentUrl ? <FileLink href={en.attachmentUrl}>المرفق</FileLink> : null}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export function FeesView({ load, title = "الرسوم والأقساط", description }) {
  const { data, status, reload } = useResource(load, [], { initial: { fees: [], installments: [] } });
  const fees = data?.fees || [];
  const installments = data?.installments || [];
  const forFee = (feeId) =>
    installments.filter((i) => String(i.fee) === String(feeId)).sort((a, b) => a.seq - b.seq);
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      {status === "loading" ? (
        <Card>
          <SkeletonRows rows={3} />
        </Card>
      ) : status === "failed" ? (
        <Card>
          <EmptyState kind="failed" title="تعذّر تحميل الرسوم" onRetry={reload} />
        </Card>
      ) : fees.length === 0 ? (
        <Card>
          <EmptyState kind="all-done" title="لا توجد رسوم مستحقة" />
        </Card>
      ) : (
        fees.map((f) => (
          <Card key={f._id}>
            <CardHeader
              actions={
                <p className="text-sm text-text-secondary">
                  الإجمالي السنوي{" "}
                  <span className="num font-display text-xl font-bold text-text-primary">{formatNumber(f.totalAnnual ?? 0)}</span>
                </p>
              }
            >
              <CardTitle>الرسوم السنوية</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {forFee(f._id).map((i) => (
                  <li key={i._id} className="rounded-lg border border-border-default p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-text-primary">
                        القسط <span className="num">{i.seq}</span>
                      </span>
                      <StatusBadge tone={i.isPaid ? "success" : "warning"}>{i.isPaid ? "مدفوع" : "غير مدفوع"}</StatusBadge>
                    </div>
                    <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 text-sm">
                      <dt className="text-text-tertiary">المبلغ</dt>
                      <dd className="num text-text-primary">{formatNumber(i.amount ?? 0)}</dd>
                      <dt className="text-text-tertiary">الاستحقاق</dt>
                      <dd className="num text-text-primary">{formatDate(i.dueDate)}</dd>
                    </dl>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
