import React from "react";
import { ContentCollection } from "../components/content/ContentCollection";

const config = {
  endpoint: "/courses",
  pick: (d) => d.course,
  fields: [
    { name: "title", label: "اسم الدورة", required: true },
    { name: "description", label: "وصف الدورة", type: "textarea", required: true },
    { name: "course_image", label: "صورة الدورة أو شهادتها", type: "file" },
  ],
  image: (it) => it.course_image || null,
  copy: {
    title: "الدورات التدريبية",
    description: "الدورات التدريبية التي التحقت بها.",
    noun: "الدورة",
    add: "إضافة دورة",
    empty: "لا توجد دورات بعد",
    emptyHint: "أضف الدورات التدريبية التي أكملتها لتظهر في سجلك.",
  },
};

const StudentCourse = () => <ContentCollection config={config} />;

export default StudentCourse;
