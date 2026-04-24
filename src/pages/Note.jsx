import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const NotePage = () => {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [selectedNote, setSelectedNote] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/notes`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setNotes(data);
        } else {
          setNotes([]);
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
        setError('Failed to load notes');
      }
    };

    fetchNotes();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, user: user.id }),
      });
      const data = await response.json();
      if (data && data.note) {
        setNotes([...notes, data.note]);
        setFormData({ title: '', content: '' });
        setShowForm(false);
      } else {
        setError('Failed to create note');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      setError('Failed to create note');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notes/${selectedNote._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data && data.note) {
        setNotes(notes.map((note) => (note._id === data.note._id ? data.note : note)));
        setFormData({ title: '', content: '' });
        setSelectedNote(null);
        setShowForm(false);
      } else {
        setError('Failed to update note');
      }
    } catch (error) {
      console.error('Error updating note:', error);
      setError('Failed to update note');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setNotes(notes.filter((note) => note._id !== id));
      } else {
        setError('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note');
    }
  };

  const handleEdit = (note) => {
    setSelectedNote(note);
    setFormData({ title: note.title, content: note.content });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedNote(null);
    setFormData({ title: '', content: '' });
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl text-darkGray font-bold mb-6">Notes</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!showForm && (
        <button
          onClick={handleAddNew}
          className="mb-6 px-4 py-2 bg-gold text-white rounded-md hover:bg-mutedGold"
        >
          Add New Note
        </button>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl text-darkGray font-semibold mb-4">
            {selectedNote ? 'Edit Note' : 'Create Note'}
          </h2>
          <form onSubmit={selectedNote ? handleUpdate : handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Title</label>
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
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                name="content"
                value={formData.content}
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
              {selectedNote ? 'Update' : 'Create'}
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

      {Array.isArray(notes) && notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl text-darkGray font-semibold mb-2">{note.title}</h3>
              <p className="text-gray-600 mb-4">{note.content}</p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(note)}
                  className="px-4 py-2 bg-gold text-white rounded-md hover:bg-mutedGold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No notes available. Add some notes!</p>
      )}
    </div>
  );
};

export default NotePage;
