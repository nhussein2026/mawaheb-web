import React from "react";
import { FeesView } from "../../components/institute/StudentRecords";
import instituteApi from "../../services/api/instituteApi";

const Fees = () => <FeesView load={() => instituteApi.getMyFees()} description="حالة رسومك السنوية وأقساطها (للاطلاع فقط)." />;

export default Fees;
