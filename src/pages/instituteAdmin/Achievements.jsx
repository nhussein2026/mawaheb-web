import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Trophy, Scale, Save, Hourglass, CheckCircle2, Users, Paperclip } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableStateRow } from "../../components/ui/DataTable";
import StatGrid from "../../components/institute/StatGrid";
import Modal from "../../components/institute/Modal";
import { selectCls, labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import { ACHIEVEMENT_REVIEW_STATUS_OPTIONS, achievementReviewLabel, ACHIEVEMENT_REVIEW_TONE } from "../../constants/institute";

import { formatDateTime } from "../../utils/format";
import { StatusBadge } from "../../components/ui/Badge";
import { EmptyState, Callout } from "../../components/ui/Feedback";
import { useLoadEffect } from "../../hooks/useLoadEffect";
const dt = (d) => formatDateTime(d);

const Achievements = () => {
  const year = useSelector((s) => s.academicYear.selectedYearId);
  const [loadError, setLoadError] = useState("");  const [stats, setStats] = useState({});
  const [rows, setRows] = useState([]);
  const [active, setActive] = useState(null);
  const [verdict, setVerdict] = useState({ reviewStatus: "approved", feedback: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [st, list] = await Promise.all([
        instituteApi.getAchievementStats(year),
        instituteApi.listAchievements({}, year),
      ]);
      setStats(st.data?.data || {});
      setRows(list.data?.data || []);
      setLoadError("");
    } catch {
      setLoadError("تعذّر تحميل الإنجازات");
    }
  }, [year]);

  useLoadEffect(load);

  const openJudge = (ach) => {
    setActive(ach);
    setVerdict({
      reviewStatus: ach.reviewStatus === "pending" ? "approved" : ach.reviewStatus,
      feedback: ach.feedback || "",
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await instituteApi.judgeAchievement(active._id, verdict);
      toast.success("تم حفظ قرار التحكيم");
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
        title="إنجازات الطلاب"
        description="مراجعة الإنجازات المقدمة من الطلاب واعتمادها أو رفضها مع التغذية الراجعة."
      />
      {loadError ? (
        <Callout tone="danger" title={loadError} action={<Button variant="secondary" size="sm" onClick={() => load()}>إعادة المحاولة</Button>}>
          يُرجى التحقق من الاتصال والمحاولة مرة أخرى.
        </Callout>
      ) : null}

      <StatGrid
        stats={[
          { label: "الإنجازات المسجلة", value: stats.recorded ?? 0, icon: Trophy, tone: "brand" },
          { label: "تنتظر التحكيم", value: stats.awaiting ?? 0, icon: Hourglass, tone: "accent" },
          { label: "الإنجازات المقرة", value: stats.approved ?? 0, icon: CheckCircle2, tone: "success" },
          { label: "طلاب سجّلوا إنجازات", value: stats.submittedCount ?? 0, icon: Users, tone: "neutral" },
        ]}
      />

      <Card className="">
        <CardContent className="flex flex-wrap gap-6 py-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">طلاب بلا إنجازات:</span>
            <span className="font-medium text-text-primary">{stats.noneCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary">متوسط الإنجازات لكل طالب:</span>
            <span className="font-medium text-text-primary">{stats.avgPerStudent ?? 0}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="">
        <CardHeader>
          <CardTitle>قائمة الإنجازات المقدمة</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0 sm:px-0 sm:pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان الإنجاز</TableHead>
                <TableHead>تاريخ الرفع</TableHead>
                <TableHead>صاحب السجل</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>خيارات التحكيم</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((ach) => (
                <TableRow key={ach._id}>
                  <TableCell className="font-medium text-text-primary">{ach.title}</TableCell>
                  <TableCell className="text-sm">{dt(ach.createdAt)}</TableCell>
                  <TableCell className="text-sm">{ach.user?.name}</TableCell>
                  <TableCell className="text-xs"><StatusBadge tone={ACHIEVEMENT_REVIEW_TONE[ach.reviewStatus]}>{achievementReviewLabel(ach.reviewStatus)}</StatusBadge></TableCell>
                  <TableCell>
                    <Button variant="tertiary" size="sm" onClick={() => openJudge(ach)}>
                      <Scale className="h-3.5 w-3.5" /> فتح شاشة التحكيم
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableStateRow colSpan={5}>
                  <EmptyState compact kind="first-use" title="لا توجد إنجازات" />
                </TableStateRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {active && (
        <Modal title="شاشة التحكيم" onClose={() => setActive(null)}>
          <div className="space-y-4">
            <div className="rounded-lg bg-neutral-50 p-3">
              <p className="font-medium text-text-primary">{active.title}</p>
              <p className="mt-1 text-xs text-text-muted">
                {active.user?.name} · {dt(active.createdAt)}
              </p>
              {active.description && <p className="mt-2 text-sm text-text-secondary">{active.description}</p>}
              {(active.fileUrl || active.achievement_image) && (
                <a
                  href={active.fileUrl || active.achievement_image}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-brand-600 underline"
                >
                  <Paperclip className="h-3.5 w-3.5" /> استعراض الملف المرفق الداعم
                </a>
              )}
            </div>
            <div>
              <label htmlFor="achievemen-f1" className={labelCls}>حالة الاعتماد والتحكيم<span className="ms-0.5 text-danger-700" aria-hidden="true">*</span></label>
              <select id="achievemen-f1" className={selectCls} value={verdict.reviewStatus} onChange={(e) => setVerdict((v) => ({ ...v, reviewStatus: e.target.value }))}>
                {ACHIEVEMENT_REVIEW_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="achievemen-f2" className={labelCls}>التغذية الراجعة والملاحظات (تظهر للطالب)</label>
              <textarea id="achievemen-f2" className={textareaCls} rows={3} value={verdict.feedback} onChange={(e) => setVerdict((v) => ({ ...v, feedback: e.target.value }))} />
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-border-subtle pt-4">
              <Button variant="secondary" onClick={() => setActive(null)}>إلغاء</Button>
              <Button onClick={save} loading={saving}>
                <Save className="h-4 w-4" /> حفظ قرار التحكيم
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Achievements;
