import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu as MenuIcon, Search, UserRound, LogOut } from "lucide-react";
import { cn } from "../../utils/cn";
import { logout } from "../../features/user/authSlice";
import { Avatar } from "../ui/Avatar";
import { Menu, MenuItem, MenuDivider } from "../ui/Menu";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "./CommandPalette";
import { SessionExpiredDialog } from "./SessionExpiredDialog";
import { ConfirmProvider } from "../ui/ConfirmProvider";
import { ShellContext } from "./ShellContext";
import { useMediaQuery } from "./useMediaQuery";
import Loading from "../ui/Loading";

const RAIL_KEY = "mawaheb-sidebar";

const readRailPref = () => {
  try {
    return localStorage.getItem(RAIL_KEY);
  } catch {
    return null;
  }
};

// Longest matching route wins so nested paths resolve to the right item.
function matchNavItem(groups, pathname) {
  const items = groups.flatMap((g) => g.items.map((i) => ({ ...i, groupLabel: g.label, groupScope: g.scope })));
  return (
    items
      .filter((i) => (i.end ? pathname === i.to : pathname === i.to || pathname.startsWith(`${i.to}/`)))
      .sort((a, b) => b.to.length - a.to.length)[0] || null
  );
}

/**
 * Application shell (§5.1): sidebar + 56 px top bar + main content.
 *   base–md  top bar with a menu button; navigation in a drawer
 *   lg       sidebar as a 72 px icon rail, expandable
 *   xl+      sidebar expanded (256 px); content capped at 1440 px
 * The shell always stays in Foundation scope; `scope` sets the identity of
 * the main content area only.
 */
export function AppShell({
  groups,
  homeHref,
  title,
  subtitle,
  section,
  scope = "foundation",
  scopeLabel,
  roleLabel,
  counts,
  topbarEnd,
  children,
}) {
  const user = useSelector((s) => s.auth?.user) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isLg = useMediaQuery("(min-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1280px)");
  const [railPref, setRailPref] = useState(readRailPref);
  const rail = isLg && (railPref ? railPref === "rail" : !isXl);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const current = useMemo(() => matchNavItem(groups, location.pathname), [groups, location.pathname]);

  useEffect(() => {
    document.title = current ? `${current.label} · ${title} · مواهب` : `${title} · مواهب`;
  }, [current, title]);

  // Close the drawer whenever the route changes (adjusting state during render).
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    if (drawerOpen) setDrawerOpen(false);
  }

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleRail = () => {
    const next = rail ? "expanded" : "rail";
    setRailPref(next);
    try {
      localStorage.setItem(RAIL_KEY, next);
    } catch {
      /* preference is a convenience only */
    }
  };

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  const pages = useMemo(
    () => groups.flatMap((g) => g.items.map((i) => ({ ...i, section: g.label || title }))),
    [groups, title]
  );
  const actions = useMemo(
    () => [
      { key: "profile", label: "الملف الشخصي", to: "/profile", icon: UserRound },
      { key: "logout", label: "تسجيل الخروج", run: handleLogout, icon: LogOut },
    ],
    [handleLogout]
  );

  const ctx = useMemo(
    () => ({ section: section || { label: title, to: homeHref }, current, scope, scopeLabel }),
    [section, title, homeHref, current, scope, scopeLabel]
  );

  const sidebarProps = { groups, homeHref, title, subtitle, counts };

  return (
    <ShellContext.Provider value={ctx}>
      <div className="flex min-h-dvh bg-canvas text-text-primary" dir="rtl" lang="ar" data-scope="foundation">
        <a
          href="#main"
          className="sr-only z-[1500] rounded-md bg-surface px-4 py-2 text-sm font-semibold text-brand-strong shadow-overlay focus:not-sr-only focus:fixed focus:start-4 focus:top-3"
        >
          تخطي إلى المحتوى
        </a>

        {/* Sidebar: icon rail at lg, expanded at xl */}
        <aside
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 border-e border-border-default lg:block",
            "transition-[width] duration-150 ease-[var(--ease-standard)]",
            rail ? "w-[72px]" : "w-64"
          )}
        >
          <Sidebar {...sidebarProps} rail={rail} onToggleRail={toggleRail} />
        </aside>

        {/* Drawer navigation below lg */}
        {!isLg && drawerOpen ? (
          <div className="fixed inset-0 z-[1200]" role="dialog" aria-modal="true" aria-label="القائمة الرئيسية">
            <div className="absolute inset-0 bg-backdrop" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
            <div className="absolute inset-y-0 start-0 w-[min(288px,85vw)] animate-[mw-fade-in_160ms_var(--ease-enter)] shadow-modal">
              <Sidebar
                {...sidebarProps}
                inDrawer
                onClose={() => setDrawerOpen(false)}
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-[200] flex h-14 shrink-0 items-center gap-2 border-b border-border-default bg-surface px-4 sm:gap-4 sm:px-6">
            <button
              type="button"
              className="grid size-10 shrink-0 place-items-center rounded-md text-text-secondary hover:bg-subtle lg:hidden"
              onClick={() => setDrawerOpen(true)}
              aria-label="فتح القائمة"
              title="فتح القائمة"
              aria-expanded={drawerOpen}
            >
              <MenuIcon className="size-6" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex size-10 shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md text-sm text-text-secondary hover:bg-subtle sm:h-9 sm:w-auto sm:min-w-0 sm:max-w-[420px] sm:flex-1 sm:justify-start sm:border sm:border-border-control sm:bg-surface sm:px-3 sm:text-text-tertiary sm:hover:border-neutral-600 sm:hover:bg-surface"
              aria-label="بحث (Ctrl K)"
              aria-keyshortcuts="Control+K Meta+K"
            >
              <Search className="size-5 shrink-0 sm:size-4" aria-hidden="true" />
              <span className="hidden truncate sm:inline">ابحث عن صفحة…</span>
              <kbd
                className="ms-auto hidden rounded-sm border border-border-default bg-subtle px-1.5 text-xs font-semibold text-text-tertiary md:inline"
                dir="ltr"
              >
                Ctrl K
              </kbd>
            </button>

            <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2">
              {topbarEnd}
              <Menu
                align="end"
                header={
                  <div className="border-b border-border-subtle px-4 pb-3 pt-2">
                    <p className="truncate text-sm font-semibold text-text-primary">{user.name || "—"}</p>
                    {user.email ? (
                      <p className="truncate text-xs text-text-tertiary">
                        <bdi>{user.email}</bdi>
                      </p>
                    ) : null}
                  </div>
                }
                trigger={(props) => (
                  <button
                    {...props}
                    type="button"
                    className="flex h-10 items-center gap-2 rounded-md px-1 hover:bg-subtle sm:pe-2"
                    aria-label={`حسابي: ${user.name || ""}`}
                  >
                    <Avatar name={user.name} src={user.imageUrl} size={32} />
                    <span className="hidden min-w-0 text-start leading-tight md:block">
                      <span className="block max-w-[160px] truncate text-sm font-semibold text-text-primary">
                        {user.name}
                      </span>
                      {roleLabel ? (
                        <span className="block max-w-[160px] truncate text-xs text-text-tertiary">{roleLabel}</span>
                      ) : null}
                    </span>
                  </button>
                )}
              >
                <MenuItem as={Link} to="/profile" icon={UserRound}>
                  الملف الشخصي
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={LogOut} danger onSelect={handleLogout}>
                  تسجيل الخروج
                </MenuItem>
              </Menu>
            </div>
          </header>

          <main
            id="main"
            tabIndex={-1}
            data-scope={scope}
            className="min-w-0 flex-1 px-4 py-5 outline-none sm:px-6 sm:py-6 xl:px-8 xl:py-8 2xl:px-10"
          >
            <div className="mx-auto w-full max-w-[1440px]">
              {/* Nested so confirmation dialogs pick up this shell's brand scope. */}
              <ConfirmProvider>
                <Suspense fallback={<Loading />}>{children}</Suspense>
              </ConfirmProvider>
            </div>
          </main>
        </div>

        <SessionExpiredDialog />
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} pages={pages} actions={actions} />
      </div>
    </ShellContext.Provider>
  );
}

export default AppShell;
