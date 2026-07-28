import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Users, UserCog, ShieldCheck, Wallet, Plus, Search, Pencil, Trash2, RotateCcw } from "lucide-react";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/DataTable";
import StatCard from "../../components/institute/StatCard";
import MemberFormModal from "../../components/institute/MemberFormModal";
import Loading from "../../components/ui/Loading";
import instituteApi from "../../services/api/instituteApi";
import { roleLabel, levelLabel, seatLabel, ACADEMIC_LEVEL_OPTIONS } from "../../constants/institute";

const selectCls =
  "h-9 rounded-md border-[0.5px] border-border-default bg-neutral-50 px-3 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600";

const FilterBtn = ({ value, active, onSelect, children }) => (
  <button
    onClick={() => onSelect(value)}
    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-brand-800 text-brand-50" : "bg-neutral-100 text-text-secondary hover:bg-brand-50"
    }`}
  >
    {children}
  </button>
);

const Members = () => {
  const [stats, setStats] = useState({});
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);

  // filters
  const [group, setGroup] = useState("all"); // all | staff | batch
  const [batch, setBatch] = useState("");
  const [level, setLevel] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadStats = useCallback(async () => {
    try {
      const res = await instituteApi.getMemberStats();
      setStats(res.data?.data || {});
    } catch {
      /* non-fatal */
    }
  }, []);

  const loadBatches = useCallback(async () => {
    try {
      const res = await instituteApi.listBatches();
      setBatches(res.data?.data || []);
    } catch {
      /* non-fatal */
    }
  }, []);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (group === "staff") params.group = "staff";
      if (group === "batch") {
        params.group = "batch";
        if (batch) params.batch = batch;
        if (level) params.level = level;
      }
      if (search) params.search = search;
      const res = await instituteApi.listMembers(params);
      setMembers(res.data?.data || []);
      setPages(res.data?.pages || 1);
    } catch {
      toast.error("تعذر تحميل الأعضاء");
    } finally {
      setLoading(false);
    }
  }, [group, batch, level, search, page]);

  useEffect(() => { loadStats(); loadBatches(); }, [loadStats, loadBatches]);
  useEffect(() => { loadMembers(); }, [loadMembers]);

  const resetFilters = () => {
    setGroup("all"); setBatch(""); setLevel(""); setSearch(""); setSearchInput(""); setPage(1);
  };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = async (id) => {
    try {
      const res = await instituteApi.getMember(id);
      setEditing(res.data?.data || null);
      setModalOpen(true);
    } catch {
      toast.error("تعذر جلب بيانات العضو");
    }
  };

  const removeMember = async (m) => {
    if (!window.confirm(`حذف العضو «${m.name}»؟`)) return;
    try {
      await instituteApi.deleteMember(m._id);
      toast.success("تم حذف العضو");
      loadMembers(); loadStats();
    } catch {
      toast.error("تعذر حذف العضو");
    }
  };

  const onSaved = () => { setModalOpen(false); loadMembers(); loadStats(); loadBatches(); };

  const selectGroup = (value) => { setGroup(value); setPage(1); };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="إدارة الأعضاء والمدربين"
        description="إدارة كافة المستخدمين — المشرفين والمدربين والطلاب."
        actions={<Button onClick={openCreate}><Plus className="ml-1.5 h-4 w-4" /> إضافة عضو جديد</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="الطلاب المسجلين" value={stats.registeredStudents ?? 0} icon={Users} tone="brand" />
        <StatCard label="المشرفين العامين والمسارات" value={stats.supervisors ?? 0} icon={ShieldCheck} tone="accent" />
        <StatCard label="المدربين والأساتذة" value={stats.trainers ?? 0} icon={UserCog} tone="neutral" />
        <StatCard label="طلاب المقاعد المدفوعة" value={stats.paidSeats ?? 0} icon={Wallet} tone="success" />
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="space-y-4 p-5">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <FilterBtn value="all" active={group === "all"} onSelect={selectGroup}>🌐 كل الأعضاء</FilterBtn>
            <FilterBtn value="staff" active={group === "staff"} onSelect={selectGroup}>💼 المشرفين والمدربين</FilterBtn>
            <FilterBtn value="batch" active={group === "batch"} onSelect={selectGroup}>🎓 الطلاب حسب الدفعة</FilterBtn>

            {group === "batch" && (
              <>
                <select className={selectCls} value={batch} onChange={(e) => { setBatch(e.target.value); setPage(1); }}>
                  <option value="">كل الدفعات</option>
                  {batches.map((b) => <option key={b} value={b}>الدفعة {b}</option>)}
                </select>
                <select className={selectCls} value={level} onChange={(e) => { setLevel(e.target.value); setPage(1); }}>
                  <option value="">كل المستويات</option>
                  {ACADEMIC_LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </>
            )}

            <button onClick={resetFilters} className="flex items-center gap-1 rounded-lg bg-neutral-100 px-3 py-1.5 text-sm text-text-secondary hover:bg-brand-50">
              <RotateCcw className="h-3.5 w-3.5" /> إعادة الضبط
            </button>

            <form
              onSubmit={(e) => { e.preventDefault(); setSearch(searchInput.trim()); setPage(1); }}
              className="relative ms-auto"
            >
              <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-neutral-500" />
              <Input
                className="w-56 ps-9"
                placeholder="بحث بالاسم أو البريد…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
          </div>

          {/* Table */}
          {loading ? (
            <Loading variant="inline" message="جارٍ تحميل الأعضاء…" />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الرقم الأكاديمي</TableHead>
                    <TableHead>الاسم الكامل</TableHead>
                    <TableHead>اسم المستخدم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>رقم الجوال</TableHead>
                    <TableHead>الرتبة</TableHead>
                    <TableHead>تفاصيل إضافية</TableHead>
                    <TableHead>العمليات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center text-text-secondary">لا يوجد أعضاء مطابقون</TableCell></TableRow>
                  ) : members.map((m) => {
                    const p = m.studentProfile;
                    return (
                      <TableRow key={m._id}>
                        <TableCell>{p?.academicNumber || "—"}</TableCell>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell>{m.username || "—"}</TableCell>
                        <TableCell className="text-text-secondary">{m.email}</TableCell>
                        <TableCell>{m.phone_number || "—"}</TableCell>
                        <TableCell>
                          <span className="whitespace-nowrap rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                            {roleLabel(m.instituteRole)}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-text-secondary">
                          {m.instituteRole === "student"
                            ? [p?.batch ? `دفعة ${p.batch}` : null, p?.level ? levelLabel(p.level) : null, p?.seatType ? seatLabel(p.seatType) : null].filter(Boolean).join(" · ") || "—"
                            : m.full_name_en || m.bio || "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <button onClick={() => openEdit(m._id)} className="rounded-md p-1.5 text-brand-600 hover:bg-brand-50" title="تعديل"><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => removeMember(m)} className="rounded-md p-1.5 text-error-text hover:bg-error-bg" title="حذف"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-text-secondary">صفحة {page} من {pages}</span>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>السابق</Button>
                  <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>التالي</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {modalOpen && (
        <MemberFormModal
          member={editing}
          onClose={() => setModalOpen(false)}
          onSaved={onSaved}
        />
      )}
    </div>
  );
};

export default Members;
