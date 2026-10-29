import axios from 'axios';
import { API_BASE_URL } from './config';

export const SESSION_EXPIRED_EVENT = 'mawaheb:session-expired';

const BASE_URL = API_BASE_URL;

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    // For now, pulling from localStorage. If using Redux Persist, adjust to parse state.
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // A 401 for a signed-in user means the session ended; the app shell
    // listens for this event and asks the user to sign in again.
    if (error.response && error.response.status === 401 && localStorage.getItem('token')) {
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
