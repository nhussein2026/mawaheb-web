import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state) => state.auth?.user || {});
  const role = user?.role || "Employee";
  const isAdmin = role === "Admin";

  // Creative differentiation: Employee gets clean white card background, Admin gets standard parchment
  const pageBg = isAdmin ? "bg-surface-page" : "bg-neutral-50";

  return (
    <div
      className={`flex h-[100dvh] min-h-0 ${pageBg} text-text-primary`}
      dir="rtl"
      lang="ar"
    >
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative z-40 flex min-h-0 min-w-0 flex-1 flex-col">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
