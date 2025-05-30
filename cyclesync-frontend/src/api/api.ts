import axios from 'axios';

const API = axios.create({
  baseURL: 'https://supreme-space-acorn-x5r6q979w76r34w5-8000.app.github.dev/api/',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface User {
  id: number;
  username: string;
  email?: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

interface Profile {
  id: number;
  user: User;
  date_of_birth?: string;
  country?: string;
  cycle_type?: string;
}

interface DailyEntry {
  id: number;
  profile: Profile;
  date: string;
  cramps: number;
  bloating: number;
  tender_breasts: number;
  headache: number;
  acne: number;
  mood: number;
  stress: number;
  energy: number;
  cervical_mucus: string;
  sleep_quality: number;
  libido: number;
  notes: string;
}

interface CalendarDay {
  date: string;
  day_num: number;
  phase: string;
  is_past: boolean;
  is_today: boolean;
  new_month: boolean;
  angle: number;
}

interface DashboardData {
  days: number[];
  fsh: number[];
  lh: number[];
  estradiol: number[];
  progesterone: number[];
}

export const register = (data: {
  username: string;
  password: string;
  date_of_birth?: string;
  country?: string;
  cycle_type?: string;
}) => API.post<AuthResponse>('register/', data);

export const login = (data: { username: string; password: string }) =>
  API.post<AuthResponse>('login/', data);

export const logout = (refresh: string) => API.post('logout/', { refresh });

export const refreshToken = (refresh: string) =>
  API.post<{ access: string; refresh: string }>('token/refresh/', { refresh });

export const getProfile = () => API.get<Profile>('profile/');

export const updateProfile = (data: Partial<Profile>) => API.put<Profile>('profile/', data);

export const getDailyEntry = () => API.get<DailyEntry>('daily-entry/');

export const updateDailyEntry = (data: Partial<DailyEntry>) =>
  API.post<DailyEntry>('daily-entry/', data);

export const getCalendar = () => API.get<{ days_list: CalendarDay[] }>('calendar/');

export const getDashboard = () => API.get<DashboardData>('dashboard/');