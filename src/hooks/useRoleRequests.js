import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ROLE_REQUESTS_REFRESH_EVENT } from "../components/admin/adminRoleRequestEvents";

const TOASTED_KEY = "mawaheb-admin-role-req-toast-ids";

const loadToasted = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(TOASTED_KEY) || "[]"));
  } catch {
    return new Set();
  }
};

const saveToasted = (set) => {
  try {
    localStorage.setItem(TOASTED_KEY, JSON.stringify([...set].slice(-400)));
  } catch {
    /* convenience only */
  }
};

/**
 * Pending role requests for administrators, polled every 90 s. The bell shows
 * the unread count (up to "99+") and the count is shared with the sidebar
 * through `onCount`. New requests are announced once with a toast.
 */
export function useRoleRequests() {
  const token = useSelector((s) => s.auth.token);
  const role = useSelector((s) => s.auth?.user?.role);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  const pull = useCallback(
    async (withToast) => {
      if (!token) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/user/admin/role-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const list = data.success && Array.isArray(data.data) ? data.data : [];
        setRequests(list);
        const ids = new Set(list.map((r) => r._id));
        const toasted = new Set([...loadToasted()].filter((id) => ids.has(id)));
        if (withToast) {
          const unseen = list.filter((r) => !toasted.has(r._id));
          if (unseen.length) {
            unseen.forEach((r) => toasted.add(r._id));
            toast.info(
              unseen.length === 1
                ? `طلب دور جديد من ${unseen[0].name || "مستخدم"} بانتظار المراجعة`
                : `${unseen.length} طلبات أدوار جديدة بانتظار المراجعة`,
              { onClick: () => navigate("/admin-dashboard/role-requests") }
            );
          }
        }
        saveToasted(toasted);
      } catch {
        /* network failure: keep the last known list */
      }
    },
    [token, navigate]
  );

  useEffect(() => {
    if (!token || role !== "Admin") return undefined;
    const first = setTimeout(() => pull(true), 0);
    const interval = setInterval(() => pull(true), 90_000);
    const onRefresh = () => pull(false);
    window.addEventListener(ROLE_REQUESTS_REFRESH_EVENT, onRefresh);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
      window.removeEventListener(ROLE_REQUESTS_REFRESH_EVENT, onRefresh);
    };
  }, [token, role, pull]);

  return { requests, refresh: () => pull(false) };
}

