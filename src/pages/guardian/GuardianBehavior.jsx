import React from "react";
import { BehaviorView } from "../../components/institute/StudentRecords";
import guardianApi from "../../services/api/guardianApi";

// Guardians see the record without staff attachments, as before.
const GuardianBehavior = () => <BehaviorView load={() => guardianApi.getBehavior()} showAttachments={false} />;

export default GuardianBehavior;
