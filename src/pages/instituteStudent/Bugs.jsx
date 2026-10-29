import React from "react";
import { MyThreads } from "../../components/institute/MyThreads";
import instituteApi from "../../services/api/instituteApi";

const COPY = {
  title: "المشكلات والأخطاء",
  description: "أبلغ عن مشكلة أو خطأ في المنصة وتابع حالتها وردود الفريق.",
  newLabel: "بلاغ جديد",
  sendLabel: "إرسال البلاغ",
  bodyLabel: "وصف المشكلة",
  bodyRequired: "يُرجى وصف المشكلة",
  sent: "تم تسجيل البلاغ",
  sendFailed: "تعذّر تسجيل البلاغ ولم يُحفظ. يُرجى المحاولة مرة أخرى.",
  empty: "لم تسجّل أي بلاغ بعد",
  listFailed: "تعذّر تحميل البلاغات",
  openFailed: "تعذّر فتح البلاغ. يُرجى المحاولة مرة أخرى.",
};

const Bugs = () => (
  <MyThreads loadList={() => instituteApi.getMyBugs()} create={(fd) => instituteApi.createMyBug(fd)} copy={COPY} withModuleTag />
);

export default Bugs;
