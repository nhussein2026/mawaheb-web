import React from "react";
import { ContentCollection } from "../components/content/ContentCollection";
import { uploadUrl } from "../utils/uploads";

const config = {
  endpoint: "/events",
  pick: (d) => d.event,
  fields: [
    { name: "title", label: "اسم الفعالية", required: true },
    { name: "description", label: "وصف الفعالية", type: "textarea", required: true },
    { name: "photo", label: "صورة الفعالية", type: "file" },
  ],
  image: (it) => uploadUrl(it.photo),
  copy: {
    title: "الفعاليات والأنشطة",
    description: "الفعاليات والأنشطة الطلابية التي شاركت فيها.",
    noun: "الفعالية",
    add: "إضافة فعالية",
    empty: "لا توجد فعاليات بعد",
    emptyHint: "أضف الفعاليات والأنشطة التي تشارك فيها لتظهر في سجلك.",
  },
};

const EventPage = () => <ContentCollection config={config} />;

export default EventPage;
