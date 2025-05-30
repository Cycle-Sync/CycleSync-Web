import { refreshToken } from './api';

export const setAuthToken = (access, refresh) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

export const clearAuthToken = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const refreshAuthToken = async () => {
  try {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error('No refresh token');
    const response = await refreshToken({ refresh });
    setAuthToken(response.data.access, response.data.refresh);
    return response.data.access;
  } catch (error) {
    clearAuthToken();
    throw error;
  }
};