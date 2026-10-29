import React from "react";
import { FeesView } from "../../components/institute/StudentRecords";
import guardianApi from "../../services/api/guardianApi";

const GuardianFees = () => <FeesView load={() => guardianApi.getFees()} />;

export default GuardianFees;
