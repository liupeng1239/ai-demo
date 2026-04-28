import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../../components/Alert';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setFeedback({ type: 'error', message: '请输入邮箱地址以继续找回密码。' });
      return;
    }

    if (!validateEmail(email)) {
      setFeedback({ type: 'error', message: '请输入有效的邮箱地址。' });
      return;
    }

    setFeedback({ type: 'success', message: '重置链接已发送至您的邮箱，请查收。' });
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-fixed/20 blur-3xl opacity-80" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary-container/30 blur-3xl opacity-70" />

        <div className="relative z-10 w-full max-w-xl rounded-[28px] border border-outline-variant bg-surface-container-lowest p-10 shadow-sm sm:p-12">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-semibold text-on-surface">找回密码</h1>
            <p className="mt-2 text-sm text-on-surface-variant">请输入您注册时使用的邮箱地址，我们会发送重置链接。</p>
          </div>

          {feedback ? <Alert variant={feedback.type} title={feedback.type === 'success' ? '已发送' : '出错了'} message={feedback.message} /> : null}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.16em] text-on-surface-variant">
                邮箱地址
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="请输入您的邮箱"
                className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-base text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-outline-variant bg-surface-container px-5 py-3.5 text-sm font-semibold text-on-surface transition hover:bg-surface-container-highest"
              >
                返回登录
              </Link>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-on-primary transition hover:opacity-90"
              >
                发送重置链接
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
