import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const DifficultyPage = () => {
  const [difficulties, setDifficulties] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDifficulties = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/difficulties`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setDifficulties(data);
      } catch (error) {
        console.error("Error fetching difficulties:", error);
        setError("Failed to load difficulties");
      }
    };

    fetchDifficulties();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/difficulties`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      setDifficulties([...difficulties, data.difficulty]);
      setFormData({ title: "", description: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating difficulty:", error);
      setError("Failed to create difficulty");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/difficulties/${selectedDifficulty._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      setDifficulties(
        difficulties.map((diff) =>
          diff._id === data.difficulty._id ? data.difficulty : diff
        )
      );
      setFormData({ title: "", description: "" });
      setSelectedDifficulty(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating difficulty:", error);
      setError("Failed to update difficulty");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/difficulties/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setDifficulties(difficulties.filter((diff) => diff._id !== id));
      } else {
        setError("Failed to delete difficulty");
      }
    } catch (error) {
      console.error("Error deleting difficulty:", error);
      setError("Failed to delete difficulty");
    }
  };

  const handleEdit = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setFormData({
      title: difficulty.title || "",
      description: difficulty.description || "",
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedDifficulty(null);
    setFormData({ title: "", description: "" });
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl text-darkGray font-bold mb-6">Difficulties</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!showForm && (
        <button
          onClick={handleAddNew}
          className="mb-6 px-4 py-2 bg-gold text-white rounded-md hover:bg-mutedGold"
        >
          Add New Difficulty
        </button>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl text-darkGray font-semibold mb-4">
            {selectedDifficulty ? "Edit Difficulty" : "Create Difficulty"}
          </h2>
          <form onSubmit={selectedDifficulty ? handleUpdate : handleSubmit}>
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
            <button
              type="submit"
              className="px-4 py-2 bg-darkGray text-white rounded-md hover:bg-gray-700"
            >
              {selectedDifficulty ? "Update" : "Create"}
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

      {Array.isArray(difficulties) && difficulties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {difficulties.map((difficulty) => (
            <div
              key={difficulty._id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl text-darkGray font-semibold mb-2">
                {difficulty?.title || "No title"}
              </h3>
              <p className="text-gray-600 mb-4">
                {difficulty?.description || "No description"}
              </p>
              <button
                onClick={() => handleEdit(difficulty)}
                className="mr-4 px-4 py-2 bg-gold text-white rounded-md hover:bg-mutedGold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(difficulty._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No difficulties found.</p>
      )}
    </div>
  );
};

export default DifficultyPage;
