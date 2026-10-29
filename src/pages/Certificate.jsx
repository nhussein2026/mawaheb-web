import React from "react";
import { ContentCollection } from "../components/content/ContentCollection";
import { uploadUrl } from "../utils/uploads";

const config = {
  endpoint: "/certificates",
  // Create returns { certificate }, update returns { updatedCertificate }.
  pick: (d) => d.certificate || d.updatedCertificate,
  fields: [
    { name: "title", label: "اسم الشهادة", required: true },
    { name: "description", label: "الجهة المانحة أو وصف الشهادة", type: "textarea", required: true },
    { name: "certificate_link", label: "رابط التحقق من الشهادة", type: "url", hint: "مثال: https://example.com/verify/123" },
    { name: "certificate_image", label: "صورة الشهادة", type: "file" },
  ],
  image: (it) => uploadUrl(it.certificate_image, "uploads/"),
  link: (it) => it.certificate_link || null,
  copy: {
    title: "الشهادات المهنية",
    description: "الشهادات المهنية والتخصصية التي حصلت عليها.",
    noun: "الشهادة",
    add: "إضافة شهادة",
    empty: "لا توجد شهادات بعد",
    emptyHint: "أضف شهاداتك المهنية مع رابط التحقق إن وُجد.",
  },
};

const StudentCertificate = () => <ContentCollection config={config} />;

export default StudentCertificate;
