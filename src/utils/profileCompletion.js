import { homePathFor } from "./roles";

// Fields that count toward "how complete is my profile". Name is set at
// registration, so every profile starts above zero.
export const COMPLETION_FIELDS = [
  "imageUrl",
  "name",
  "bio",
  "phone_number",
  "date_of_birth",
  "gender",
  "current_education_level",
  "linkedin_link",
  "website",
];

export function completionPercent(values = {}) {
  const filled = COMPLETION_FIELDS.filter((k) => String(values[k] ?? "").trim()).length;
  return Math.round((filled / COMPLETION_FIELDS.length) * 100);
}

// The backend keeps no "profile completed" flag: a profile still needs
// completing while all of its key contact fields are empty.
export const needsProfileCompletion = (profileUser = {}) =>
  !profileUser.phone_number && !profileUser.bio && !profileUser.linkedin_link;

// Users whose role request was approved have a home of their own; users
// still waiting (role "User" without an institute rank) land on "/".
export const hasApprovedRole = (user) => homePathFor(user) !== "/";
