import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/institute/Sidebar";
import Header from "../components/institute/Header";
import { INSTITUTE_STAFF_ROLES } from "../constants/institute";

// Layout shell for the Institute Portal admin area. Access is open to the
// platform Admin or any institute staff rank; the sidebar (and backend guards)
// then scope what each rank can see and do (spec §3.3).
const InstituteAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state) => state.auth?.user || {});
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

  const canAccess =
    user?.role === "Admin" || INSTITUTE_STAFF_ROLES.includes(user?.instituteRole);

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!canAccess) return <Navigate to="/" replace />;

  return (
    <div
      className="flex h-[100dvh] min-h-0 bg-surface-page text-text-primary"
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

export default InstituteAdminLayout;
