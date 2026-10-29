import { INSTITUTE_STAFF_ROLES, isInstituteStudentUser } from "../constants/institute";

// Each user lands on their own home after sign-in (§5.1 "Sign in").
export function homePathFor(user) {
  if (!user) return "/login";
  if (isInstituteStudentUser(user)) return "/institute-portal";
  if (user.role === "Admin") return "/admin-dashboard";
  if (user.role === "Employee") return "/employee-dashboard";
  if (INSTITUTE_STAFF_ROLES.includes(user.instituteRole)) return "/institute-admin";
  if (user.role === "Scholarship Student") return "/student-dashboard";
  return "/";
}
