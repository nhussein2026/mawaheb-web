import React from "react";
import { ContentCollection } from "../components/content/ContentCollection";

const config = {
  endpoint: "/difficulties",
  json: true,
  pick: (d) => d.difficulty,
  fields: [
    { name: "title", label: "عنوان الصعوبة", required: true },
    { name: "description", label: "وصف الصعوبة وما تحتاجه من دعم", type: "textarea", required: true },
  ],
  copy: {
    title: "الصعوبات والتحديات",
    description: "سجّل ما يواجهك من صعوبات دراسية أو معيشية ليتابعها فريق الابتعاث.",
    noun: "السجل",
    add: "تسجيل صعوبة",
    empty: "لم تسجّل أي صعوبة",
    emptyHint: "إن واجهتك صعوبة في دراستك أو إقامتك، سجّلها هنا ليتابعها فريق الابتعاث.",
  },
};

const Difficulties = () => <ContentCollection config={config} />;

export default Difficulties;
