import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { login, logout } from '../redux/authSlice';
import { AppShell } from '../components/AppShell';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { LoginPage } from '../pages/login/LoginPage';
import { ForgotPasswordPage } from '../pages/login/ForgotPasswordPage';
import { MyLeavesPage } from '../pages/leave/MyLeavesPage';
import { ApprovalTasksPage } from '../pages/hr/ApprovalTasksPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { login as loginApi } from '../services/authService';
import type { AppPage } from '../types';

const pageConfig: Record<AppPage, { title: string; subtitle: string }> = {
  dashboard: {
    title: '仪表盘',
    subtitle: '查看当前审批概览与关键指标',
  },
  'my-leaves': {
    title: '我的请假',
    subtitle: '查看剩余假期与历史请假记录',
  },
  'approval-tasks': {
    title: '审批任务',
    subtitle: '处理当前待办的请假申请',
  },
  settings: {
    title: '设置',
    subtitle: '管理账户偏好和系统配置',
  },
};

const pathToPage: Record<string, AppPage> = {
  '/dashboard': 'dashboard',
  '/my-leaves': 'my-leaves',
  '/approval-tasks': 'approval-tasks',
  '/settings': 'settings',
};

function ProtectedRoute({ signedIn, children }: { signedIn: boolean; children: JSX.Element }) {
  if (!signedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppLayout({ onLogout }: { onLogout: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const page = pathToPage[location.pathname] ?? 'dashboard';

  return (
    <AppShell
      page={page}
      onSelectPage={newPage => navigate(`/${newPage}`)}
      onLogout={onLogout}
      headerTitle={pageConfig[page].title}
      headerSubtitle={pageConfig[page].subtitle}
    >
      <Outlet />
    </AppShell>
  );
}

export function AppRouter() {
  const dispatch = useAppDispatch();
  const signedIn = useAppSelector(state => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            signedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage
                onLogin={async (username, password) => {
                  const response = await loginApi(username, password);
                  dispatch(login({ user: response.user, token: response.token }));
                }}
              />
            )
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          element={
            <ProtectedRoute signedIn={signedIn}>
              <AppLayout onLogout={() => dispatch(logout())} />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-leaves" element={<MyLeavesPage />} />
          <Route path="/approval-tasks" element={<ApprovalTasksPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to={signedIn ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
