import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const UniversityDetails = ({ universityId }) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [error, setError] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  const [universityData, setUniversityData] = useState({
    studentId: "",
    universityName: "",
    universityType: "",
    scholarshipStudentId: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/university/${universityId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setUniversityData(data);
      } catch (error) {
        console.error("Error fetching university details:", error);
      }
    };
    fetchUniversity();
  }, [universityId]);

  const handleAddNew = () => {
    // setSelectedNote(null);
    setUniversityData({
      studentId: "",
      universityName: "",
      universityType: "",
      scholarshipStudentId: "",
    });
    setShowForm(true);
  };
  return (
    <div className="gap-5">
      {" "}
      <div className="container mx-auto p-4 bg-gray-100">
        <h1 className="text-4xl text-darkGray text-center font-bold mb-6">
          University details
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* adding university details form */}

        <h2>{universityData.universityName}</h2>
        <p>Type: {universityData.universityType}</p>
        <p>Total GPA: {universityData.totalGPA}</p>
      </div>
      <div className="container mx-auto p-4 bg-gray-100 mt-9">
        <h1 className="text-4xl text-darkGray text-center font-bold mb-6">
          Semesters List
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* adding university details form */}

        <h2>{universityData.universityName}</h2>
        <p>Type: {universityData.universityType}</p>
        <p>Total GPA: {universityData.totalGPA}</p>
      </div>
    </div>
  );
};

export default UniversityDetails;
