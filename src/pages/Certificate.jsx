import React from "react";
import { ContentCollection } from "../components/content/ContentCollection";
import { certificateConfig } from "../components/content/studentRecords";

const StudentCertificate = () => <ContentCollection config={certificateConfig} />;

export default StudentCertificate;
