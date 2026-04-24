import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const EditProfileModal = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState({ ...profile });
  const [previewImage, setPreviewImage] = useState(profile.imageUrl || '');

  useEffect(() => {
    setFormData({ ...profile });
    setPreviewImage(profile.imageUrl || '');
  }, [profile]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new object excluding 'role' and 'email'
    const { role, email, ...editableData } = formData;

    // If password is empty, remove it from the payload
    if (!editableData.password) {
      delete editableData.password;
    }

    onSave(editableData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[80vh]">
          {/* Profile Image Preview */}
          <div className="flex justify-center">
            <img
              src={previewImage || "/default-profile.png"}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover shadow-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Change Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-white hover:file:bg-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-gold focus:ring focus:ring-gold focus:ring-opacity-50"
            />
          </div>
          {/* Email - Read-Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed"
            />
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-gold focus:ring focus:ring-gold focus:ring-opacity-50"
            />
            <p className="text-sm text-gray-500 mt-1">Leave blank to keep current password.</p>
          </div>
          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-gold focus:ring focus:ring-gold focus:ring-opacity-50"
            ></textarea>
          </div>
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-gold focus:ring focus:ring-gold focus:ring-opacity-50"
            />
          </div>
          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth ? formData.date_of_birth.substr(0, 10) : ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-gold focus:ring focus:ring-gold focus:ring-opacity-50"
            />
          </div>
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-gold focus:ring focus:ring-gold focus:ring-opacity-50"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* Current Education Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Education Level</label>
            <input
              type="text"
              name="current_education_level"
              value={formData.current_education_level}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-gold focus:ring focus:ring-gold focus:ring-opacity-50"
            />
          </div>
          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
            <input
              type="text"
              name="linkedin_link"
              value={formData.linkedin_link}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-gold focus:ring focus:ring-gold focus:ring-opacity-50"
            />
          </div>
          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-gold focus:ring focus:ring-gold focus:ring-opacity-50"
            />
          </div>
          {/* Role - Read-Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              disabled
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm cursor-not-allowed"
            />
          </div>
          {/* Save Changes Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gold hover:bg-mutedGold text-white py-2 px-4 rounded-md transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
