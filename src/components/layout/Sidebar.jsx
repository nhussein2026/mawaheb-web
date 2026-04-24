import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = ({ userType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/student-report", label: "Student Report" },
    { to: "/student/courses", label: "Courses" },
    { to: "/student/events", label: "Events" },
    { to: "/student/tickets", label: "Tickets" },
    { to: "/notes", label: "Notes" },
    { to: "/student/achievements", label: "Achievements" },
    { to: "/student/certificates", label: "Certificates" },
    { to: "/student/difficulties", label: "Difficulties" },
    { to: "/student/financial-report", label: "Financial Report" },
    {
      to: "/student/scholarship-student-form",
      label: "Scholarship Student Information form",
    },
    { to: "/semester-list", label: "Semester List" },
    { to: "/try-report", label: "Try Report" },
    { to: "/try-report-list", label: "Try Report List" },
  ];

  return (
    <div className="relative">
      <button
        className="p-2 bg-gold rounded text-white fixed top-24 left-4 z-20 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-lightGray p-4 shadow-lg transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:transform-none md:relative md:translate-x-0 z-50`}
      >
        <div className="flex justify-between items-center mb-6">
          <button
            className="md:hidden p-2 rounded bg-darkRed text-white"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes />
          </button>
        </div>
        <ul>
          {links.map((link) => (
            <li key={link.to} className="mb-4">
              <Link
                to={link.to}
                className="block py-2 px-4 text-gold hover:bg-gold hover:text-white rounded transition-colors"
                onClick={() => setIsOpen(false)} // Close sidebar when a link is clicked
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
