import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { GraduationCap, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { navForUser } from "../../constants/institute";

// Institute Portal sidebar — the 14 spec tabs, each a real route. The tab set
// shown is filtered to the current user's rank (spec §3.3).
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const user = useSelector((state) => state.auth?.user || {});
  const nav = navForUser(user);
  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-[var(--color-surface-overlay)] lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 start-0 flex w-64 flex-col bg-surface-nav transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0",
          sidebarOpen ? "z-[60] translate-x-0" : "z-30 translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-brand-800 px-5">
          <NavLink
            to="/institute-admin"
            end
            className="flex items-center gap-2.5"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-800">
              <GraduationCap className="h-5 w-5 text-accent-400" aria-hidden="true" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-medium text-text-inverse">بوابة المعهد</span>
              <span className="text-[11px] font-medium tracking-[0.03em] text-brand-200">
                معهد حضرموت للموهوبين
              </span>
            </div>
          </NavLink>
          <button
            type="button"
            className="rounded-md p-1.5 text-brand-200 hover:bg-brand-800 hover:text-text-inverse lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="custom-scrollbar flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.07em] text-brand-200">
            القائمة
          </p>
          {nav.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-e-2 border-e-accent-400 bg-brand-800 text-text-inverse"
                    : "border-e-2 border-e-transparent text-brand-200 hover:bg-brand-800 hover:text-brand-100"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-text-inverse" : "text-brand-400 group-hover:text-brand-100"
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{item.label}</span>
                  {!item.ready && (
                    <span className="rounded-full bg-brand-800 px-1.5 py-0.5 text-[9px] text-brand-200">
                      قريباً
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-brand-800 p-4">
          <NavLink
            to="/"
            className="flex w-full items-center justify-center rounded-md border-[0.5px] border-brand-200 bg-brand-800 px-4 py-2 text-sm font-medium text-brand-50 transition-colors hover:bg-brand-600 hover:text-text-inverse"
            onClick={() => setSidebarOpen(false)}
          >
            العودة إلى الموقع
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
