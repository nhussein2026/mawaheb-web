import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Lightbulb, Scale, Save, Trophy, Hourglass, CheckCircle2, Users } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/DataTable";
import StatGrid from "../../components/institute/StatGrid";
import Modal from "../../components/institute/Modal";
import { selectCls, labelCls, textareaCls } from "../../components/institute/formStyles";
import instituteApi from "../../services/api/instituteApi";
import { IDEA_STATUS_OPTIONS, ideaStatusLabel } from "../../constants/institute";

const dt = (d) => (d ? new Date(d).toLocaleString("ar") : "—");

const Ideas = () => {
  const year = useSelector((s) => s.academicYear.selectedYearId);
  const [stats, setStats] = useState({});
  const [rows, setRows] = useState([]);
  const [active, setActive] = useState(null);
  const [verdict, setVerdict] = useState({ status: "approved", rewardPoints: 0, notes: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [st, list] = await Promise.all([
        instituteApi.getIdeaStats(year),
        instituteApi.listIdeas({}, year),
      ]);
      setStats(st.data?.data || {});
      setRows(list.data?.data || []);
    } catch {
      toast.error("تعذر تحميل الأفكار");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

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
      toast.error("تعذر حفظ القرار");
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

      <StatGrid
        stats={[
          { label: "عدد الأفكار المسجلة", value: stats.recorded ?? 0, icon: Lightbulb, tone: "brand" },
          { label: "تنتظر التحكيم", value: stats.awaiting ?? 0, icon: Hourglass, tone: "accent" },
          { label: "الأفكار المجازة", value: stats.approved ?? 0, icon: CheckCircle2, tone: "success" },
          { label: "طلاب سجّلوا أفكاراً", value: stats.submittedCount ?? 0, icon: Users, tone: "neutral" },
        ]}
      />

      {(stats.topScorer || stats.mostIdeas) && (
        <Card className="border-none shadow-sm">
          <CardContent className="flex flex-wrap gap-6 py-4 text-sm">
            {stats.topScorer && (
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-accent-600" />
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

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">قائمة الأفكار المقترحة</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
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
                  <TableCell className="font-medium text-text-primary">💡 {idea.subject}</TableCell>
                  <TableCell className="text-sm">{dt(idea.createdAt)}</TableCell>
                  <TableCell className="text-sm">{idea.student?.name}</TableCell>
                  <TableCell className="text-xs">{ideaStatusLabel(idea.status)}</TableCell>
                  <TableCell>
                    <button onClick={() => openJudge(idea)} className="inline-flex items-center gap-1 rounded bg-brand-50 px-2 py-1 text-xs text-brand-700 hover:bg-brand-100">
                      <Scale className="h-3.5 w-3.5" /> دراسة المقترح
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-text-secondary">لا توجد أفكار.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {active && (
        <Modal title={`⚖️ دراسة المقترح`} onClose={() => setActive(null)}>
          <div className="space-y-4">
            <div className="rounded-lg bg-neutral-50 p-3">
              <p className="font-medium text-text-primary">💡 {active.subject}</p>
              <p className="mt-1 text-xs text-text-muted">
                {active.student?.name} · {dt(active.createdAt)}
              </p>
              {active.description && <p className="mt-2 text-sm text-text-secondary">{active.description}</p>}
            </div>
            <div>
              <label className={labelCls}>حالة التقييم والاعتماد *</label>
              <select className={selectCls} value={verdict.status} onChange={(e) => setVerdict((v) => ({ ...v, status: e.target.value }))}>
                {IDEA_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            {verdict.status === "approved" && (
              <div>
                <label className={labelCls}>النقاط المكافأة الممنوحة</label>
                <Input type="number" min={0} value={verdict.rewardPoints} onChange={(e) => setVerdict((v) => ({ ...v, rewardPoints: e.target.value }))} dir="ltr" />
              </div>
            )}
            <div>
              <label className={labelCls}>التوجيه وملاحظات التحكيم (تظهر للطالب)</label>
              <textarea className={textareaCls} rows={3} value={verdict.notes} onChange={(e) => setVerdict((v) => ({ ...v, notes: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <Button onClick={save} disabled={saving}>
                <Save className="h-4 w-4" /> حفظ القرار وضخ النقاط
              </Button>
              <Button variant="outline" onClick={() => setActive(null)}>إلغاء</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Ideas;
