import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Lightbulb, Scale, Save, Trophy, Hourglass, CheckCircle2, Users } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableStateRow } from "../../components/ui/DataTable";
import StatGrid from "../../components/institute/StatGrid";
import Modal from "../../components/institute/Modal";
import { selectCls, labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import { IDEA_STATUS_OPTIONS, ideaStatusLabel, IDEA_STATUS_TONE } from "../../constants/institute";

import { formatDateTime } from "../../utils/format";
import { StatusBadge } from "../../components/ui/Badge";
import { EmptyState, Callout } from "../../components/ui/Feedback";
import { useLoadEffect } from "../../hooks/useLoadEffect";
const dt = (d) => formatDateTime(d);

const Ideas = () => {
  const year = useSelector((s) => s.academicYear.selectedYearId);
  const [loadError, setLoadError] = useState("");  const [stats, setStats] = useState({});
  const [rows, setRows] = useState([]);
  const [active, setActive] = useState(null);
  const [verdict, setVerdict] = useState({ status: "approved", rewardPoints: 0, notes: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [st, list] = await Promise.all([
        instituteApi.getIdeaStats(year),
        instituteApi.listIdeas({}, year),
      ]);
      setStats(st.data?.data || {});
      setRows(list.data?.data || []);
      setLoadError("");
    } catch {
      setLoadError("تعذّر تحميل الأفكار");
    }
  }, [year]);

  useLoadEffect(load);

  const openJudge = (idea) => {
    setActive(idea);
    setVerdict({
      status: idea.status === "under_study" ? "approved" : idea.status,
      rewardPoints: idea.rewardPoints || 0,
      notes: idea.notes || "",
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await instituteApi.judgeIdea(active._id, verdict);
      toast.success("تم حفظ قرار التحكيم وضخ النقاط");
      setActive(null);
      load();
    } catch {
      toast.error("تعذّر حفظ القرار");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="تحكيم بنك الأفكار"
        description="مراجعة المقترحات الإبداعية للطلاب واعتمادها ومنح النقاط التحفيزية."
      />
      {loadError ? (
        <Callout tone="danger" title={loadError} action={<Button variant="secondary" size="sm" onClick={() => load()}>إعادة المحاولة</Button>}>
          يُرجى التحقق من الاتصال والمحاولة مرة أخرى.
        </Callout>
      ) : null}

      <StatGrid
        stats={[
          { label: "عدد الأفكار المسجلة", value: stats.recorded ?? 0, icon: Lightbulb, tone: "brand" },
          { label: "تنتظر التحكيم", value: stats.awaiting ?? 0, icon: Hourglass, tone: "accent" },
          { label: "الأفكار المجازة", value: stats.approved ?? 0, icon: CheckCircle2, tone: "success" },
          { label: "طلاب سجّلوا أفكاراً", value: stats.submittedCount ?? 0, icon: Users, tone: "neutral" },
        ]}
      />

      {(stats.topScorer || stats.mostIdeas) && (
        <Card className="">
          <CardContent className="flex flex-wrap gap-6 py-4 text-sm">
            {stats.topScorer && (
              <div className="flex items-center gap-2">
                <Trophy className="size-5 text-text-tertiary" aria-hidden="true" />
                <span className="text-text-secondary">الأعلى رصيداً:</span>
                <span className="font-medium text-text-primary">
                  {stats.topScorer.name} ({stats.topScorer.points} نقطة)
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-text-secondary">متوسط الأفكار لكل طالب:</span>
              <span className="font-medium text-text-primary">{stats.avgPerStudent ?? 0}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="">
        <CardHeader>
          <CardTitle>قائمة الأفكار المقترحة</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0 sm:px-0 sm:pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>موضوع الفكرة</TableHead>
                <TableHead>تاريخ الإيداع</TableHead>
                <TableHead>صاحب الفكرة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>خيارات الاعتماد</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((idea) => (
                <TableRow key={idea._id}>
                  <TableCell className="font-medium text-text-primary">{idea.subject}</TableCell>
                  <TableCell className="text-sm">{dt(idea.createdAt)}</TableCell>
                  <TableCell className="text-sm">{idea.student?.name}</TableCell>
                  <TableCell className="text-xs"><StatusBadge tone={IDEA_STATUS_TONE[idea.status]}>{ideaStatusLabel(idea.status)}</StatusBadge></TableCell>
                  <TableCell>
                    <Button variant="tertiary" size="sm" onClick={() => openJudge(idea)}>
                      <Scale className="h-3.5 w-3.5" /> دراسة المقترح
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableStateRow colSpan={5}>
                  <EmptyState compact kind="first-use" title="لا توجد أفكار" />
                </TableStateRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {active && (
        <Modal title={`دراسة المقترح`} onClose={() => setActive(null)}>
          <div className="space-y-4">
            <div className="rounded-lg bg-neutral-50 p-3">
              <p className="font-medium text-text-primary">{active.subject}</p>
              <p className="mt-1 text-xs text-text-muted">
                {active.student?.name} · {dt(active.createdAt)}
              </p>
              {active.description && <p className="mt-2 text-sm text-text-secondary">{active.description}</p>}
            </div>
            <div>
              <label htmlFor="ideasjsx-f1" className={labelCls}>حالة التقييم والاعتماد<span className="ms-0.5 text-danger-700" aria-hidden="true">*</span></label>
              <select id="ideasjsx-f1" className={selectCls} value={verdict.status} onChange={(e) => setVerdict((v) => ({ ...v, status: e.target.value }))}>
                {IDEA_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            {verdict.status === "approved" && (
              <div>
                <label htmlFor="ideasjsx-f2" className={labelCls}>النقاط المكافأة الممنوحة</label>
                <Input id="ideasjsx-f2" type="number" min={0} value={verdict.rewardPoints} onChange={(e) => setVerdict((v) => ({ ...v, rewardPoints: e.target.value }))} dir="ltr" />
              </div>
            )}
            <div>
              <label htmlFor="ideasjsx-f3" className={labelCls}>التوجيه وملاحظات التحكيم (تظهر للطالب)</label>
              <textarea id="ideasjsx-f3" className={textareaCls} rows={3} value={verdict.notes} onChange={(e) => setVerdict((v) => ({ ...v, notes: e.target.value }))} />
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-border-subtle pt-4">
              <Button variant="secondary" onClick={() => setActive(null)}>إلغاء</Button>
              <Button onClick={save} loading={saving}>
                <Save className="h-4 w-4" /> حفظ القرار وضخ النقاط
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Ideas;
