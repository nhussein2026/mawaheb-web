import React, { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import StudentReportForm from "./StudentReport";
import { ReportsList } from "./ReportsList";

// Term reports: start a new report (the page's one primary action) and
// browse the ones already submitted.
const StudentReportPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const openForm = () => {
    setShowForm(true);
    requestAnimationFrame(() => document.getElementById("rep-title")?.focus());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="التقارير الفصلية"
        description="قدّم تقريرك الدوري وتابع تقاريرك السابقة."
        actions={
          !showForm ? (
            <Button onClick={openForm}>
              <Plus aria-hidden="true" /> تقرير جديد
            </Button>
          ) : null
        }
      />

      {showForm ? (
        <section aria-label="تقرير جديد" className="space-y-3">
          <h2 className="font-display text-heading-3 text-text-primary">تقرير جديد</h2>
          <StudentReportForm
            onSave={() => {
              setShowForm(false);
              setReloadKey((k) => k + 1);
            }}
            onCancel={() => setShowForm(false)}
          />
        </section>
      ) : null}

      <section aria-label="تقاريري السابقة" className="space-y-3">
        <h2 className="font-display text-heading-3 text-text-primary">تقاريري السابقة</h2>
        <ReportsList reloadKey={reloadKey} emptyAction={!showForm ? <Button onClick={openForm}>تقديم أول تقرير</Button> : null} />
      </section>
    </div>
  );
};

export default StudentReportPage;
