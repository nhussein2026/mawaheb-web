import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AppShell } from "../components/shell/AppShell";
import { INSTITUTE_STAFF_ROLES, isInstituteStudentUser, navForUser } from "../constants/institute";
import { instituteNav, instituteStudentNav, studentNav, workspaceNav } from "../constants/navigation";
import { formatRoleAr } from "../components/admin/adminCopy";
import { homePathFor } from "../utils/roles";

// Shared account pages (My profile) render inside the signed-in user's own
// shell, so the navigation stays where they left it.
const AccountLayout = () => {
  const user = useSelector((state) => state.auth?.user);
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);
  const location = useLocation();

  const groups = useMemo(() => {
    if (!user) return [];
    if (user.role === "Admin" || user.role === "Employee") return workspaceNav(user);
    if (isInstituteStudentUser(user)) return instituteStudentNav();
    if (INSTITUTE_STAFF_ROLES.includes(user.instituteRole)) return instituteNav(user, navForUser(user));
    return studentNav(user);
  }, [user]);

  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  const home = homePathFor(user);
  return (
    <AppShell
      groups={groups}
      homeHref={home}
      title="حسابي"
      subtitle="مؤسسة مواهب"
      section={{ label: "حسابي", to: "/profile" }}
      roleLabel={formatRoleAr(user?.role)}
    >
      <Outlet />
    </AppShell>
  );
};

export default AccountLayout;
