import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const categories = [
  "Project",
  "Prize",
  "Certificate",
  "Innovation",
  "Research Paper",
  "Volunteering Activity",
  "Other",
];

const UserAchievementPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    achievement_image: null,
  });
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/userAchievements`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setAchievements(data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setError("Failed to load achievements");
      }
    };

    fetchAchievements();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, achievement_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/userAchievements`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );
      const data = await response.json();
      setAchievements([...achievements, data.userAchievement]);
      setFormData({
        title: "",
        description: "",
        category: categories[0],
        achievement_image: null,
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating achievement:", error);
      setError("Failed to create achievement");
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
        `${import.meta.env.VITE_API_URL}/userAchievements/${selectedAchievement._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );
      const data = await response.json();
      setAchievements(
        achievements.map((ach) =>
          ach._id === data.userAchievement._id ? data.userAchievement : ach
        )
      );
      setFormData({
        title: "",
        description: "",
        category: categories[0],
        achievement_image: null,
      });
      setSelectedAchievement(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating achievement:", error);
      setError("Failed to update achievement");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/userAchievements/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setAchievements(achievements.filter((ach) => ach._id !== id));
      } else {
        setError("Failed to delete achievement");
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
      setError("Failed to delete achievement");
    }
  };

  const handleEdit = (achievement) => {
    setSelectedAchievement(achievement);
    setFormData({
      title: achievement.title || "",
      description: achievement.description || "",
      category: achievement.category || categories[0],
      achievement_image: null,
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedAchievement(null);
    setFormData({
      title: "",
      description: "",
      category: categories[0],
      achievement_image: null,
    });
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-4 mb-11">
      <h1 className="text-4xl text-darkGray font-bold mb-6">
        User Achievements
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!showForm && (
        <button
          onClick={handleAddNew}
          className="mb-6 px-4 py-2 bg-gold text-white rounded-md hover:bg-mutedGold"
        >
          Add New Achievement
        </button>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl text-darkGray font-semibold mb-4">
            {selectedAchievement ? "Edit Achievement" : "Create Achievement"}
          </h2>
          <form
            onSubmit={selectedAchievement ? handleUpdate : handleSubmit}
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
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Achievement Image
              </label>
              <input
                type="file"
                name="achievement_image"
                onChange={handleFileChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                accept="image/*"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-darkGray text-white rounded-md hover:bg-gray-700"
            >
              {selectedAchievement ? "Update" : "Create"}
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

      {Array.isArray(achievements) && achievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement._id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl text-darkGray font-semibold mb-2">
                {achievement?.title || "No title"}
              </h3>
              <p className="text-gray-600 mb-4">
                {achievement?.description || "No description"}
              </p>
              <p className="text-gray-600 mb-4">
                Category:{" "}
                <span className="px-3 py-1 text-[14px] bg-[#E0E0E0] max-w-max rounded font-semibold text-[#B3A369">
                  {achievement?.category || "No category"}
                </span>
              </p>
              {achievement && achievement.achievement_image && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/${achievement.achievement_image}`}
                  alt={achievement.title}
                  className="mb-4"
                />
              )}
              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(achievement)}
                  className="px-4 py-2 bg-gold text-white rounded-md hover:bg-mutedGold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(achievement._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">
          No achievements available. Add some achievements!
        </p>
      )}
    </div>
  );
};

export default UserAchievementPage;
