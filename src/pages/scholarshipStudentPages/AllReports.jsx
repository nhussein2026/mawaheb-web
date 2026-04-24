import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AllReports = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState({})
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/allReports`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }

        const data = await response.json();
        console.log("this is data", data)
        if (data.studentReports) {
          setReports(data.studentReports);
        } else {
          console.error('No student reports found in data:', data);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, [token]); // Added token as a dependency to useEffect

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-8">Students Reports</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report._id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{report.title}</h2>
              <p><strong>Submitted By:</strong> {users[report.userId]?.name}</p>
              <p><strong>Course:</strong> {report.courseId?.name}</p>
              <p><strong>Note:</strong> {report.noteId?.title}</p>
              <p><strong>Difficulties:</strong> {report.difficultiesId?.map(difficulty => difficulty.name).join(', ')}</p>
              <p><strong>User Achievement:</strong> {report.userAchievementId?.title}</p>
              <p><strong>Event:</strong> {report.eventId?.name}</p>
              <p><strong>Date:</strong> {new Date(report.date_of_report).toLocaleDateString()}</p>
              <p><strong>Certificate:</strong> {report.certificateId?.name}</p>
            </div>
          ))
        ) : (
          <p>No reports available</p>
        )}
      </div>
    </div>
  );
};

export default AllReports;
