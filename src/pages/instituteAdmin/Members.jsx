import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button, IconButton } from "../../components/ui/Button";
import { Select } from "../../components/ui/Input";
import { SearchInput } from "../../components/ui/SearchInput";
import { Tabs } from "../../components/ui/Tabs";
import { Pagination } from "../../components/ui/Pagination";
import { PersonCell } from "../../components/ui/PersonCell";
import { StatusBadge } from "../../components/ui/Badge";
import { EmptyState, SkeletonRows } from "../../components/ui/Feedback";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableStateRow } from "../../components/ui/DataTable";
import StatGrid from "../../components/institute/StatGrid";
import MemberFormModal from "../../components/institute/MemberFormModal";
import instituteApi from "../../services/api/instituteApi";
import { roleLabel, levelLabel, seatLabel, ACADEMIC_LEVEL_OPTIONS } from "../../constants/institute";
import { useConfirm } from "../../components/ui/confirmContext";

import { useLoadEffect } from "../../hooks/useLoadEffect";
const SEGMENTS = [
  { value: "all", label: "كل الأعضاء" },
  { value: "staff", label: "المشرفون والمدربون" },
  { value: "batch", label: "الطلاب حسب الدفعة" },
];

const studentDetails = (p) =>
  [p?.batch ? `الدفعة ${p.batch}` : null, p?.level ? levelLabel(p.level) : null, p?.seatType ? seatLabel(p.seatType) : null]
    .filter(Boolean)
    .join(" · ");

const Members = () => {
  const confirm = useConfirm();
  const [stats, setStats] = useState({});
  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [batches, setBatches] = useState([]);

  const [group, setGroup] = useState("all");
  const [batch, setBatch] = useState("");
  const [level, setLevel] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadStats = useCallback(async () => {
    try {
      const res = await instituteApi.getMemberStats();
      setStats(res.data?.data || {});
    } catch {
      /* tiles keep their last values */
    }
  }, []);

  const loadBatches = useCallback(async () => {
    try {
      const res = await instituteApi.listBatches();
      setBatches(res.data?.data || []);
    } catch {
      /* batch filter stays empty */
    }
  }, []);

  const loadMembers = useCallback(async () => {
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
      setTotal(res.data?.total ?? null);
      setStatus("ready");
    } catch {
      setStatus("failed");
    }
  }, [group, batch, level, search, page]);

  useLoadEffect(loadStats, loadBatches);
  useLoadEffect(loadMembers);

  const filtersActive = group !== "all" || batch || level || search;
  const resetFilters = () => {
    setGroup("all");
    setBatch("");
    setLevel("");
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = async (id) => {
    try {
      const res = await instituteApi.getMember(id);
      setEditing(res.data?.data || null);
      setModalOpen(true);
    } catch {
      toast.error("تعذّر فتح بيانات العضو. يُرجى المحاولة مرة أخرى.");
    }
  };

  const removeMember = async (m) => {
    if (!(await confirm({ title: `حذف العضو «${m.name}»؟`, body: "سيُحذف حساب العضو ولن يتمكن من الدخول إلى البوابة.", confirmLabel: "حذف العضو", destructive: true }))) return;
    try {
      await instituteApi.deleteMember(m._id);
      toast.success("تم حذف العضو");
      loadMembers();
      loadStats();
    } catch {
      toast.error("تعذّر حذف العضو. يُرجى المحاولة مرة أخرى.");
    }
  };

  const onSaved = () => {
    setModalOpen(false);
    loadMembers();
    loadStats();
    loadBatches();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="الأعضاء والمدربون"
        description="المشرفون والمدربون والطلاب المسجلون في المعهد"
        actions={
          <Button onClick={openCreate}>
            <Plus aria-hidden="true" /> إضافة عضو
          </Button>
        }
      />

      <StatGrid
        stats={[
          { label: "الطلاب المسجلون", value: stats.registeredStudents ?? 0 },
          { label: "المشرفون", value: stats.supervisors ?? 0 },
          { label: "المدربون", value: stats.trainers ?? 0 },
          { label: "طلاب المقاعد المدفوعة", value: stats.paidSeats ?? 0 },
        ]}
      />

      <Card>
        <Tabs
          label="تصنيف الأعضاء"
          items={SEGMENTS}
          value={group}
          onChange={(v) => {
            setGroup(v);
            setPage(1);
          }}
          className="px-2 sm:px-4"
        />
        <div className="flex flex-wrap items-center gap-2 border-b border-border-default px-4 py-3 sm:px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearch(searchInput.trim());
              setPage(1);
            }}
            className="w-full sm:w-72"
          >
            <SearchInput
              label="بحث في الأعضاء"
              placeholder="بحث بالاسم أو البريد…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onClear={() => {
                setSearch("");
                setPage(1);
              }}
            />
          </form>
          {group === "batch" ? (
            <>
              <Select
                aria-label="الدفعة"
                className="w-auto min-w-36"
                value={batch}
                onChange={(e) => {
                  setBatch(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">كل الدفعات</option>
                {batches.map((b) => (
                  <option key={b} value={b}>
                    الدفعة {b}
                  </option>
                ))}
              </Select>
              <Select
                aria-label="المستوى"
                className="w-auto min-w-44"
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">كل المستويات</option>
                {ACADEMIC_LEVEL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </>
          ) : null}
          {filtersActive ? (
            <Button variant="tertiary" size="sm" onClick={resetFilters}>
              مسح الفلاتر
            </Button>
          ) : null}
        </div>

        <Table caption="الأعضاء" cards>
          <TableHeader>
            <TableRow>
              <TableHead>العضو</TableHead>
              <TableHead>الرقم الأكاديمي</TableHead>
              <TableHead>اسم المستخدم</TableHead>
              <TableHead>الجوال</TableHead>
              <TableHead>الرتبة</TableHead>
              <TableHead>تفاصيل</TableHead>
              <TableHead>
                <span className="sr-only">إجراءات</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {status === "loading" ? (
              <TableStateRow colSpan={7}>
                <SkeletonRows rows={6} />
              </TableStateRow>
            ) : status === "failed" ? (
              <TableStateRow colSpan={7}>
                <EmptyState kind="failed" title="تعذّر تحميل الأعضاء" onRetry={loadMembers} compact />
              </TableStateRow>
            ) : members.length === 0 ? (
              <TableStateRow colSpan={7}>
                {filtersActive ? (
                  <EmptyState
                    kind="no-results"
                    compact
                    title={search ? `لا توجد نتائج لـ «${search}» مع الفلاتر الحالية` : "لا يوجد أعضاء مطابقون للفلاتر الحالية"}
                    action={
                      <Button variant="secondary" onClick={resetFilters}>
                        مسح الفلاتر
                      </Button>
                    }
                  />
                ) : (
                  <EmptyState
                    kind="first-use"
                    compact
                    title="لا يوجد أعضاء بعد"
                    description="أضف المشرفين والمدربين والطلاب لبدء العمل في البوابة."
                    action={<Button onClick={openCreate}>إضافة أول عضو</Button>}
                  />
                )}
              </TableStateRow>
            ) : (
              members.map((m) => {
                const p = m.studentProfile;
                return (
                  <TableRow key={m._id}>
                    <TableCell className="min-w-56">
                      <PersonCell name={m.name} secondary={m.email} secondaryLtr src={m.imageUrl} />
                    </TableCell>
                    <TableCell label="الرقم الأكاديمي" className="num">{p?.academicNumber || "—"}</TableCell>
                    <TableCell label="اسم المستخدم">
                      <bdi>{m.username || "—"}</bdi>
                    </TableCell>
                    <TableCell label="الجوال" className="num">
                      <bdi>{m.phone_number || "—"}</bdi>
                    </TableCell>
                    <TableCell label="الرتبة">
                      <StatusBadge tone={m.instituteRole === "student" ? "neutral" : "info"}>{roleLabel(m.instituteRole)}</StatusBadge>
                    </TableCell>
                    <TableCell label="تفاصيل" className="text-text-secondary">
                      {m.instituteRole === "student" ? studentDetails(p) || "—" : m.full_name_en || m.bio || "—"}
                    </TableCell>
                    <TableCell className="w-24">
                      <div className="flex justify-end gap-1">
                        <IconButton label={`تعديل ${m.name}`} size="sm" onClick={() => openEdit(m._id)}>
                          <Pencil />
                        </IconButton>
                        <IconButton label={`حذف ${m.name}`} size="sm" tone="danger" onClick={() => removeMember(m)}>
                          <Trash2 />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <Pagination page={page} pages={pages} total={total} pageSize={10} onChange={setPage} />
      </Card>

      {modalOpen ? <MemberFormModal member={editing} onClose={() => setModalOpen(false)} onSaved={onSaved} /> : null}
    </div>
  );
};

export default Members;
