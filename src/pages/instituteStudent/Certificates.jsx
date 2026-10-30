import React from "react";
import { ContentCollection } from "../../components/content/ContentCollection";
import { certificateConfig } from "../../components/content/studentRecords";

// GET /certificates returns both the student's own certificates and those
// issued by the institute; issued ones are read-only.
const Certificates = () => <ContentCollection config={certificateConfig} />;

export default Certificates;
