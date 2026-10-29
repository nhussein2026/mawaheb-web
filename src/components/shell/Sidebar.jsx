import React from "react";
import { NavLink } from "react-router-dom";
import { X, PanelRightClose, PanelRightOpen } from "lucide-react";
import { cn } from "../../utils/cn";
import { Count } from "../ui/Badge";
import foundationLogo from "../../assets/logo/drklogo.webp";

/**
 * Sidebar (§4.7): Foundation logo lockup at the top, groups labelled in
 * label-sm tertiary text, 40 px items with 20 px icons. Active item:
 * brand.subtle fill, 3 px inline-start bar, brand.text at 600. The Institute
 * group carries a teal square as its scope marker. `rail` renders the 72 px
 * icon rail with tooltips.
 */
export function Sidebar({ groups, homeHref, title, subtitle, counts = {}, rail, onToggleRail, onNavigate, onClose, inDrawer }) {
  return (
    <div className="flex h-full flex-col bg-surface" data-scope="foundation">
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-3 border-b border-border-subtle",
          rail ? "justify-center px-2" : "px-4"
        )}
      >
        <NavLink
          to={homeHref}
          onClick={onNavigate}
          className="flex min-w-0 items-center gap-3 rounded-md"
          aria-label={`${title} — الرئيسية`}
        >
          <img
            src={foundationLogo}
            alt="مؤسسة مواهب"
            width="40"
            height="44"
            className="h-11 w-auto shrink-0"
          />
          {!rail ? (
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-semibold text-text-primary">{title}</span>
              {subtitle ? <span className="block truncate text-xs text-text-tertiary">{subtitle}</span> : null}
            </span>
          ) : null}
        </NavLink>
        {inDrawer ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق القائمة"
            title="إغلاق القائمة"
            className="ms-auto grid size-10 place-items-center rounded-md text-text-secondary hover:bg-subtle"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <nav aria-label="القائمة الرئيسية" className={cn("flex-1 overflow-y-auto py-3", rail ? "px-2" : "px-3")}>
        {groups.map((group, gi) => (
          <div key={group.key} data-scope={group.scope} className={cn(gi > 0 && "mt-3")}>
            {group.label ? (
              rail ? (
                <div className="mx-auto mb-1 mt-2 h-px w-8 bg-border-subtle" aria-hidden="true" />
              ) : (
                <p className="flex items-center gap-2 px-3 pb-1 pt-2 text-label-sm text-text-tertiary">
                  {group.scope === "institute" ? (
                    <span className="size-2 rounded-[2px] bg-brand-strong" aria-hidden="true" />
                  ) : null}
                  {group.label}
                </p>
              )
            ) : null}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const count = item.countKey ? counts[item.countKey] : null;
                return (
                  <li key={item.key}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={onNavigate}
                      title={rail ? item.label : undefined}
                      aria-label={rail ? item.label : undefined}
                      className={({ isActive }) =>
                        cn(
                          "relative flex h-10 items-center gap-3 rounded-md text-sm transition-colors duration-100",
                          rail ? "justify-center px-0" : "px-3",
                          isActive
                            ? "bg-brand-subtle font-semibold text-brand-text before:absolute before:inset-y-2 before:start-[-12px] before:w-[3px] before:rounded-e-[3px] before:bg-brand-strong before:content-['']"
                            : "text-text-secondary hover:bg-subtle hover:text-text-primary",
                          rail && isActive && "before:start-[-8px]"
                        )
                      }
                    >
                      <item.icon className="size-5 shrink-0" aria-hidden="true" />
                      {!rail ? <span className="min-w-0 flex-1 truncate">{item.label}</span> : null}
                      {count ? (
                        <Count
                          value={count}
                          label={`${count} بانتظار المراجعة`}
                          className={rail ? "absolute end-1 top-0.5" : ""}
                        />
                      ) : null}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {onToggleRail ? (
        <div className={cn("shrink-0 border-t border-border-subtle py-2", rail ? "px-2" : "px-3")}>
          <button
            type="button"
            onClick={onToggleRail}
            aria-label={rail ? "توسيع القائمة" : "طي القائمة"}
            title={rail ? "توسيع القائمة" : "طي القائمة"}
            className={cn(
              "flex h-10 w-full items-center gap-3 rounded-md text-sm text-text-secondary hover:bg-subtle hover:text-text-primary",
              rail ? "justify-center" : "px-3"
            )}
          >
            {rail ? (
              <PanelRightOpen className="size-5" aria-hidden="true" />
            ) : (
              <PanelRightClose className="size-5" aria-hidden="true" />
            )}
            {!rail ? <span>طي القائمة</span> : null}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default Sidebar;
