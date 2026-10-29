import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AppShell } from "../components/shell/AppShell";
import { studentNav } from "../constants/navigation";
import { formatRoleAr } from "../components/admin/adminCopy";

// Student portal (Scholarship students and general users). Student-facing
// portals use the Foundation identity.
const StudentLayout = () => {
  const user = useSelector((state) => state.auth?.user);
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);
  const location = useLocation();
  const groups = useMemo(() => studentNav(user), [user]);

  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return (
    <AppShell
      groups={groups}
      homeHref="/student-dashboard"
      title="بوابة الطالب"
      subtitle="مؤسسة مواهب"
      section={{ label: "بوابة الطالب", to: "/student-dashboard" }}
      roleLabel={formatRoleAr(user?.role)}
    >
      <Outlet />
    </AppShell>
  );
};

export default StudentLayout;
