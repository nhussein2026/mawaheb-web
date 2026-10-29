import { API_BASE_URL } from "../services/api/config";

// Uploaded files are served by the backend under these paths.
export const uploadUrl = (path, prefix = "") => (path ? `${API_BASE_URL}/${prefix}${path}` : null);
