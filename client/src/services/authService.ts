import axios from 'axios';
import type { UserProfile } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

const token = localStorage.getItem('auth_token');
if (token) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface ApiError {
  detail?: string;
  message?: string;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', {
    username,
    password,
  });

  const data = response.data;
  if (!data.token) {
    throw new Error('登录响应缺少 token');
  }

  api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
  localStorage.setItem('auth_token', data.token);

  return data;
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common.Authorization;
  }
}

export async function getCurrentUser(): Promise<UserProfile> {
  const response = await api.get<UserProfile>('/auth/me');
  return response.data;
}
