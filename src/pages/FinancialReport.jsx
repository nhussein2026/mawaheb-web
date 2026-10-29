import React from "react";
import { ContentCollection } from "../components/content/ContentCollection";
import { uploadUrl } from "../utils/uploads";

const config = {
  endpoint: "/financial-report",
  // Create returns { financialReport }; update returns { report } (report M1).
  pick: (d) => d.financialReport || d.report,
  fields: [
    { name: "title", label: "عنوان التقرير", required: true },
    { name: "date_of_report", label: "تاريخ التقرير", type: "date" },
    { name: "description", label: "تفاصيل المصروفات", type: "textarea", required: true },
    { name: "financial_report_image", label: "صورة الإيصال أو الفاتورة", type: "file" },
  ],
  image: (it) => uploadUrl(it.financial_report_image),
  date: (it) => it.date_of_report,
  copy: {
    title: "التقرير المالي",
    description: "تقارير المصروفات وإيصالاتها خلال فترة الابتعاث.",
    noun: "التقرير",
    add: "إضافة تقرير مالي",
    empty: "لا توجد تقارير مالية بعد",
    emptyHint: "أضف تقارير مصروفاتك مع صور الإيصالات.",
  },
};

const FinancialReport = () => <ContentCollection config={config} />;

export default FinancialReport;
