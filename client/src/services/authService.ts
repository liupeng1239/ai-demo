import api from './api';
import type { UserProfile } from '../types';

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

const mockUsers: { username: string; password: string; user: UserProfile }[] = [
  {
    username: 'hr',
    password: 'password123',
    user: { id: 'u-1001', name: '张敏', role: 'hr', email: 'zhangmin@example.com' },
  },
  {
    username: 'employee',
    password: 'password123',
    user: { id: 'u-2001', name: '李华', role: 'employee', email: 'lihua@example.com' },
  },
];

export async function login(username: string, password: string): Promise<AuthResponse> {
  if (!import.meta.env.VITE_API_BASE_URL) {
    await new Promise(resolve => setTimeout(resolve, 300));

    const found = mockUsers.find(
      item => item.username === username.toLowerCase() && item.password === password
    );

    if (!found) {
      throw new Error('用户名或密码错误');
    }

    return {
      token: `mock-token-${found.user.id}`,
      user: found.user,
    };
  }

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
