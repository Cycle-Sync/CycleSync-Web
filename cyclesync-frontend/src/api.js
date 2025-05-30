import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api/', // Update to your Django server URL
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data) => API.post('register/', data);
export const login = (data) => API.post('login/', data);
export const logout = (refresh) => API.post('logout/', { refresh });
export const refreshToken = (refresh) => API.post('token/refresh/', { refresh });
export const getProfile = () => API.get('profile/');
export const updateProfile = (data) => API.put('profile/', data);
export const getDailyEntry = () => API.get('daily-entry/');
export const updateDailyEntry = (data) => API.post('daily-entry/', data);
export const getCalendar = () => API.get('calendar/');
export const getDashboard = () => API.get('dashboard/');