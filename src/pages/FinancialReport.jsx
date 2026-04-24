import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const FinancialReport = () => {
  const [financialReports, setFinancialReports] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    financial_report_image: null,
    date_of_report: "",
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/financial-report`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setFinancialReports(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      }
    };

    fetchReports();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, financial_report_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/financial-report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );
      const data = await response.json();
      console.log("response: ", data);
      setFinancialReports([...financialReports, data.financialReport]);
      setFormData({ title: "", description: "", financial_report_image: null });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating financial report:", error);
      toast.error("Failed to create financial report");
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
        `${import.meta.env.VITE_API_URL}/financial-report/${selectedReport._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );
      const data = await response.json();
      setFinancialReports(
        financialReports.map((crs) =>
          crs._id === data.financialReport._id ? data.financialReport : crs
        )
      );
      setFormData({ title: "", description: "", financial_report_image: null });
      setSelectedReport(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating Financial report:", error);
      toast.error("Failed to update Financial report");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/financial-report/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setFinancialReports(financialReports.filter((crs) => crs._id !== id));
      } else {
        toast.error("Failed to delete financial report");
      }
    } catch (error) {
      console.error("Error deleting financial report:", error);
      toast.error("Failed to delete financial report");
    }
  };

  const handleEdit = (report) => {
    setSelectedReport(report);
    setFormData({
      title: report.title || "",
      description: report.description || "",
      financial_report_image: null,
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedReport(null);
    setFormData({ title: "", description: "", financial_report_image: null });
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-4 mb-11">
      <h1 className="text-4xl text-darkGray font-bold mb-6">
        Financial Reports
      </h1>

      {!showForm && (
        <button
          onClick={handleAddNew}
          className="mb-6 px-4 py-2 bg-gold text-white rounded-md hover:bg-mutedGold"
        >
          Add New Financial REport
        </button>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl text-darkGray font-semibold mb-4">
            {selectedReport
              ? "Edit Financial Report"
              : "Create Financial Report"}
          </h2>
          <form
            onSubmit={selectedReport ? handleUpdate : handleSubmit}
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
                Financial Report Image
              </label>
              <input
                type="file"
                name="financial_report_image"
                onChange={handleFileChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                accept="image/*"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Date of Report
              </label>
              <input
                type="date"
                name="date_of_report"
                value={formData.date_of_report}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-darkGray text-white rounded-md hover:bg-gray-700"
            >
              {selectedReport ? "Update" : "Create"}
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

      {Array.isArray(financialReports) && financialReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financialReports.map((report) => (
            <div key={report._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl text-darkGray font-semibold mb-2">
                {report?.title || "No title"}
              </h3>
              <p className="text-gray-600 mb-4">
                {report?.description || "No description"}
              </p>
              {report?.financial_report_image && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/${report.financial_report_image}`}
                  alt={report.title}
                  className="mb-4 w-full h-auto rounded-md"
                />
              )}
              <button
                onClick={() => handleEdit(report)}
                className="mr-4 px-4 py-2 bg-gold text-white rounded-md hover:bg-mutedGold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(report._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No financial reports found.</p>
      )}
    </div>
  );
};

export default FinancialReport;
