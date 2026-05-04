/** يُطلق بعد تحديث قائمة طلبات الأدوار (قبول/رفض) لتحديث شارة الإشعارات في الشريط العلوي */
export const ROLE_REQUESTS_REFRESH_EVENT = "mawaheb-admin-role-requests-refresh";

export function dispatchRoleRequestsRefresh() {
  window.dispatchEvent(new CustomEvent(ROLE_REQUESTS_REFRESH_EVENT));
}
