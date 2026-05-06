import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const StudentLayout = () => {
  const user = useSelector((state) => state.auth?.user || {});
  const role = user?.role || "Institute Student";
  const isScholarship = role === "Scholarship Student";

  // Creative differentiation: Scholarship students get the prestigious Gold-tinted background
  // Institute students get the standard clean parchment background
  const pageBg = isScholarship ? "bg-accent-50" : "bg-surface-page";

  return (
    <div className={`flex flex-col min-h-screen ${pageBg} font-sans text-text-primary`} dir="rtl">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
