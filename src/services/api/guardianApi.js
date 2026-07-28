import axios from "axios";

// Guardian portal API (spec §6.15). Uses a SEPARATE axios instance and its own
// short-lived, read-only token (localStorage `guardianToken`) so it never
// mixes with the normal user session token.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const GUARDIAN_TOKEN_KEY = "guardianToken";
export const GUARDIAN_STUDENT_KEY = "guardianStudent";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(GUARDIAN_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Session helpers
export const getGuardianStudent = () => {
  try {
    return JSON.parse(localStorage.getItem(GUARDIAN_STUDENT_KEY) || "null");
  } catch {
    return null;
  }
};
export const isGuardianLoggedIn = () => !!localStorage.getItem(GUARDIAN_TOKEN_KEY);
export const guardianLogout = () => {
  localStorage.removeItem(GUARDIAN_TOKEN_KEY);
  localStorage.removeItem(GUARDIAN_STUDENT_KEY);
};

export const guardianApi = {
  login: async (academicNumber, pin) => {
    const res = await client.post("/institute/guardian/login", {
      academicNumber,
      pin,
    });
    const { token, student } = res.data || {};
    if (token) localStorage.setItem(GUARDIAN_TOKEN_KEY, token);
    if (student)
      localStorage.setItem(GUARDIAN_STUDENT_KEY, JSON.stringify(student));
    return res.data;
  },
  getOverview: () => client.get("/institute/guardian/overview"),
  getResults: () => client.get("/institute/guardian/results"),
  getEvaluations: () => client.get("/institute/guardian/evaluations"),
  getBehavior: () => client.get("/institute/guardian/behavior"),
  getFees: () => client.get("/institute/guardian/fees"),
};

export default guardianApi;
