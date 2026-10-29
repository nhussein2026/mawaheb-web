import React from "react";
import { EvaluationsView } from "../../components/institute/StudentRecords";
import instituteApi from "../../services/api/instituteApi";

const Evaluations = () => (
  <EvaluationsView load={() => instituteApi.getMyEvaluations()} description="تقارير تقويمك الدورية المعتمدة من المعهد." />
);

export default Evaluations;
