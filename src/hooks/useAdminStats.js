import { useState, useEffect } from 'react';
import { adminApi } from '../services/api/adminApi';
import { useSelector } from 'react-redux';

export const useAdminStats = () => {
  const token = useSelector((state) => state.auth?.token);
  const [stats, setStats] = useState(null);
  const [pendingRoleRequests, setPendingRoleRequests] = useState(null);
  const [financialCount, setFinancialCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, rrRes, finRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.getRoleRequests(),
          adminApi.getFinancialReports(),
        ]);

        setStats(statsRes.data);

        const list = rrRes.data.success && Array.isArray(rrRes.data.data) ? rrRes.data.data : [];
        setPendingRoleRequests(list.length);

        setFinancialCount(Array.isArray(finRes.data) ? finRes.data.length : 0);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || "حدث خطأ غير متوقع");
      } finally {
        setLoading(false);
      }
    };

    if (token) load();
    else setLoading(false);
  }, [token]);

  return { stats, pendingRoleRequests, financialCount, loading, error };
};
