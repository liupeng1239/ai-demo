import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as authService from '../../services/authService';
import { UserProfile } from '../../types';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials.username, credentials.password);
      return response;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // 根据 HTTP 状态码判断错误类型
        const status = err.response.status;
        const detail = err.response.data?.detail;

        if (status === 401) {
          return rejectWithValue(detail || '用户名或密码错误');
        }
        if (status === 403) {
          return rejectWithValue(detail || '权限不足');
        }
        if (status >= 500) {
          return rejectWithValue(detail || '服务器错误，请稍后重试');
        }
        return rejectWithValue(detail || '请求失败');
      }
      return rejectWithValue(err instanceof Error ? err.message : '网络错误，请检查连接');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        if (status === 401) {
          return rejectWithValue('登录已过期，请重新登录');
        }
        return rejectWithValue(err.response.data?.detail || '获取用户信息失败');
      }
      return rejectWithValue(err instanceof Error ? err.message : '网络错误');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
