import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    photo: null,
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/events`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events");
      }
    };

    fetchEvents();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      const data = await response.json();
      setEvents([...events, data.event]);
      setFormData({ title: "", description: "", photo: null });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating event:", error);
      setError("Failed to create event");
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
        `${import.meta.env.VITE_API_URL}/events/${selectedEvent._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      );
      const data = await response.json();
      setEvents(
        events.map((evt) => (evt._id === data.event._id ? data.event : evt))
      );
      setFormData({ title: "", description: "", photo: null });
      setSelectedEvent(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error updating event:", error);
      setError("Failed to update event");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/events/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setEvents(events.filter((evt) => evt._id !== id));
      } else {
        setError("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event");
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      photo: null,
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedEvent(null);
    setFormData({ title: "", description: "", photo: null });
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-4 mb-11">
      <h1 className="text-4xl text-darkGray font-bold mb-6">Events</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!showForm && (
        <button
          onClick={handleAddNew}
          className="mb-6 px-4 py-2 bg-gold text-white rounded-md hover:bg-mutedGold"
        >
          Add New Event
        </button>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl text-darkGray font-semibold mb-4">
            {selectedEvent ? "Edit Event" : "Create Event"}
          </h2>
          <form
            onSubmit={selectedEvent ? handleUpdate : handleSubmit}
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
                Event Photo
              </label>
              <input
                type="file"
                name="photo"
                onChange={handleFileChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                accept="image/*"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-darkGray text-white rounded-md hover:bg-gray-700"
            >
              {selectedEvent ? "Update" : "Create"}
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

      {Array.isArray(events) && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl text-darkGray font-semibold mb-2">
                {event?.title || "No title"}
              </h3>
              <p className="text-gray-600 mb-4">
                {event?.description || "No description"}
              </p>
              {event.photo && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/${event.photo}`}
                  alt={event.title}
                  className="mb-4 w-full h-auto rounded-md"
                />
              )}
              <button
                onClick={() => handleEdit(event)}
                className="mr-4 px-4 py-2 bg-gold text-white rounded-md hover:bg-mutedGold"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default Event;
