import React from "react";
import { ResultsView } from "../../components/institute/StudentRecords";
import instituteApi from "../../services/api/instituteApi";

const Results = () => (
  <ResultsView load={() => instituteApi.getMyResults()} description="كشوف درجاتك المعتمدة من إدارة المعهد." />
);

export default Results;
