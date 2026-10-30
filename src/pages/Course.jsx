import React from "react";
import { ContentCollection } from "../components/content/ContentCollection";
import { courseConfig } from "../components/content/studentRecords";

const StudentCourse = () => <ContentCollection config={courseConfig} />;

export default StudentCourse;
