import React from "react";
import { ContentCollection } from "../components/content/ContentCollection";
import { uploadUrl } from "../utils/uploads";

const CATEGORIES = ["مشروع", "جائزة", "شهادة", "ابتكار", "ورقة بحثية", "نشاط تطوعي", "أخرى"];

const config = {
  endpoint: "/userAchievements",
  pick: (d) => d.userAchievement,
  fields: [
    { name: "title", label: "عنوان الإنجاز", required: true },
    { name: "category", label: "التصنيف", type: "select", options: CATEGORIES },
    { name: "description", label: "وصف الإنجاز", type: "textarea", required: true },
    { name: "achievement_image", label: "صورة أو مستند داعم", type: "file" },
  ],
  image: (it) => uploadUrl(it.achievement_image),
  meta: (it) => it.category,
  copy: {
    title: "إنجازاتي",
    description: "الجوائز والمشاريع والمسابقات التي حققتها.",
    noun: "الإنجاز",
    add: "إضافة إنجاز",
    empty: "لم تُضف أي إنجاز بعد",
    emptyHint: "سجّل جوائزك ومشاريعك ومشاركاتك مع ما يثبتها.",
  },
};

const UserAchievementPage = () => <ContentCollection config={config} />;

export default UserAchievementPage;
