import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "../../utils/cn";
import { homePathFor } from "../../utils/roles";
import foundationLogo from "../../assets/logo/drklogo.webp";

const linkCls = ({ isActive }) =>
  cn(
    "inline-flex h-10 items-center rounded-md px-3 text-sm transition-colors",
    isActive ? "font-semibold text-brand-text" : "text-text-secondary hover:bg-subtle hover:text-text-primary"
  );

// Public header (Foundation identity): logo lockup, a few links, and one
// action — sign in, or back to the user's own space when signed in.
const Header = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="sticky top-0 z-[200] border-b border-border-default bg-surface">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-2 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-3 rounded-md" aria-label="مؤسسة مواهب — الرئيسية">
          <img src={foundationLogo} alt="" width="40" height="44" className="h-11 w-auto" />
          <span className="hidden font-display text-base font-bold text-text-primary sm:block">منصة مواهب</span>
        </Link>
        <nav aria-label="روابط الموقع" className="ms-auto flex items-center gap-1">
          <NavLink to="/about" className={linkCls}>
            عن المؤسسة
          </NavLink>
          <NavLink to="/contact" className={cn(linkCls({ isActive: false }), "hidden sm:inline-flex")}>
            تواصل معنا
          </NavLink>
          {isLoggedIn ? (
            <Link
              to={homePathFor(user)}
              className="ms-1 inline-flex h-10 items-center rounded-md bg-brand-strong px-4 text-sm font-semibold text-brand-on-strong hover:bg-brand-strong-hover"
            >
              مساحتي
            </Link>
          ) : (
            <Link
              to="/login"
              className="ms-1 inline-flex h-10 items-center rounded-md border border-border-control bg-surface px-4 text-sm font-semibold text-text-primary hover:bg-subtle"
            >
              تسجيل الدخول
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
