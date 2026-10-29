import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AppShell } from "../components/shell/AppShell";
import AcademicYearSwitcher from "../components/institute/AcademicYearSwitcher";
import { INSTITUTE_STAFF_ROLES, navForUser, roleLabel } from "../constants/institute";
import { instituteNav } from "../constants/navigation";
import { formatRoleAr } from "../components/admin/adminCopy";
import Forbidden from "../pages/Forbidden";

// Institute staff portal. The shell stays in Foundation scope; the main
// content area wears the Institute identity (teal and lime, §2.6). Access is
// open to the platform Admin or any institute staff rank; the sidebar (and
// backend guards) then scope what each rank can see and do.
const InstituteAdminLayout = () => {
  const user = useSelector((state) => state.auth?.user);
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);
  const location = useLocation();
  const groups = useMemo(() => instituteNav(user, navForUser(user)), [user]);

  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  const canAccess = user?.role === "Admin" || INSTITUTE_STAFF_ROLES.includes(user?.instituteRole);
  if (!canAccess) return <Forbidden grantedBy="المشرف العام للمعهد" />;

  return (
    <AppShell
      groups={groups}
      homeHref="/institute-admin"
      title="بوابة المعهد"
      subtitle="معهد حضرموت للموهوبين"
      section={{ label: "المعهد", to: "/institute-admin" }}
      scope="institute"
      scopeLabel="المعهد"
      roleLabel={user?.instituteRole ? roleLabel(user.instituteRole) : formatRoleAr(user?.role)}
      topbarEnd={<AcademicYearSwitcher />}
    >
      <Outlet />
    </AppShell>
  );
};

export default InstituteAdminLayout;
