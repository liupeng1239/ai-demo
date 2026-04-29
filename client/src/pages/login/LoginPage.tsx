import { FormEvent, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../../components/Alert';
import { useAppSelector } from '../../redux/hooks';
import { useAppDispatch } from '../../redux/hooks';
import { login } from '../../redux/slices/authSlice';

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  function validateForm() {
    const nextErrors = { username: '', password: '' };

    if (!form.username.trim()) {
      nextErrors.username = '请输入用户名或邮箱。';
    }
    if (!form.password.trim()) {
      nextErrors.password = '请输入密码。';
    } else if (form.password.length < 6) {
      nextErrors.password = '密码长度至少 6 位。';
    }

    setErrors(nextErrors);
    return !nextErrors.username && !nextErrors.password;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      setFeedback({ type: 'error', message: '请修正表单错误后再登录。' });
      return;
    }

    setFeedback(null);
    setIsSubmitting(true);

    // 直接使用 dispatch 返回值判断，不依赖 try-catch
    const result = await dispatch(login({ username: form.username, password: form.password }));
    if (login.rejected.match(result)) {
      // 登录失败：通过 result.payload 获取错误信息
      setFeedback({ type: 'error', message: result.payload as string });
    } else {
      // 登录成功
      setFeedback({ type: 'success', message: '登录成功，正在跳转...' });
    }

    setIsSubmitting(false);
  }

  function handleChange(field: 'username' | 'password', value: string) {
    setForm(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: '' }));
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-fixed/20 blur-3xl opacity-80" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary-container/30 blur-3xl opacity-70" />

        <div className="relative z-10 w-full max-w-xl rounded-[28px] border border-outline-variant bg-surface-container-lowest p-10 shadow-sm sm:p-12">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container text-on-primary-container shadow-sm">
              <span className="material-symbols-outlined text-3xl">spa</span>
            </div>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-primary">行政禅 (Admin Zen)</h1>
            <p className="mt-2 text-sm text-secondary">高效管理，禅意办公</p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-on-surface">登录</h2>
              <p className="mt-2 text-sm text-on-surface-variant">请输入您的账号信息，开始申请和审批流程。</p>
            </div>

            {feedback ? <Alert variant={feedback.type} title={feedback.type === 'success' ? '登录成功' : '登录失败'} message={feedback.message} /> : null}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
                  用户名 / 邮箱
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                    <span className="material-symbols-outlined text-lg">person</span>
                  </span>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={form.username}
                    
                    onChange={e => handleChange('username', e.target.value)}
                    placeholder="请输入您的账号"
                    className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 pl-11 text-base text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {errors.username ? <p className="text-sm text-rose-600">{errors.username}</p> : null}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
                    密码
                  </label>
                  <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    忘记密码？
                  </Link>
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-outline">
                    <span className="material-symbols-outlined text-lg">lock</span>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={e => handleChange('password', e.target.value)}
                    placeholder="请输入您的密码"
                    className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 pl-11 pr-12 text-base text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-outline">
                    <span className="material-symbols-outlined text-lg">visibility</span>
                  </span>
                </div>
                {errors.password ? <p className="text-sm text-rose-600">{errors.password}</p> : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-base font-semibold text-on-primary transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? '登录中...' : '登录'}
                <span className="material-symbols-outlined ml-2">arrow_forward</span>
              </button>
            </form>
          </div>

          <div className="mt-10 border-t border-outline-variant/30 pt-8 text-center text-sm text-secondary">
            还没有账号？
            <a href="#" className="ml-1 font-semibold text-primary hover:underline">
              联系HR开通
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
