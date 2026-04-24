import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AllUsers from "./AllUsers";
import StudentDetails from "./StudentDetails";

const AdminDashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories] = useState([
    { name: "Users", value: "users" },
    { name: "Reports", value: "reports" },
    { name: "Tickets", value: "tickets" },
    { name: "Certificates", value: "certificates" },
    { name: "Financial Reports", value: "financialReports" },
    { name: "Achievements", value: "userAchievements" },
    { name: "Courses", value: "courses" },
  ]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersByCategory = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/summary?category=${selectedCategory}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setLoading(false);
        setUsers(data.result);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (selectedCategory && selectedCategory !== "users") {
      fetchUsersByCategory();
    }
  }, [selectedCategory, token]);

  const getCategoryCount = (user) => {
    switch (selectedCategory) {
      case "reports":
        return user.reportCount;
      case "tickets":
        return user.ticketCount;
      case "certificates":
        return user.certificateCount;
      case "financialReports":
        return user.financialReportCount;
      case "userAchievements":
        return user.achievementCount;
      case "courses":
        return user.courseCount;
      default:
        return 0;
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Search Bar */}
      <div className="w-full mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 border border-mediumGray rounded-lg"
        />
      </div>

      {/* Filter Panel */}
      <div className="flex flex-wrap justify-center mb-8">
        {categories.map((category) => (
          <div key={category.value} className="m-2">
            <button
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category.value
                  ? "bg-gold text-white"
                  : "bg-veryLightGray text-darkGray hover:bg-gold hover:text-white"
              }`}
            >
              {category.name}
            </button>
          </div>
        ))}
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-2 m-2 rounded-lg ${
            selectedCategory === ""
              ? "bg-gold text-white"
              : "bg-veryLightGray text-darkGray hover:bg-gold hover:text-white"
          }`}
        >
          All Items
        </button>
      </div>

      {/* Display Users Summary */}
      <div className="flex flex-col space-y-4">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : selectedCategory === "users" ? (
          <AllUsers />
        ) : users.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-2">
              {categories.find((cat) => cat.value === selectedCategory)?.name}{" "}
              Summary
            </h2>
            <ul className="space-y-4">
              {users.map((user) => (
                <li
                  key={user._id}
                  className="border p-4 rounded-lg flex items-center space-x-4 cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <img
                    src={user.photoURL || "https://via.placeholder.com/50"}
                    alt={user.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block px-3 py-1 text-sm font-semibold text-white bg-lightGold rounded-full">
                      <p className="text-lg font-bold">
                        {getCategoryCount(user)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center text-mediumGray">No data available</div>
        )}
      </div>

      {/* Display User Details */}
      {selectedUser && (
        <div className="mt-8">
          <StudentDetails user={selectedUser} category={selectedCategory} />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
