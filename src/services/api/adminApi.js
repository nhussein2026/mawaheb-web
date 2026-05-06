import axiosClient from './axiosClient';

export const adminApi = {
  getStats: () => axiosClient.get('/stats/admin'),
  getRoleRequests: () => axiosClient.get('/user/admin/role-requests'),
  getFinancialReports: () => axiosClient.get('/financial-report'),
};
