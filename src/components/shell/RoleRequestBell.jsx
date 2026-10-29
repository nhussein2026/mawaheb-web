import React from "react";
import { Link } from "react-router-dom";
import { Bell, UserPlus } from "lucide-react";
import { Menu, MenuItem } from "../ui/Menu";
import { formatRoleAr } from "../admin/adminCopy";

export function RoleRequestBell({ requests, onOpen }) {
  const count = requests.length;
  return (
    <Menu
      align="end"
      width="w-80"
      header={
        <div className="border-b border-border-subtle px-4 pb-3 pt-2">
          <p className="text-sm font-semibold text-text-primary">التنبيهات</p>
          <p className="text-xs text-text-tertiary">
            {count ? `${count} طلبات أدوار بانتظار المراجعة` : "لا توجد طلبات أدوار معلّقة"}
          </p>
        </div>
      }
      trigger={(props) => (
        <button
          {...props}
          onClick={(e) => {
            props.onClick(e);
            onOpen?.();
          }}
          type="button"
          className="relative grid size-10 place-items-center rounded-md text-text-secondary hover:bg-subtle"
          aria-label={count ? `التنبيهات، ${count} غير مقروءة` : "التنبيهات"}
          title="التنبيهات"
        >
          <Bell className="size-5" aria-hidden="true" />
          {count ? (
            <span className="num absolute end-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-strong px-1 text-xs font-semibold text-brand-on-strong">
              {count > 99 ? "99+" : count}
            </span>
          ) : null}
        </button>
      )}
    >
      {count === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-text-secondary">لا جديد</p>
      ) : (
        <>
          {requests.slice(0, 6).map((r) => (
            <MenuItem key={r._id} as={Link} to="/admin-dashboard/role-requests" icon={UserPlus} className="min-h-14">
              <span className="block truncate font-semibold">{r.name}</span>
              <span className="block truncate text-xs text-text-tertiary">
                يطلب: {formatRoleAr(r.requestedRole)}
              </span>
            </MenuItem>
          ))}
          <MenuItem as={Link} to="/admin-dashboard/role-requests" className="justify-center font-semibold text-brand-strong">
            عرض كل الطلبات
          </MenuItem>
        </>
      )}
    </Menu>
  );
}
