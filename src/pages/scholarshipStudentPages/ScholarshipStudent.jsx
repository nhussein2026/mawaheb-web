import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const ScholarshipStudent = () => {
  const token = useSelector((state) => state.auth.token);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasRecord, setHasRecord] = useState(false);
  const [formData, setFormData] = useState({
    country_of_studying: "",
    city: "",
    university: "",
    type_of_university: "",
    program_of_study: "",
    student_university_id: "",
    enrollment_year: "",
    expected_graduation_year: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/scholarship-student`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudents(response.data);
      setHasRecord(response.data.length > 0);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch students");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      if (editMode) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/scholarship-student/${currentStudentId}`,
          formData,
          config
        );
        toast.success("Record updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/scholarship-student`,
          formData,
          config
        );
        toast.success("Record created successfully!");
      }

      fetchStudents();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (student) => {
    setFormData({
      country_of_studying: student.country_of_studying,
      city: student.city,
      university: student.university,
      type_of_university: student.type_of_university,
      program_of_study: student.program_of_study,
      student_university_id: student.student_university_id,
      enrollment_year: student.enrollment_year,
      expected_graduation_year: student.expected_graduation_year,
    });
    setEditMode(true);
    setCurrentStudentId(student._id);
  };

  const resetForm = () => {
    setFormData({
      country_of_studying: "",
      city: "",
      university: "",
      type_of_university: "",
      program_of_study: "",
      student_university_id: "",
      enrollment_year: "",
      expected_graduation_year: "",
    });
    setEditMode(false);
    setCurrentStudentId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Scholarship Students Management
      </h1>

      {/* Show form only if user doesn't have a record OR is in edit mode */}
      {(!hasRecord || editMode) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8"
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {editMode ? "Edit Your Record" : "Create Your Record"}
            </h2>
            <p className="text-gray-600 text-sm">
              {editMode
                ? "Update your scholarship student information below."
                : "Fill out the form below to create your scholarship student record."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Country of Studying
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.country_of_studying}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    country_of_studying: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                City
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                University
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.university}
                onChange={(e) =>
                  setFormData({ ...formData, university: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                University Type
              </label>
              <select
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.type_of_university}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type_of_university: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Type</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Program of Study
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.program_of_study}
                onChange={(e) =>
                  setFormData({ ...formData, program_of_study: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Student University ID
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.student_university_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    student_university_id: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Enrollment Year
              </label>
              <input
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.enrollment_year}
                onChange={(e) =>
                  setFormData({ ...formData, enrollment_year: e.target.value })
                }
                min="1900"
                max="2099"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Expected Graduation Year
              </label>
              <input
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.expected_graduation_year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expected_graduation_year: e.target.value,
                  })
                }
                min="1900"
                max="2099"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
            >
              {editMode ? "Update Record" : "Create Record"}
            </button>
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      {/* Show info message when user has a record but not in edit mode */}
      {hasRecord && !editMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                You already have a scholarship student record
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  You can only have one scholarship student record. Use the
                  "Edit" button below to update your information.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {hasRecord ? "Your Record" : "No Records Found"}
        </h2>

        {hasRecord ? (
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    University
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Enrollment Year
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {student.university}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {student.program_of_study}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {student.enrollment_year}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => handleEdit(student)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition duration-200"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No scholarship records
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first scholarship student record.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipStudent;
