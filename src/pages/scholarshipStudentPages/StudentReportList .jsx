import React from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";
import { ReportsList } from "./ReportsList";

// All of the scholar's submitted reports, searchable and sortable.
const StudentReportList = () => (
  <div className="space-y-6">
    <PageHeader
      title="تقاريري"
      description="جميع التقارير الفصلية التي قدّمتها."
      actions={
        <Link
          to="/student-report"
          className="inline-flex h-10 items-center justify-center rounded-md bg-brand-strong px-4 text-sm font-semibold text-brand-on-strong hover:bg-brand-strong-hover"
        >
          تقرير جديد
        </Link>
      }
    />
    <ReportsList searchable />
  </div>
);

export default StudentReportList;
