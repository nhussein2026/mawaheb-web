import React from "react";
import { BehaviorView } from "../../components/institute/StudentRecords";
import instituteApi from "../../services/api/instituteApi";

const Behavior = () => (
  <BehaviorView load={() => instituteApi.getMyBehavior()} description="ملاحظاتك السلوكية المسجلة من المشرفين." />
);

export default Behavior;
