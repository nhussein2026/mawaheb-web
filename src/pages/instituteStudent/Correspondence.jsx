import React from "react";
import { MyThreads } from "../../components/institute/MyThreads";
import instituteApi from "../../services/api/instituteApi";

const COPY = {
  title: "المراسلات",
  description: "راسل إدارة المعهد والمشرفين وتابع ردودهم.",
  newLabel: "رسالة جديدة",
  sendLabel: "إرسال الرسالة",
  bodyLabel: "نص الرسالة",
  bodyRequired: "يُرجى كتابة نص الرسالة",
  sent: "تم إرسال الرسالة إلى الإدارة",
  sendFailed: "تعذّر إرسال الرسالة ولم تُحفظ. يُرجى المحاولة مرة أخرى.",
  empty: "لا توجد رسائل بعد",
  listFailed: "تعذّر تحميل الرسائل",
  openFailed: "تعذّر فتح الرسالة. يُرجى المحاولة مرة أخرى.",
};

const Correspondence = () => (
  <MyThreads
    loadList={() => instituteApi.getMyCorrespondence()}
    create={(fd) => instituteApi.createMyCorrespondence(fd)}
    copy={COPY}
  />
);

export default Correspondence;
