import React from "react";
import { ResultsView } from "../../components/institute/StudentRecords";
import guardianApi from "../../services/api/guardianApi";

const GuardianResults = () => <ResultsView load={() => guardianApi.getResults()} />;

export default GuardianResults;
