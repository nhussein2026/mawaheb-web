import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AppShell } from "../components/shell/AppShell";
import { RoleRequestBell } from "../components/shell/RoleRequestBell";
import { useRoleRequests } from "../hooks/useRoleRequests";
import { workspaceNav } from "../constants/navigation";
import { formatRoleAr } from "../components/admin/adminCopy";
import Forbidden from "../pages/Forbidden";

// Workspace shell for the platform Admin and Employees (Foundation-wide
// staff). Foundation scope: maroon and gold.
const AdminLayout = () => {
  const user = useSelector((state) => state.auth?.user);
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);
  const location = useLocation();
  const role = user?.role;
  const isAdmin = role === "Admin";
  const groups = useMemo(() => workspaceNav(user), [user]);
  const { requests, refresh } = useRoleRequests();

  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role !== "Admin" && role !== "Employee") return <Forbidden />;
  // Employees never see the Admin-only area; send them to their own home.
  if (!isAdmin && location.pathname.startsWith("/admin-dashboard")) {
    return <Navigate to="/employee-dashboard" replace />;
  }

  const home = isAdmin ? "/admin-dashboard" : "/employee-dashboard";

  return (
    <AppShell
      groups={groups}
      homeHref={home}
      title="مساحة العمل"
      subtitle="مؤسسة مواهب"
      section={{ label: "مساحة العمل", to: home }}
      roleLabel={formatRoleAr(role)}
      counts={{ roleRequests: requests.length }}
      topbarEnd={isAdmin ? <RoleRequestBell requests={requests} onOpen={refresh} /> : null}
    >
      <Outlet />
    </AppShell>
  );
};

export default AdminLayout;
