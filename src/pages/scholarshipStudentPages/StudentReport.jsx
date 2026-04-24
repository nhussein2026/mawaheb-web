import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  CalendarIcon,
  BookOpenIcon,
  AcademicCapIcon,
  TrophyIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const StudentReport = ({ reportId, onSave }) => {
  const [form, setForm] = useState({
    title: "",
    courseId: "",
    noteId: "",
    difficultiesId: "",
    userAchievementId: "",
    eventId: "",
    date_of_report: "",
    certificateId: "",
  });
  const [options, setOptions] = useState({
    courses: [],
    notes: [],
    difficulties: [],
    userAchievements: [],
    events: [],
    certificates: [],
  });

  const [creatingNew, setCreatingNew] = useState({
    course: false,
    note: false,
    difficulty: false,
    userAchievement: false,
    event: false,
    certificate: false,
  });

  const [newItems, setNewItems] = useState({
    course: { title: "", description: "", course_image: "" },
    note: { title: "", description: "" },
    difficulty: { title: "", description: "" },
    userAchievement: {
      title: "",
      description: "",
      category: "",
      achievement_image: "",
    },
    event: { title: "", description: "", photo: "" },
    certificate: {
      title: "",
      description: "",
      certificate_image: "",
      certificate_link: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const token = useSelector((state) => state.auth.token);
  const [reports, setReports] = useState([]);
  console.log("reports", reports);
  // Configuration for different item types
  const itemConfig = {
    course: {
      icon: BookOpenIcon,
      label: "Course",
      color: "bg-blue-50 border-blue-200 text-blue-700",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    note: {
      icon: DocumentTextIcon,
      label: "Note",
      color: "bg-green-50 border-green-200 text-green-700",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    difficulty: {
      icon: ExclamationTriangleIcon,
      label: "Difficulty",
      color: "bg-yellow-50 border-yellow-200 text-yellow-700",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
    },
    userAchievement: {
      icon: TrophyIcon,
      label: "Achievement",
      color: "bg-purple-50 border-purple-200 text-purple-700",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
    event: {
      icon: CalendarDaysIcon,
      label: "Event",
      color: "bg-pink-50 border-pink-200 text-pink-700",
      buttonColor: "bg-pink-600 hover:bg-pink-700",
    },
    certificate: {
      icon: AcademicCapIcon,
      label: "Certificate",
      color: "bg-indigo-50 border-indigo-200 text-indigo-700",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
    },
  };

  const pluralMap = {
    course: "courses",
    note: "notes",
    difficulty: "difficulties",
    userAchievement: "userAchievements",
    event: "events",
    certificate: "certificates",
  };

  useEffect(() => {
    fetchOptions();
    fetchStudentReports();
  }, [token]);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/studentReports/options`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch options");

      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error("Error fetching options:", error);
      toast.error("Failed to load form options");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentReports = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/studentReports`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch reports");

      const data = await response.json();
      setReports(data.studentReports || data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load existing reports");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = "Title is required";
    if (!form.date_of_report) errors.date_of_report = "Date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNewItemChange = (e, itemType) => {
    const { name, value } = e.target;
    setNewItems((prevItems) => ({
      ...prevItems,
      [itemType]: { ...prevItems[itemType], [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        reportId
          ? `${import.meta.env.VITE_API_URL}/studentReport/${reportId}`
          : `${import.meta.env.VITE_API_URL}/studentReport`,
        {
          method: reportId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) throw new Error("Failed to save report");

      const data = await response.json();
      onSave(data);
      toast.success(
        reportId
          ? "Report updated successfully!"
          : "Report created successfully!"
      );

      // Reset form if creating new
      if (!reportId) {
        setForm({
          title: "",
          courseId: "",
          noteId: "",
          difficultiesId: "",
          userAchievementId: "",
          eventId: "",
          date_of_report: "",
          certificateId: "",
        });
      }

      fetchStudentReports();
    } catch (error) {
      console.error("Error saving report:", error);
      toast.error("Failed to save report");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewItem = async (itemType) => {
    const endpoint =
      itemType === "difficulty" ? "difficulties" : `${itemType}s`;

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newItems[itemType]),
        }
      );

      if (!response.ok) throw new Error(`Failed to create ${itemType}`);

      const newItem = await response.json();
      setOptions((prevOptions) => ({
        ...prevOptions,
        [`${itemType}s`]: [...prevOptions[`${itemType}s`], newItem],
      }));

      setForm((prevForm) => ({
        ...prevForm,
        [`${itemType}Id`]: newItem._id,
      }));

      setCreatingNew((prevCreatingNew) => ({
        ...prevCreatingNew,
        [itemType]: false,
      }));

      // Reset new item form
      setNewItems((prevNewItems) => ({
        ...prevNewItems,
        [itemType]: getEmptyItemStructure(itemType),
      }));

      toast.success(`${itemConfig[itemType].label} created successfully!`);
    } catch (error) {
      console.error(`Error creating new ${itemType}:`, error);
      toast.error(`Failed to create ${itemType}`);
    } finally {
      setLoading(false);
    }
  };

  const getEmptyItemStructure = (itemType) => {
    const baseStructure = { title: "", description: "" };
    const additions = {
      course: { course_image: "" },
      userAchievement: { category: "", achievement_image: "" },
      event: { photo: "" },
      certificate: { certificate_image: "", certificate_link: "" },
    };
    return { ...baseStructure, ...(additions[itemType] || {}) };
  };

  const cancelNewItem = (itemType) => {
    setCreatingNew((prev) => ({ ...prev, [itemType]: false }));
    setNewItems((prev) => ({
      ...prev,
      [itemType]: getEmptyItemStructure(itemType),
    }));
  };

  const renderNewItemForm = (itemType) => {
    const config = itemConfig[itemType];
    const IconComponent = config.icon;

    return (
      <div
        className={`p-4 rounded-lg border-2 border-dashed ${config.color} space-y-3`}
      >
        <div className="flex items-center space-x-2">
          <IconComponent className="h-5 w-5" />
          <h4 className="font-medium">Create New {config.label}</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            name="title"
            placeholder="Title *"
            value={newItems[itemType].title}
            onChange={(e) => handleNewItemChange(e, itemType)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />

          <textarea
            name="description"
            placeholder="Description *"
            value={newItems[itemType].description}
            onChange={(e) => handleNewItemChange(e, itemType)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="2"
            required
          />
        </div>

        {/* Render specific fields based on item type */}
        {itemType === "course" && (
          <input
            type="url"
            name="course_image"
            placeholder="Course Image URL"
            value={newItems.course.course_image}
            onChange={(e) => handleNewItemChange(e, "course")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}

        {itemType === "certificate" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="url"
              name="certificate_image"
              placeholder="Certificate Image URL"
              value={newItems.certificate.certificate_image}
              onChange={(e) => handleNewItemChange(e, "certificate")}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="url"
              name="certificate_link"
              placeholder="Certificate Link"
              value={newItems.certificate.certificate_link}
              onChange={(e) => handleNewItemChange(e, "certificate")}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {itemType === "userAchievement" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={newItems.userAchievement.category}
              onChange={(e) => handleNewItemChange(e, "userAchievement")}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="url"
              name="achievement_image"
              placeholder="Achievement Image URL"
              value={newItems.userAchievement.achievement_image}
              onChange={(e) => handleNewItemChange(e, "userAchievement")}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {itemType === "event" && (
          <input
            type="url"
            name="photo"
            placeholder="Event Photo URL"
            value={newItems.event.photo}
            onChange={(e) => handleNewItemChange(e, "event")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}

        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={() => cancelNewItem(itemType)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleCreateNewItem(itemType)}
            disabled={
              loading ||
              !newItems[itemType].title ||
              !newItems[itemType].description
            }
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${config.buttonColor}`}
          >
            <CheckIcon className="h-4 w-4 inline mr-1" />
            Save {config.label}
          </button>
        </div>
      </div>
    );
  };

  const renderSelectField = (itemType) => {
    const config = itemConfig[itemType];
    const IconComponent = config.icon;
    const pluralKey = pluralMap[itemType];

    return (
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
          <IconComponent className="h-4 w-4" />
          <span>{config.label}</span>
        </label>

        {creatingNew[itemType] ? (
          renderNewItemForm(itemType)
        ) : (
          <div className="flex space-x-2">
            <select
              name={`${itemType}Id`}
              value={form[`${itemType}Id`]}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a {config.label.toLowerCase()}</option>
              {options[pluralKey]?.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                setCreatingNew((prev) => ({ ...prev, [itemType]: true }))
              }
              className={`px-3 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.buttonColor}`}
              title={`Create new ${config.label.toLowerCase()}`}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading && !reports.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {reportId ? "Edit Student Report" : "Create Student Report"}
          </h1>
          <p className="text-gray-600">
            {reportId
              ? "Update your existing report details"
              : "Fill out the form below to create a new student report"}
          </p>
        </div>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-6 mb-8 space-y-6"
        >
          {/* Title and Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.title ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter report title"
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
              )}
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Date of Report *</span>
              </label>
              <input
                type="date"
                name="date_of_report"
                value={form.date_of_report}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.date_of_report
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
              {formErrors.date_of_report && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.date_of_report}
                </p>
              )}
            </div>
          </div>

          {/* Dynamic Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              "course",
              "note",
              "difficulty",
              "userAchievement",
              "event",
              "certificate",
            ].map((itemType) => (
              <div key={itemType}>{renderSelectField(itemType)}</div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <CheckIcon className="h-5 w-5" />
              )}
              <span>{reportId ? "Update Report" : "Create Report"}</span>
            </button>
          </div>
        </form>

        {/* Existing Reports */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Existing Reports
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your previously created reports
            </p>
          </div>

          <div className="overflow-x-auto">
            {reports.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No reports yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first report above.
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {report.title || "Untitled Report"}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {report._id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.date_of_report
                          ? new Date(report.date_of_report).toLocaleDateString()
                          : "No date"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            /* Handle edit */
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Edit report"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            /* Handle delete */
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete report"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReport;
