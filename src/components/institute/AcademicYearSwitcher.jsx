import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CalendarDays } from "lucide-react";
import instituteApi from "../../services/api/instituteApi";
import { setYears, setSelectedYear } from "../../features/institute/academicYearSlice";

// Global academic-year scope selector shown in the portal header.
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
    <label className="flex items-center gap-2 rounded-md border-[0.5px] border-brand-700/80 bg-brand-800/50 px-2.5 py-1.5">
      <CalendarDays className="h-4 w-4 shrink-0 text-accent-400" aria-hidden="true" />
      <span className="sr-only">العام الدراسي المعروض حالياً</span>
      <select
        value={selectedYearId || ""}
        onChange={(e) => dispatch(setSelectedYear(e.target.value))}
        className="max-w-[190px] cursor-pointer bg-transparent text-[13px] font-medium text-text-inverse focus:outline-none"
      >
        {years.map((y) => (
          <option key={y._id} value={y._id} className="text-text-primary">
            {y.name} {y.isActive ? "(النشط)" : ""}
          </option>
        ))}
        <option value="all" className="text-text-primary">
          📊 جميع الأعوام (تراكمي)
        </option>
      </select>
    </label>
  );
};

export default AcademicYearSwitcher;
