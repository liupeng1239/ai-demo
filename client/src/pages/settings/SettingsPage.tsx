import { useState } from 'react';
import { Alert } from '../../components/Alert';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    timezone: 'Asia/Shanghai',
  });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function handleSave() {
    setFeedback({ type: 'success', message: '设置已保存。下次登录时将继续保留您的偏好。' });
  }

  return (
    <section className="space-y-6">
      {feedback ? <Alert variant={feedback.type} title="保存成功" message={feedback.message} /> : null}

      <div className="rounded-[28px] border border-outline-variant bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-on-surface-variant">设置</p>
          <h2 className="mt-3 text-2xl font-semibold text-on-surface">账户与偏好配置</h2>
        </div>

        <div className="mt-6 space-y-6 rounded-3xl border border-outline-variant bg-surface-container p-6">
          <div className="space-y-2 rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-on-surface">账号信息</p>
            <p className="text-sm text-on-surface-variant">当前登录为张敏。您可以在后续迭代中管理个人资料、通知和隐私设置。</p>
          </div>

          <div className="space-y-2 rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-on-surface">界面偏好</p>
            <label className="flex items-center gap-3 text-sm text-on-surface-variant">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={e => setSettings(current => ({ ...current, darkMode: e.target.checked }))}
                className="h-4 w-4 rounded border border-outline-variant text-primary focus:ring-primary"
              />
              启用暗黑模式
            </label>
            <label className="flex items-center gap-3 text-sm text-on-surface-variant">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={e => setSettings(current => ({ ...current, notifications: e.target.checked }))}
                className="h-4 w-4 rounded border border-outline-variant text-primary focus:ring-primary"
              />
              接收审批提醒和系统通知
            </label>
            <label className="text-sm text-on-surface-variant">
              时区
              <select
                value={settings.timezone}
                onChange={e => setSettings(current => ({ ...current, timezone: e.target.value }))}
                className="mt-2 block w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="Asia/Shanghai">亚洲/上海</option>
                <option value="Asia/Tokyo">亚洲/东京</option>
                <option value="Europe/London">欧洲/伦敦</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:opacity-90"
          >
            保存设置
          </button>
        </div>
      </div>
    </section>
  );
}
