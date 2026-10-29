// Single source for the API address. The backend serves its routes at the
// root (no /api prefix) on port 3000 in development; production builds must
// set VITE_API_URL.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
