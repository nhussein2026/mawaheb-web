import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { Menu, User, LogOut, ChevronDown } from "lucide-react";
import { logout } from "../../features/user/authSlice";
import { INSTITUTE_NAV } from "../../constants/institute";
import AcademicYearSwitcher from "./AcademicYearSwitcher";

const Header = ({ setSidebarOpen }) => {
  const user = useSelector((state) => state.auth?.user || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef(null);

  const currentTitle = () => {
    const path = location.pathname;
    // Longest matching route wins so nested paths resolve to the right tab.
    const match = [...INSTITUTE_NAV]
      .filter((n) => (n.end ? path === n.to : path.startsWith(n.to)))
      .sort((a, b) => b.to.length - a.to.length)[0];
    return match ? match.label : "بوابة المعهد";
  };

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  const avatarSrc =
    user?.imageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "Admin"
    )}&background=EAF3EC&color=1A3A2A`;

  return (
    <header className="sticky top-0 z-[70] flex h-16 shrink-0 items-center justify-between gap-3 border-b-[0.5px] border-brand-800 bg-surface-header px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="shrink-0 rounded-md p-2 text-brand-200 hover:bg-brand-800 hover:text-text-inverse lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">فتح القائمة</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <h2 className="truncate text-[15px] font-medium text-text-inverse">{currentTitle()}</h2>
          <p className="truncate text-[11px] text-brand-200">معهد حضرموت للموهوبين</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <AcademicYearSwitcher />

        <div ref={wrapRef} className="relative">
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border-[0.5px] border-brand-600 p-0.5 pe-1 hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <span className="inline-flex h-9 w-9 overflow-hidden rounded-full">
              <img className="h-full w-full object-cover" src={avatarSrc} alt="" />
            </span>
            <ChevronDown className="hidden h-4 w-4 text-brand-200 sm:block" aria-hidden="true" />
          </button>
          {menuOpen && (
            <div className="absolute end-0 top-full z-[80] mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-lg border-[0.5px] border-border-subtle bg-surface-card py-2 shadow-sm">
              <div className="border-b-[0.5px] border-border-subtle px-4 py-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-text-muted">الحساب</p>
                <p className="truncate text-sm text-text-primary">{user?.name}</p>
                <p className="truncate text-xs text-text-secondary">{user?.email}</p>
              </div>
              <NavLink
                to="/profile"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:bg-brand-50"
                onClick={() => setMenuOpen(false)}
              >
                <User className="h-4 w-4 shrink-0" />
                الملف الشخصي
              </NavLink>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2.5 text-start text-sm text-error-text hover:bg-error-bg"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
