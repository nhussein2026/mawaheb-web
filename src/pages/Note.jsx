import React from "react";
import { ContentCollection } from "../components/content/ContentCollection";

const config = {
  endpoint: "/notes",
  json: true,
  createExtra: (user) => ({ user: user?.id }),
  pick: (d) => d.note,
  fields: [
    { name: "title", label: "عنوان الملاحظة", required: true },
    { name: "content", label: "نص الملاحظة", type: "textarea", required: true },
  ],
  copy: {
    title: "الملاحظات",
    description: "ملاحظاتك الشخصية خلال فترة الدراسة.",
    noun: "الملاحظة",
    add: "إضافة ملاحظة",
    empty: "لا توجد ملاحظات بعد",
    emptyHint: "دوّن ملاحظاتك لتعود إليها لاحقًا.",
  },
};

const NotePage = () => <ContentCollection config={config} />;

export default NotePage;
