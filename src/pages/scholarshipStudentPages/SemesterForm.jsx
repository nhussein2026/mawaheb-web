// src/components/SemesterForm.jsx
import { useState, useEffect } from "react";

const SemesterForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    semesterNumber: "",
    semesterGPA: "",
    totalGPA: "",
    courses: [],
    resultImage: null,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        resultImage: initialData.resultImage || null,
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...formData.courses];
    updatedCourses[index][field] = value;
    setFormData({ ...formData, courses: updatedCourses });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, resultImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewCourse = () => {
    setFormData({
      ...formData,
      courses: [
        ...formData.courses,
        {
          courseCode: "",
          courseName: "",
          grade: 0,
          credits: 0,
          ects: 0,
          lg: "AA",
        },
      ],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {initialData?._id ? "Edit Semester" : "New Semester"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Semester Number and GPA Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Semester Number
              </label>
              <input
                type="number"
                name="semesterNumber"
                value={formData.semesterNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Semester GPA
              </label>
              <input
                type="number"
                name="semesterGPA"
                value={formData.semesterGPA}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                step="0.01"
                min="0"
                max="4.0"
                placeholder="0.0 - 4.0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Cumulative GPA
              </label>
              <input
                type="number"
                name="totalGPA"
                value={formData.totalGPA}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                step="0.01"
                min="0"
                max="4.0"
                placeholder="0.0 - 4.0"
                required
              />
            </div>
          </div>

          {/* Result Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Result Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {formData.resultImage && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-1">Preview:</p>
                <img
                  src={formData.resultImage}
                  alt="Result preview"
                  className="max-w-full h-auto max-h-40 object-contain border rounded"
                />
              </div>
            )}
          </div>

          {/* Courses Section */}
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-3">Courses</h3>
            {formData.courses.map((course, index) => (
              <div key={index} className="border p-4 rounded mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">Course {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const updatedCourses = [...formData.courses];
                      updatedCourses.splice(index, 1);
                      setFormData({ ...formData, courses: updatedCourses });
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Course Code
                    </label>
                    <input
                      type="text"
                      value={course.courseCode}
                      onChange={(e) =>
                        handleCourseChange(index, "courseCode", e.target.value)
                      }
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Course Name
                    </label>
                    <input
                      type="text"
                      value={course.courseName}
                      onChange={(e) =>
                        handleCourseChange(index, "courseName", e.target.value)
                      }
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Grade (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={course.grade}
                      onChange={(e) =>
                        handleCourseChange(index, "grade", e.target.value)
                      }
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Credits
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={course.credits}
                      onChange={(e) =>
                        handleCourseChange(index, "credits", e.target.value)
                      }
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ECTS
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={course.ects}
                      onChange={(e) =>
                        handleCourseChange(index, "ects", e.target.value)
                      }
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Letter Grade
                    </label>
                    <select
                      value={course.lg}
                      onChange={(e) =>
                        handleCourseChange(index, "lg", e.target.value)
                      }
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    >
                      {[
                        "AA",
                        "AB",
                        "BA",
                        "BB",
                        "CB",
                        "CC",
                        "DC",
                        "DD",
                        "FF",
                      ].map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addNewCourse}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-sm"
            >
              Add Course
            </button>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Semester
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SemesterForm;
