import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../components/Alert';
import { StatusBadge } from '../../components/StatusBadge';
import { ApprovalTaskTable } from '../../components/ApprovalTaskTable';
import { useAppSelector } from '../../redux/hooks';
import type { RootState } from '../../redux/store';
import type { ApprovalTask } from '../../types';

const summaryCards = [
  { title: '待审批请假', value: 4, description: '当前有 4 条待您审批的申请' },
  { title: '本月已审批', value: 18, description: '本月已处理审批请求' },
  { title: '请假余额', value: '8.5 天', description: '剩余年假可用天数' },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const approvalTasks = useAppSelector((state: RootState) => state.tasks.approvalTasks);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const pendingCount = useMemo(
    () => approvalTasks.filter((task: ApprovalTask) => task.status === 'pending').length,
    [approvalTasks]
  );
  const quickTasks = useMemo(() => approvalTasks.slice(0, 2), [approvalTasks]);

  return (
    <div className="space-y-6">
      {feedback ? <Alert variant={feedback.type} title={feedback.type === 'success' ? '操作成功' : '提示'} message={feedback.message} /> : null}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[28px] border border-outline-variant bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-on-surface-variant">今日概览</p>
              <h1 className="mt-3 text-3xl font-semibold text-on-surface">审批任务仪表盘</h1>
            </div>
            <div className="rounded-2xl bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container">实时</div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {summaryCards.map(card => (
              <div key={card.title} className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-5">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-on-surface-variant">{card.title}</p>
                <p className="mt-4 text-3xl font-semibold text-on-surface">{card.value}</p>
                <p className="mt-3 text-sm text-on-surface-variant">{card.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-outline-variant bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-on-surface-variant">快速通道</p>
              <h2 className="mt-3 text-xl font-semibold text-on-surface">当前待办</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/approval-tasks')}
              className="rounded-xl bg-secondary-container px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-secondary-container/90"
            >
              查看全部
            </button>
          </div>
          <div className="mt-6">
            <ApprovalTaskTable tasks={quickTasks} onViewTask={() => navigate('/approval-tasks')} />
          </div>
          <div className="mt-6 rounded-3xl border border-outline-variant bg-surface-container-low p-4">
            <p className="text-sm font-medium text-on-surface-variant">当前待审批任务</p>
            <p className="mt-3 text-3xl font-semibold text-on-surface">{pendingCount}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-outline-variant bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-on-surface-variant">最近请假</p>
            <h2 className="mt-3 text-2xl font-semibold text-on-surface">审批记录</h2>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: 'success', message: '正在生成导出报告，稍后请在下载中心查看。' })}
            className="rounded-xl bg-surface-container px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-surface-container-highest"
          >
            导出报告
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-outline-variant">
          <div className="p-6 text-sm text-on-surface-variant">请在审批任务页面查看完整审批记录。</div>
        </div>
      </div>
    </div>
  );
}
