import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CalendarDays } from "lucide-react";
import instituteApi from "../../services/api/instituteApi";
import { setYears, setSelectedYear } from "../../features/institute/academicYearSlice";

// Global academic-year scope selector shown in the portal top bar.
// Loads the year list once, then drives the `academicYear` Redux scope that
// every institute data call reads.
const AcademicYearSwitcher = () => {
  const dispatch = useDispatch();
  const { years, selectedYearId, loaded } = useSelector((s) => s.academicYear);

  useEffect(() => {
    if (loaded) return;
    let active = true;
    instituteApi
      .listYears()
      .then((res) => {
        if (active) dispatch(setYears(res.data?.data || []));
      })
      .catch(() => {
        if (active) dispatch(setYears([]));
      });
    return () => {
      active = false;
    };
  }, [loaded, dispatch]);

  return (
    <label className="flex h-9 items-center gap-2 rounded-md border border-border-control bg-surface ps-2.5 hover:border-neutral-600">
      <CalendarDays className="size-4 shrink-0 text-text-tertiary" aria-hidden="true" />
      <span className="sr-only">العام الدراسي المعروض</span>
      <select
        value={selectedYearId || ""}
        onChange={(e) => dispatch(setSelectedYear(e.target.value))}
        className="num h-full max-w-[44vw] cursor-pointer bg-transparent pe-2 text-sm font-semibold text-text-primary outline-none sm:max-w-[200px]"
      >
        {years.map((y) => (
          <option key={y._id} value={y._id}>
            {y.name} {y.isActive ? "(النشط)" : ""}
          </option>
        ))}
        <option value="all">جميع الأعوام (تراكمي)</option>
      </select>
    </label>
  );
};

export default AcademicYearSwitcher;
