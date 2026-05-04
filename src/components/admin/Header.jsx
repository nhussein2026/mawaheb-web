import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { Menu, Bell, Search, User, LogOut, ChevronDown, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import { Input } from "../ui/Input";
import { formatRoleAr } from "./adminCopy";
import { logout } from "../../features/user/authSlice";
import { ROLE_REQUESTS_REFRESH_EVENT } from "./adminRoleRequestEvents";

const PATH_TITLES_AR = {
  "": "نظرة عامة",
  analytics: "التحليلات",
  users: "المستخدمون",
  "role-requests": "طلبات الأدوار",
  roles: "الأدوار والصلاحيات",
  reports: "تقارير الطلاب",
  tickets: "التذاكر",
  programs: "البرامج والمحتوى",
  financial: "السجلات المالية",
  scholarship: "عمليات المنح",
};

const panelClass =
  "absolute end-0 top-full z-[80] mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border-[0.5px] border-border-subtle bg-surface-card py-2 shadow-sm";

const TOASTED_ROLE_REQ_IDS_KEY = "mawaheb-admin-role-req-toast-ids";

function loadToastedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(TOASTED_ROLE_REQ_IDS_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveToastedIds(set) {
  localStorage.setItem(TOASTED_ROLE_REQ_IDS_KEY, JSON.stringify([...set].slice(-400)));
}

function pruneToastedIds(currentIds, toasted) {
  const cur = new Set(currentIds);
  return new Set([...toasted].filter((id) => cur.has(id)));
}

const Header = ({ setSidebarOpen }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth?.user || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleRequests, setRoleRequests] = useState([]);
  const wrapRef = useRef(null);

  const titleFromPath = () => {
    const seg = location.pathname.replace("/admin-dashboard", "").replace(/^\//, "");
    if (!seg) return PATH_TITLES_AR[""];
    const key = seg.split("/")[0];
    return PATH_TITLES_AR[key] || key;
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    navigate(`/admin-dashboard/users?search=${encodeURIComponent(trimmed)}`);
  };

  const pullRoleRequests = useCallback(async () => {
    if (!token) return [];
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/admin/role-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.success && Array.isArray(data.data) ? data.data : [];
  }, [token]);

  const applyRoleRequestList = useCallback((list, withToast) => {
    setRoleRequests(list);
    const ids = list.map((r) => r._id);
    const toasted = pruneToastedIds(ids, loadToastedIds());
    if (withToast) {
      const unseen = list.filter((r) => !toasted.has(r._id));
      if (unseen.length > 0) {
        unseen.forEach((r) => toasted.add(r._id));
        const msg =
          unseen.length === 1
            ? `طلب دور جديد من ${unseen[0].name || "مستخدم"} — بانتظار المراجعة`
            : `لديك ${unseen.length} طلبات أدوار جديدة بانتظار المراجعة`;
        toast.info(msg, {
          rtl: true,
          onClick: () => navigate("/admin-dashboard/role-requests"),
          style: { cursor: "pointer" },
        });
      }
    }
    saveToastedIds(toasted);
  }, [navigate]);

  const pollRoleRequests = useCallback(async () => {
    try {
      const list = await pullRoleRequests();
      applyRoleRequestList(list, true);
    } catch {
      /* ignore */
    }
  }, [pullRoleRequests, applyRoleRequestList]);

  const silentRefreshRoleRequests = useCallback(async () => {
    try {
      const list = await pullRoleRequests();
      applyRoleRequestList(list, false);
    } catch {
      /* ignore */
    }
  }, [pullRoleRequests, applyRoleRequestList]);

  useEffect(() => {
    if (!token) return undefined;
    pollRoleRequests();
    const interval = setInterval(pollRoleRequests, 90_000);
    return () => clearInterval(interval);
  }, [token, pollRoleRequests]);

  useEffect(() => {
    const onRefresh = () => {
      silentRefreshRoleRequests();
    };
    window.addEventListener(ROLE_REQUESTS_REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(ROLE_REQUESTS_REFRESH_EVENT, onRefresh);
  }, [silentRefreshRoleRequests]);

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setNotificationsOpen(false);
        setMenuOpen(false);
      }
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
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=EAF3EC&color=1A3A2A`;

  const pendingRoleCount = roleRequests.length;

  return (
    <header className="sticky top-0 z-[70] flex h-16 shrink-0 items-center justify-between border-b-[0.5px] border-brand-800 bg-surface-header px-4 sm:px-6 lg:px-8">
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
          <h2 className="truncate text-[15px] font-medium text-text-inverse">{titleFromPath()}</h2>
          <p className="truncate text-[11px] text-brand-200">منصة مؤسسة مواهب</p>
        </div>
      </div>

      <div className="hidden max-w-md flex-1 px-4 md:block">
        <form onSubmit={onSearchSubmit} className="relative">
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
            <Search className="h-4 w-4 text-brand-400" aria-hidden="true" />
          </div>
          <Input
            type="search"
            placeholder="البحث في المستخدمين…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-9 border-brand-700/80 bg-brand-800/50 ps-10 text-text-inverse placeholder:text-brand-200 focus-visible:ring-accent-400"
          />
        </form>
      </div>

      <div ref={wrapRef} className="relative flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="relative">
          <button
            type="button"
            className="relative rounded-full p-2 text-brand-400 transition-colors hover:bg-brand-800 hover:text-text-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            onClick={() => {
              setNotificationsOpen((o) => {
                const next = !o;
                if (next) silentRefreshRoleRequests();
                return next;
              });
              setMenuOpen(false);
            }}
            aria-expanded={notificationsOpen}
            aria-haspopup="true"
          >
            <span className="sr-only">التنبيهات</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            {pendingRoleCount > 0 ? (
              <span className="absolute end-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-400 px-1 text-[10px] font-medium text-accent-900 ring-2 ring-surface-header">
                {pendingRoleCount > 9 ? "9+" : pendingRoleCount}
              </span>
            ) : null}
          </button>
          {notificationsOpen && (
            <div className={panelClass} role="menu">
              <div className="border-b-[0.5px] border-border-subtle px-4 py-3">
                <p className="text-sm font-medium text-text-primary">التنبيهات</p>
                <p className="text-[11px] text-text-muted">
                  {pendingRoleCount > 0
                    ? `${pendingRoleCount} طلب/طلبات تعديل دور`
                    : "لا يوجد طلبات أدوار معلّقة"}
                </p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {roleRequests.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-text-secondary">لا جديد</div>
                ) : (
                  <>
                    {roleRequests.slice(0, 6).map((req) => (
                      <NavLink
                        key={req._id}
                        to="/admin-dashboard/role-requests"
                        className="flex flex-col gap-0.5 border-b-[0.5px] border-border-subtle px-4 py-3 text-start last:border-0 hover:bg-brand-50"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        <span className="flex items-center gap-2 text-sm font-medium text-text-primary">
                          <UserPlus className="h-4 w-4 shrink-0 text-brand-600" />
                          {req.name}
                        </span>
                        <span className="text-[11px] text-text-secondary">
                          يطلب: {formatRoleAr(req.requestedRole)}
                        </span>
                      </NavLink>
                    ))}
                    {roleRequests.length > 6 ? (
                      <NavLink
                        to="/admin-dashboard/role-requests"
                        className="block px-4 py-2.5 text-center text-xs font-medium text-text-brand hover:bg-brand-50"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        عرض كل الطلبات ({roleRequests.length})
                      </NavLink>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden flex-col text-start sm:flex">
          <span className="text-sm font-medium text-text-inverse">{user?.name || "مسؤول"}</span>
          <span className="text-[11px] text-brand-200">{formatRoleAr(user?.role) || "—"}</span>
        </div>

        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border-[0.5px] border-brand-600 p-0.5 pe-1 hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
            onClick={() => {
              setMenuOpen((o) => !o);
              setNotificationsOpen(false);
            }}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <span className="inline-flex h-9 w-9 overflow-hidden rounded-full">
              <img className="h-full w-full object-cover" src={avatarSrc} alt="" />
            </span>
            <ChevronDown className="hidden h-4 w-4 text-brand-200 sm:block" aria-hidden="true" />
          </button>
          {menuOpen && (
            <div className={panelClass} role="menu">
              <div className="border-b-[0.5px] border-border-subtle px-4 py-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-text-muted">الحساب</p>
                <p className="truncate text-xs text-text-primary">{user?.email}</p>
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
