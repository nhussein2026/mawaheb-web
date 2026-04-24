// src/components/SemestersList.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import SemesterForm from "./SemesterForm";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaImage,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function SemestersList() {
  const token = useSelector((state) => state.auth.token);
  const [semesters, setSemesters] = useState([]);
  console.log("semesters", semesters);
  const [showForm, setShowForm] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSemesters, setExpandedSemesters] = useState({});
  const [viewingImage, setViewingImage] = useState(null);

  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await api.get("/semester/all");
      setSemesters(response.data);
      // Initialize all semesters as collapsed
      const initialExpanded = {};
      response.data.forEach((sem) => {
        initialExpanded[sem._id] = false;
      });
      setExpandedSemesters(initialExpanded);
    } catch (error) {
      console.error("Error fetching semesters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingSemester?._id) {
        await api.put(`/semester/${editingSemester._id}`, formData);
      } else {
        await api.post("/semester", formData);
      }
      fetchSemesters();
      setShowForm(false);
      setEditingSemester(null);
    } catch (error) {
      console.error("Error saving semester:", error);
    }
  };

  const deleteSemester = async (id) => {
    try {
      await api.delete(`/semester/${id}`);
      fetchSemesters();
    } catch (error) {
      console.error("Error deleting semester:", error);
    }
  };

  const toggleSemester = (id) => {
    setExpandedSemesters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Academic Semesters</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        >
          <FaPlus className="text-sm" />
          <span>Add Semester</span>
        </button>
      </div>

      {showForm && (
        <SemesterForm
          initialData={
            editingSemester || {
              semesterNumber: "",
              semesterGPA: "",
              totalGPA: "",
              courses: [],
              resultImage: null,
            }
          }
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingSemester(null);
          }}
        />
      )}

      {viewingImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] w-full">
            <img
              src={viewingImage}
              alt="Result"
              className="w-full h-full object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              onClick={() => setViewingImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {semesters.length === 0 ? (
        <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No semesters yet
          </h3>
          <p className="text-gray-500 mb-4">
            Add your first semester to get started
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <FaPlus />
            Add Semester
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {[...semesters]
            .sort((a, b) => a.semesterNumber - b.semesterNumber)
            .map((semester) => (
              <div
                key={semester._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg"
              >
                <div
                  className="p-4 md:p-6 cursor-pointer"
                  onClick={() => toggleSemester(semester._id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg">
                        {semester.semesterNumber}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                          Semester {semester.semesterNumber}
                        </h2>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <div className="bg-green-50 px-3 py-1 rounded-full text-sm font-medium text-green-700 flex items-center">
                            <span className="mr-1">GPA:</span>
                            <span className="font-bold">
                              {semester.semesterGPA || "N/A"}
                            </span>
                          </div>
                          <div className="bg-purple-50 px-3 py-1 rounded-full text-sm font-medium text-purple-700 flex items-center">
                            <span className="mr-1">Cumulative:</span>
                            <span className="font-bold">
                              {semester.totalGpa || "N/A"}
                            </span>
                          </div>
                          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                            {semester.courses.length} courses
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingSemester(semester);
                          setShowForm(true);
                        }}
                        className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                        aria-label="Edit semester"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSemester(semester._id);
                        }}
                        className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                        aria-label="Delete semester"
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-800 p-2 transition-transform"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSemester(semester._id);
                        }}
                      >
                        {expandedSemesters[semester._id] ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {expandedSemesters[semester._id] && (
                  <div className="border-t border-gray-100 px-4 md:px-6 py-5">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium">
                              Code
                            </th>
                            <th className="px-4 py-3 text-left font-medium">
                              Course
                            </th>
                            <th className="px-4 py-3 text-left font-medium">
                              Grade
                            </th>
                            <th className="px-4 py-3 text-left font-medium">
                              Credits
                            </th>
                            <th className="px-4 py-3 text-left font-medium">
                              ECTS
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {semester.courses.map((course) => (
                            <tr
                              key={course.courseCode}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-4 py-3 font-medium">
                                {course.courseCode}
                              </td>
                              <td className="px-4 py-3">{course.courseName}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {course.lg}
                                </span>
                              </td>
                              <td className="px-4 py-3">{course.credits}</td>
                              <td className="px-4 py-3">{course.ects}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {semester.resultImage && (
                      <div className="mt-6">
                        <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <FaImage className="text-gray-500" /> Result Image
                        </h3>
                        <div
                          className="relative w-full max-w-xs h-40 rounded-lg border border-gray-200 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                          onClick={() => setViewingImage(semester.resultImage)}
                        >
                          <img
                            src={semester.resultImage}
                            alt={`Semester ${semester.semesterNumber} results`}
                            className="w-full h-full object-contain bg-gray-50"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
