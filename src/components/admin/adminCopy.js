/** عناوين الأدوار للعرض — القيم المرسلة للواجهة البرمجية تبقى بالإنجليزية كما يتوقع الخادم */
export const ROLE_LABEL_AR = {
  User: "مستخدم",
  Employee: "موظف",
  Admin: "مسؤول",
  "Institute Student": "طالب معهد",
  "Scholarship Student": "طالب منحة",
};

export function formatRoleAr(role) {
  return ROLE_LABEL_AR[role] || role;
}
