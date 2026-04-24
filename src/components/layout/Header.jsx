import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/user/authSlice";

const Header = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setNotificationsOpen(false); // Close notifications when opening profile dropdown
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setDropdownOpen(false); // Close profile dropdown when opening notifications
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
      setNotificationsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-maroon text-white p-4 top-0 left-0 right-0 z-50 h-20 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gold">
          Foundation Platform
        </Link>
        <nav className="flex items-center space-x-4">
          <div className="hidden md:flex md:items-center">
            <input
              type="text"
              placeholder="Search..."
              className="placeholder:italic placeholder:text-slate-400 px-3 py-2 border border-gold rounded-md focus:outline-none focus:ring focus:border-gold"
            />
          </div>
          {isLoggedIn ? (
            <>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-white hover:text-[#be2423] focus:outline-none"
                >
                  <span className="material-icons">account_circle</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Settings
                    </NavLink>
                    {/* {user && user.role === 'Admin' && (
                      <NavLink
                        to="/admin-dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </NavLink>
                    )} */}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={toggleNotifications}
                  className="flex items-center text-white hover:text-[#be2423] focus:outline-none"
                >
                  <span className="material-icons">notifications</span>
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-black border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          {notification.message}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-gold text-white hover:bg-mutedGold px-4 py-2 rounded-md"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
