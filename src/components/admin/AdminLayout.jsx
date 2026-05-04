import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="flex h-[100dvh] min-h-0 bg-surface-page text-text-primary"
      dir="rtl"
      lang="ar"
    >
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* عمود المحتوى فوق الشريط الجانبي (عند إغلاق القائمة على الجوال) حتى تظهر القوائم المنسدلة فوقه */}
      <div className="relative z-40 flex min-h-0 min-w-0 flex-1 flex-col">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
