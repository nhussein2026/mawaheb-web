import { useSelector } from "react-redux";
import { adminApi } from "../services/api/adminApi";
import { useResource } from "./useResource";

const LOADING = { stats: "loading", roles: "loading", financial: "loading" };

// Admin overview data. Each source settles on its own so one failure shows a
// Retry on its card while the rest of the dashboard still renders (§5.1).
export const useAdminStats = () => {
  const token = useSelector((state) => state.auth?.token);

  const { data, status: overall, reload } = useResource(
    async () => {
      if (!token) return null;
      const [statsRes, rrRes, finRes] = await Promise.allSettled([
        adminApi.getStats(),
        adminApi.getRoleRequests(),
        adminApi.getFinancialReports(),
      ]);
      const list =
        rrRes.status === "fulfilled" && rrRes.value.data?.success && Array.isArray(rrRes.value.data.data)
          ? rrRes.value.data.data
          : [];
      return {
        stats: statsRes.status === "fulfilled" ? statsRes.value.data : null,
        pendingRoleRequests: rrRes.status === "fulfilled" ? list.length : null,
        financialCount:
          finRes.status === "fulfilled" ? (Array.isArray(finRes.value.data) ? finRes.value.data.length : 0) : null,
        status: {
          stats: statsRes.status === "fulfilled" ? "ready" : "failed",
          roles: rrRes.status === "fulfilled" ? "ready" : "failed",
          financial: finRes.status === "fulfilled" ? "ready" : "failed",
        },
      };
    },
    [token],
    { initial: null, select: (d) => d }
  );

  return {
    stats: data?.stats ?? null,
    pendingRoleRequests: data?.pendingRoleRequests ?? null,
    financialCount: data?.financialCount ?? null,
    status: overall === "ready" && data ? data.status : LOADING,
    reload,
  };
};
