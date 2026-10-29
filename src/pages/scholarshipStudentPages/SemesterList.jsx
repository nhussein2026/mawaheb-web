import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, ChevronDown } from "lucide-react";
import SemesterForm from "./SemesterForm";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button, IconButton } from "../../components/ui/Button";
import { Chip } from "../../components/ui/Badge";
import { Dialog } from "../../components/ui/Dialog";
import { EmptyState, SkeletonRows } from "../../components/ui/Feedback";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/DataTable";
import { useConfirm } from "../../components/ui/confirmContext";
import { useResource } from "../../hooks/useResource";
import { API_BASE_URL } from "../../services/api/config";
import { cn } from "../../utils/cn";

// A GPA that was never saved shows "—", not a misleading 0.0 (API report M3).
const gpa = (v) => (v === undefined || v === null || v === "" ? "—" : Number(v).toFixed(2));

// The scholar's academic record: one expandable card per semester with its
// courses and result sheet. Add and edit open the semester form in a dialog.
export default function SemestersList() {
  const token = useSelector((state) => state.auth.token);
  const confirm = useConfirm();
  const [editing, setEditing] = useState(null); // null | "new" | semester
  const [expanded, setExpanded] = useState({});
  const [viewing, setViewing] = useState(null);

  const api = useMemo(() => axios.create({ baseURL: API_BASE_URL, headers: { Authorization: `Bearer ${token}` } }), [token]);
  const { data, status, reload } = useResource(() => api.get("/semester/all"), [api], {
    initial: [],
    select: (res) => (Array.isArray(res?.data) ? res.data : []),
  });
  const semesters = useMemo(() => [...data].sort((a, b) => a.semesterNumber - b.semesterNumber), [data]);

  // Errors propagate to the form, which shows them in place.
  const handleSave = async (form) => {
    if (editing?._id) await api.put(`/semester/${editing._id}`, form);
    else await api.post("/semester", form);
    toast.success(editing?._id ? "تم حفظ التغييرات" : "تمت إضافة الفصل الدراسي");
    setEditing(null);
    reload();
  };

  const remove = async (s) => {
    const ok = await confirm({
      title: `حذف الفصل ${s.semesterNumber}؟`,
      body: "سيُحذف الفصل ومقرراته نهائيًا ولا يمكن استرجاعها.",
      confirmLabel: "حذف الفصل",
      destructive: true,
    });
    if (!ok) return;
    try {
      await api.delete(`/semester/${s._id}`);
      toast.success("تم حذف الفصل");
      reload();
    } catch {
      toast.error("تعذّر حذف الفصل. يُرجى المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="السجل الأكاديمي"
        description="فصولك الدراسية ومعدلاتك ومقرراتها."
        actions={
          <Button onClick={() => setEditing("new")}>
            <Plus aria-hidden="true" /> إضافة فصل دراسي
          </Button>
        }
      />

      {status === "loading" ? (
        <Card>
          <SkeletonRows rows={4} />
        </Card>
      ) : status === "failed" ? (
        <Card>
          <EmptyState kind="failed" title="تعذّر تحميل الفصول الدراسية" onRetry={reload} />
        </Card>
      ) : semesters.length === 0 ? (
        <Card>
          <EmptyState
            kind="first-use"
            title="لم تُضف فصولًا دراسية بعد"
            description="أضف كل فصل مع معدلاته ومقرراته ليظهر في سجلك الأكاديمي."
            action={<Button onClick={() => setEditing("new")}>إضافة أول فصل</Button>}
          />
        </Card>
      ) : (
        <ul className="space-y-3">
          {semesters.map((s) => {
            const open = Boolean(expanded[s._id]);
            return (
              <li key={s._id}>
                <Card>
                  <div className="flex items-center gap-2 px-4 py-3 sm:px-6">
                    <button
                      type="button"
                      onClick={() => setExpanded((e) => ({ ...e, [s._id]: !open }))}
                      aria-expanded={open}
                      aria-controls={`sem-panel-${s._id}`}
                      className="flex min-h-12 min-w-0 flex-1 items-center gap-3 text-start"
                    >
                      <span className="num grid size-11 shrink-0 place-items-center rounded-lg bg-brand-subtle font-display text-lg font-bold text-brand-text">
                        {s.semesterNumber}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-heading-4 text-text-primary">الفصل الدراسي {s.semesterNumber}</span>
                        <span className="mt-1 flex flex-wrap gap-2">
                          <Chip className="num">الفصلي {gpa(s.semesterGPA)} / 4.00</Chip>
                          <Chip className="num">التراكمي {gpa(s.totalGpa ?? s.totalGPA)} / 4.00</Chip>
                        </span>
                      </span>
                      <ChevronDown
                        className={cn("ms-auto size-5 shrink-0 text-text-tertiary transition-transform", open && "rotate-180")}
                        aria-hidden="true"
                      />
                    </button>
                    <IconButton label={`تعديل الفصل ${s.semesterNumber}`} size="sm" onClick={() => setEditing(s)}>
                      <Pencil />
                    </IconButton>
                    <IconButton label={`حذف الفصل ${s.semesterNumber}`} size="sm" tone="danger" onClick={() => remove(s)}>
                      <Trash2 />
                    </IconButton>
                  </div>
                  {open ? (
                    <div id={`sem-panel-${s._id}`} className="space-y-4 border-t border-border-subtle pb-4">
                      {s.courses?.length ? (
                        <Table caption={`مواد الفصل ${s.semesterNumber}`}>
                          <TableHeader>
                            <TableRow>
                              <TableHead>كود المادة</TableHead>
                              <TableHead>اسم المادة</TableHead>
                              <TableHead numeric>الدرجة</TableHead>
                              <TableHead>التقدير</TableHead>
                              <TableHead numeric>الساعات</TableHead>
                              <TableHead numeric>ECTS</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {s.courses.map((c, i) => (
                              <TableRow key={`${c.courseCode}-${i}`}>
                                <TableCell className="font-semibold">
                                  <bdi>{c.courseCode}</bdi>
                                </TableCell>
                                <TableCell dir="auto">{c.courseName}</TableCell>
                                <TableCell numeric>{c.grade ?? "—"}</TableCell>
                                <TableCell>
                                  <bdi>{c.lg}</bdi>
                                </TableCell>
                                <TableCell numeric>{c.credits ?? "—"}</TableCell>
                                <TableCell numeric>{c.ects ?? "—"}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="px-4 pt-4 text-sm text-text-secondary sm:px-6">لا توجد مواد مسجلة لهذا الفصل.</p>
                      )}
                      {s.resultImage ? (
                        <div className="px-4 sm:px-6">
                          <p className="mb-2 text-label-md text-text-primary">كشف النتيجة</p>
                          <button
                            type="button"
                            onClick={() => setViewing(s)}
                            className="block overflow-hidden rounded-md border border-border-default"
                            aria-label={`عرض كشف نتيجة الفصل ${s.semesterNumber}`}
                          >
                            <img src={s.resultImage} alt="" className="h-32 w-48 object-cover" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      {editing ? (
        <SemesterForm initialData={editing === "new" ? null : editing} onSave={handleSave} onCancel={() => setEditing(null)} />
      ) : null}

      <Dialog open={Boolean(viewing)} onClose={() => setViewing(null)} title={viewing ? `كشف نتيجة الفصل ${viewing.semesterNumber}` : ""} size="xl">
        {viewing ? <img src={viewing.resultImage} alt="" className="mx-auto max-h-[70vh] w-auto rounded-lg" /> : null}
      </Dialog>
    </div>
  );
}
