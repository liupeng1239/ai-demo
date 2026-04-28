import { AppPage } from '../types';

interface SidebarProps {
  currentPage: AppPage;
  onSelectPage: (page: AppPage) => void;
  onLogout: () => void;
}

const navItems: { page: AppPage; label: string; icon: string }[] = [
  { page: 'dashboard', label: '仪表盘', icon: 'dashboard' },
  { page: 'my-leaves', label: '我的请假', icon: 'calendar_today' },
  { page: 'approval-tasks', label: '审批任务', icon: 'task_alt' },
  { page: 'settings', label: '设置', icon: 'settings' },
];

export function Sidebar({ currentPage, onSelectPage, onLogout }: SidebarProps) {
  return (
    <aside className="rounded-[28px] border border-outline-variant bg-surface-container p-6 shadow-sm">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-on-surface-variant">员工门户</p>
        <h2 className="mt-3 text-2xl font-semibold text-on-surface">请假管理</h2>
      </div>

      <nav className="space-y-2">
        {navItems.map(item => {
          const active = item.page === currentPage;
          return (
            <button
              key={item.page}
              type="button"
              onClick={() => onSelectPage(item.page)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                active
                  ? 'bg-surface-container-highest text-on-surface'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base leading-none">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-8 flex w-full items-center gap-3 rounded-xl border border-outline-variant bg-white px-4 py-3 text-left text-sm font-semibold text-on-surface transition hover:bg-surface-container-highest"
      >
        <span className="material-symbols-outlined text-base leading-none">logout</span>
        退出登录
      </button>
    </aside>
  );
}
