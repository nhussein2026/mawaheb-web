import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/user/authSlice";

const Header = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    setDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
      setNotificationsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-surface-header text-text-inverse h-16 sticky top-0 z-50 border-b border-brand-900 shadow-sm backdrop-blur-md bg-opacity-95">
      <div className="container mx-auto px-4 h-full flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-accent-400 shadow-lg shadow-brand-900/40">
            <span className="font-bold text-xl">M</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-accent-100 hidden sm:block">
            منصة مواهب
          </span>
        </Link>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative group">
            <input
              type="text"
              placeholder="البحث عن..."
              className="w-full bg-brand-900/40 border border-brand-800 rounded-xl px-10 py-1.5 text-sm text-brand-50 placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-accent-400/50 transition-all text-right"
              dir="rtl"
            />
            <span className="material-icons absolute right-3 top-1.5 text-brand-400 text-lg group-focus-within:text-accent-400">search</span>
          </div>
        </div>

        <nav className="flex items-center gap-2 sm:gap-4" dir="rtl">
          {isLoggedIn ? (
            <>
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={toggleNotifications}
                  className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-brand-800 transition-colors relative"
                >
                  <span className="material-icons text-brand-200">notifications</span>
                  {notifications.length > 0 && (
                    <span className="absolute top-2 left-2 w-2 h-2 bg-accent-400 rounded-full border-2 border-surface-header"></span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-surface-card border border-border-subtle rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="p-4 bg-neutral-50 border-b border-border-subtle flex justify-between items-center">
                      <span className="font-bold text-text-primary text-sm">التنبيهات</span>
                      <span className="text-[10px] text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full font-bold uppercase">جديد</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <div key={index} className="p-4 border-b border-border-subtle last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer text-right">
                            <p className="text-xs text-text-secondary">{notification.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <span className="material-icons text-neutral-200 text-4xl mb-2">notifications_none</span>
                          <p className="text-sm text-text-muted">لا توجد تنبيهات جديدة</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 pr-2 pl-1 py-1 rounded-xl hover:bg-brand-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-400 flex items-center justify-center text-accent-900 font-bold text-sm">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <span className="text-sm font-medium text-brand-50 hidden sm:block truncate max-w-[120px]">{user?.name}</span>
                  <span className="material-icons text-brand-400 text-lg">expand_more</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface-card border border-border-subtle rounded-2xl shadow-2xl py-2 z-50 text-right">
                    <div className="px-4 py-2 border-b border-border-subtle mb-1">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">الحساب</p>
                      <p className="text-xs font-medium text-text-primary truncate">{user?.email}</p>
                    </div>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isActive ? 'bg-brand-50 text-brand-700 font-bold' : 'text-text-secondary hover:bg-neutral-50'}`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="material-icons text-lg">person</span>
                      الملف الشخصي
                    </NavLink>
                    <NavLink
                      to="/settings"
                      className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${isActive ? 'bg-brand-50 text-brand-700 font-bold' : 'text-text-secondary hover:bg-neutral-50'}`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="material-icons text-lg">settings</span>
                      الإعدادات
                    </NavLink>
                    <div className="h-px bg-border-subtle my-1 mx-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-right px-4 py-2.5 text-sm text-error-text hover:bg-error-bg transition-colors"
                    >
                      <span className="material-icons text-lg">logout</span>
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-accent-400 text-accent-900 hover:bg-accent-200 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent-900/20"
            >
              تسجيل الدخول
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
