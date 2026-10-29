import React from "react";
import { EvaluationsView } from "../../components/institute/StudentRecords";
import guardianApi from "../../services/api/guardianApi";

const GuardianEvaluations = () => <EvaluationsView load={() => guardianApi.getEvaluations()} />;

export default GuardianEvaluations;
