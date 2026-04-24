import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course_image: null,
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/courses`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      }
    };

    fetchCourses();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, course_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/courses`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      const data = await response.json();
      setCourses([...courses, data.course]);
      setFormData({ title: "", description: "", course_image: null });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/courses/${selectedCourse._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );
      const data = await response.json();
      setCourses(
        courses.map((crs) => (crs._id === data.course._id ? data.course : crs))
      );
      setFormData({ title: "", description: "", course_image: null });
      setSelectedCourse(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/courses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setCourses(courses.filter((crs) => crs._id !== id));
      } else {
        toast.error("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      course_image: null,
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedCourse(null);
    setFormData({ title: "", description: "", course_image: null });
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-4 mb-11">
      <h1 className="text-4xl text-darkGray font-bold mb-6">Courses</h1>

      {!showForm && (
        <button
          onClick={handleAddNew}
          className="mb-6 px-4 py-2 bg-gold text-white rounded-md hover:bg-mutedGold"
        >
          Add New Course
        </button>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl text-darkGray font-semibold mb-4">
            {selectedCourse ? "Edit Course" : "Create Course"}
          </h2>
          <form
            onSubmit={selectedCourse ? handleUpdate : handleSubmit}
            encType="multipart/form-data"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Course Image
              </label>
              <input
                type="file"
                name="course_image"
                onChange={handleFileChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                accept="image/*"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-darkGray text-white rounded-md hover:bg-gray-700"
            >
              {selectedCourse ? "Update" : "Create"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="ml-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {Array.isArray(courses) && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl text-darkGray font-semibold mb-2">
                {course?.title || "No title"}
              </h3>
              {course.course_image && (
                <img
                  src={course.course_image}
                  alt={course.title}
                  className="mb-4 w-full h-auto rounded-md"
                />
              )}
              <p className="text-gray-600 mb-4">
                {course?.description || "No description"}
              </p>

              <button
                onClick={() => handleEdit(course)}
                className="mr-4 px-4 py-2 bg-gold text-white rounded-md hover:bg-mutedGold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(course._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No courses found.</p>
      )}
    </div>
  );
};

export default CoursePage;
