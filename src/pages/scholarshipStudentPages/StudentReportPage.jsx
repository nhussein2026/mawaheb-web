import React, { useState } from 'react';
import StudentReportForm from './StudentReport';

const StudentReportPage = () => {
  const [editingReportId, setEditingReportId] = useState(null);

  const handleSaveReport = async (updatedReport) => {
    // Handle saving or updating report (e.g., API calls, state updates)
    // Example API call or state update
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/studentReports/${updatedReport._id}`);
      const data = await response.json();
      console.log('Report updated:', data);
      // Optionally update state or show notification
    } catch (error) {
      console.error('Error updating report:', error);
      // Handle error state or show error notification
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Report Page</h1>
      <div className="mb-8">
        <button
          onClick={() => setEditingReportId(null)}
          className="bg-gold hover:bg-mutedGold text-white px-4 py-2 rounded-md mr-2"
        >
          Create New Report
        </button>
      </div>
      <StudentReportForm
        reportId={editingReportId}
        onSave={handleSaveReport}
      />
    </div>
  );
};

export default StudentReportPage;
