import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AppShell } from "../components/shell/AppShell";
import { isInstituteStudentUser } from "../constants/institute";
import { instituteStudentNav } from "../constants/navigation";
import Forbidden from "../pages/Forbidden";

// Institute student portal. Access is limited to institute students; like
// every student-facing portal it uses the Foundation identity.
const InstituteStudentLayout = () => {
  const user = useSelector((state) => state.auth?.user);
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);
  const location = useLocation();
  const groups = useMemo(() => instituteStudentNav(), []);

  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!isInstituteStudentUser(user)) return <Forbidden grantedBy="إدارة المعهد" />;

  return (
    <AppShell
      groups={groups}
      homeHref="/institute-portal"
      title="بوابة الطالب"
      subtitle="معهد حضرموت للموهوبين"
      section={{ label: "بوابة الطالب", to: "/institute-portal" }}
      roleLabel="طالب معهد"
    >
      <Outlet />
    </AppShell>
  );
};

export default InstituteStudentLayout;
