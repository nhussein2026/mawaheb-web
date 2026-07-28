import axiosClient from "./axiosClient";

// API surface for the Institute Portal. All calls hit the backend `/institute`
// namespace; the token is attached by axiosClient's request interceptor.
// `year` is the selected AcademicYear _id or "all" (cumulative).

const withYear = (params = {}, year) =>
  year ? { ...params, academicYear: year } : params;

export const instituteApi = {
  // Dashboard
  getDashboard: (year) =>
    axiosClient.get("/institute/dashboard", { params: withYear({}, year) }),

  // Academic years
  listYears: () => axiosClient.get("/institute/academic-years"),
  createYear: (body) => axiosClient.post("/institute/academic-years", body),
  updateYear: (id, body) =>
    axiosClient.put(`/institute/academic-years/${id}`, body),
  deleteYear: (id) => axiosClient.delete(`/institute/academic-years/${id}`),
  saveTrainingWindow: (id, body) =>
    axiosClient.put(`/institute/academic-years/${id}/training`, body),

  // Student promotion
  getPromotableStudents: (level) =>
    axiosClient.get("/institute/students/promotable", {
      params: level ? { level } : {},
    }),
  promoteStudents: (studentIds, targetLevel) =>
    axiosClient.post("/institute/students/promote", { studentIds, targetLevel }),

  // Members & trainers
  getMemberStats: () => axiosClient.get("/institute/members/stats"),
  listMembers: (params, year) =>
    axiosClient.get("/institute/members", { params: withYear(params, year) }),
  getMember: (id) => axiosClient.get(`/institute/members/${id}`),
  createMember: (body) => axiosClient.post("/institute/members", body),
  updateMember: (id, body) => axiosClient.put(`/institute/members/${id}`, body),
  deleteMember: (id) => axiosClient.delete(`/institute/members/${id}`),

  // Announcements (§4)
  getAnnouncements: (params, year) =>
    axiosClient.get("/institute/announcements", {
      params: withYear(params, year),
    }),
  createAnnouncement: (body) =>
    axiosClient.post("/institute/announcements", body),
  updateAnnouncement: (id, body) =>
    axiosClient.put(`/institute/announcements/${id}`, body),
  deleteAnnouncement: (id) =>
    axiosClient.delete(`/institute/announcements/${id}`),

  // Behavior log (§10)
  getBehaviorStats: (year) =>
    axiosClient.get("/institute/behavior/stats", { params: withYear({}, year) }),
  listBehavior: (params, year) =>
    axiosClient.get("/institute/behavior", { params: withYear(params, year) }),
  createBehavior: (formData) =>
    axiosClient.post("/institute/behavior", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteBehavior: (id) => axiosClient.delete(`/institute/behavior/${id}`),

  // Leave requests (§11)
  getLeaveStats: (year) =>
    axiosClient.get("/institute/leave/stats", { params: withYear({}, year) }),
  listLeave: (params, year) =>
    axiosClient.get("/institute/leave", { params: withYear(params, year) }),
  createLeave: (body) => axiosClient.post("/institute/leave", body),
  processLeave: (id, body) =>
    axiosClient.put(`/institute/leave/${id}/decision`, body),
  updateLeaveGate: (id, body) =>
    axiosClient.put(`/institute/leave/${id}/gate`, body),

  // Academic results (§6)
  listResults: (params, year) =>
    axiosClient.get("/institute/results", { params: withYear(params, year) }),
  createResult: (formData) =>
    axiosClient.post("/institute/results", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteResult: (id) => axiosClient.delete(`/institute/results/${id}`),

  // Evaluation reports (§7)
  listEvaluations: (params, year) =>
    axiosClient.get("/institute/evaluations", {
      params: withYear(params, year),
    }),
  createEvaluation: (formData) =>
    axiosClient.post("/institute/evaluations", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteEvaluation: (id) => axiosClient.delete(`/institute/evaluations/${id}`),

  // Courses & programs (§8)
  getCourseStats: (year) =>
    axiosClient.get("/institute/courses/stats", { params: withYear({}, year) }),
  listCourses: (year) =>
    axiosClient.get("/institute/courses", { params: withYear({}, year) }),
  createCourse: (body) => axiosClient.post("/institute/courses", body),
  updateCourse: (id, body) =>
    axiosClient.put(`/institute/courses/${id}`, body),
  deleteCourse: (id) => axiosClient.delete(`/institute/courses/${id}`),
  issueCertificates: (id) =>
    axiosClient.post(`/institute/courses/${id}/issue-certificates`),

  // Achievements (§12)
  getAchievementStats: (year) =>
    axiosClient.get("/institute/achievements/stats", {
      params: withYear({}, year),
    }),
  listAchievements: (params, year) =>
    axiosClient.get("/institute/achievements", {
      params: withYear(params, year),
    }),
  judgeAchievement: (id, body) =>
    axiosClient.put(`/institute/achievements/${id}/judge`, body),

  // Ideas bank (§13)
  getIdeaStats: (year) =>
    axiosClient.get("/institute/ideas/stats", { params: withYear({}, year) }),
  listIdeas: (params, year) =>
    axiosClient.get("/institute/ideas", { params: withYear(params, year) }),
  createIdea: (body) => axiosClient.post("/institute/ideas", body),
  judgeIdea: (id, body) => axiosClient.put(`/institute/ideas/${id}/judge`, body),

  // Fees & installments (§14)
  getFeeStats: (year) =>
    axiosClient.get("/institute/fees/stats", { params: withYear({}, year) }),
  listFees: (year) =>
    axiosClient.get("/institute/fees", { params: withYear({}, year) }),
  setFeeTotal: (studentId, body) =>
    axiosClient.put(`/institute/fees/${studentId}`, body),
  toggleInstallment: (id) =>
    axiosClient.put(`/institute/fees/installments/${id}/toggle`),

  // Correspondence & tickets (§9)
  getCorrespondenceStats: () => axiosClient.get("/institute/correspondence/stats"),
  listCorrespondence: (params) =>
    axiosClient.get("/institute/correspondence", { params }),
  getCorrespondenceThread: (id) =>
    axiosClient.get(`/institute/correspondence/${id}`),
  createCorrespondence: (formData) =>
    axiosClient.post("/institute/correspondence", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  replyCorrespondence: (id, formData) =>
    axiosClient.post(`/institute/correspondence/${id}/reply`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  setCorrespondenceStatus: (id, body) =>
    axiosClient.put(`/institute/correspondence/${id}/status`, body),

  // Bug reports (§5)
  getBugStats: () => axiosClient.get("/institute/bugs/stats"),
  listBugs: (params) => axiosClient.get("/institute/bugs", { params }),
  getBugThread: (id) => axiosClient.get(`/institute/bugs/${id}`),
  createBug: (formData) =>
    axiosClient.post("/institute/bugs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  replyBug: (id, formData) =>
    axiosClient.post(`/institute/bugs/${id}/reply`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  setBugStatus: (id, body) =>
    axiosClient.put(`/institute/bugs/${id}/status`, body),

  // ── Student self-service (spec §6 "student face") ──────────
  getMyOverview: () => axiosClient.get("/institute/me/overview"),
  getMyAnnouncements: () => axiosClient.get("/institute/me/announcements"),
  getMyResults: () => axiosClient.get("/institute/me/results"),
  getMyEvaluations: () => axiosClient.get("/institute/me/evaluations"),
  getMyBehavior: () => axiosClient.get("/institute/me/behavior"),
  getMyLeave: () => axiosClient.get("/institute/me/leave"),
  getMyIdeas: () => axiosClient.get("/institute/me/ideas"),
  getMyAchievements: () => axiosClient.get("/institute/me/achievements"),
  getMyCourses: () => axiosClient.get("/institute/me/courses"),
  getMyCertificates: () => axiosClient.get("/institute/me/certificates"),
  getMyFees: () => axiosClient.get("/institute/me/fees"),
  submitLeave: (body) => axiosClient.post("/institute/leave", body),
  submitIdea: (body) => axiosClient.post("/institute/ideas", body),
  submitAchievement: (formData) =>
    axiosClient.post("/institute/achievements", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  // Student correspondence & bug threads
  getMyCorrespondence: () => axiosClient.get("/institute/me/correspondence"),
  createMyCorrespondence: (formData) =>
    axiosClient.post("/institute/me/correspondence", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getMyBugs: () => axiosClient.get("/institute/me/bugs"),
  createMyBug: (formData) =>
    axiosClient.post("/institute/me/bugs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getMyThread: (id) => axiosClient.get(`/institute/me/threads/${id}`),
  replyMyThread: (id, formData) =>
    axiosClient.post(`/institute/me/threads/${id}/reply`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Lookups
  listBatches: () => axiosClient.get("/institute/batches"),
  listStudents: (batch) =>
    axiosClient.get("/institute/students", { params: batch ? { batch } : {} }),
  listStaff: () => axiosClient.get("/institute/staff"),
};

export default instituteApi;
