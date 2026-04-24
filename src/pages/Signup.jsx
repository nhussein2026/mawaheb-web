import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [success, setSuccess] = useState(""); // State for tracking registration success
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setError("Invalid email address");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSuccess("Signup successfully!!");
        navigate("/login");
      } else {
        setError(data.message || "An error occurred during signup!!");
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-veryLightGray">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center text-darkGray mb-6">
          Register
        </h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-gold"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-gold"
            />
            {/* {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}/ */}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gold text-white py-2 px-4 rounded hover:bg-mutedGold"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="text-gold">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
