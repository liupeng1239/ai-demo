import { useMemo, useState } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Alert } from '../../components/Alert';
import { ApprovalTaskTable, ApprovalTask } from '../../components/ApprovalTaskTable';

interface ReviewEvent {
  id: string;
  action: 'submitted' | 'approved' | 'rejected';
  comment: string;
  time: string;
}

interface Task extends ApprovalTask {
  history: ReviewEvent[];
}

const initialTasks: Task[] = [
  {
    id: 'AT-3001',
    applicant: '张婷',
    type: '年假',
    period: '2026-05-06 ~ 2026-05-08',
    status: 'pending',
    history: [
      { id: 'EV-3001', action: 'submitted', comment: '提交请假申请', time: '2026-05-04 09:24' },
    ],
  },
  {
    id: 'AT-3004',
    applicant: '李伟',
    type: '调休',
    period: '2026-05-02 ~ 2026-05-03',
    status: 'approved',
    history: [
      { id: 'EV-3004A', action: 'submitted', comment: '提交调休申请', time: '2026-04-30 11:12' },
      { id: 'EV-3004B', action: 'approved', comment: '同意调休申请', time: '2026-04-30 15:08' },
    ],
  },
  {
    id: 'AT-3010',
    applicant: '王芳',
    type: '事假',
    period: '2026-05-10 ~ 2026-05-10',
    status: 'rejected',
    history: [
      { id: 'EV-3010A', action: 'submitted', comment: '申请事假一天', time: '2026-05-07 14:36' },
      { id: 'EV-3010B', action: 'rejected', comment: '项目节点紧张，暂不批准', time: '2026-05-07 16:00' },
    ],
  },
];

function formatEventLabel(event: ReviewEvent) {
  if (event.action === 'submitted') {
    return '提交申请';
  }
  return event.action === 'approved' ? '已批准' : '已驳回';
}

function formatTime(value: string) {
  return value;
}

export function ApprovalTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const pendingTaskIds = useMemo(
    () => tasks.filter(task => task.status === 'pending').map(task => task.id),
    [tasks]
  );
  const selectedCount = selectedTaskIds.length;
  const allPendingSelected = pendingTaskIds.length > 0 && pendingTaskIds.every(id => selectedTaskIds.includes(id));

  function toggleTaskSelection(taskId: string) {
    setSelectedTaskIds(current =>
      current.includes(taskId) ? current.filter(id => id !== taskId) : [...current, taskId]
    );
  }

  function toggleSelectAll() {
    if (allPendingSelected) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(pendingTaskIds);
    }
  }

  function createReviewEvent(action: 'approved' | 'rejected', comment: string): ReviewEvent {
    return {
      id: `EV-${Date.now().toString().slice(-6)}`,
      action,
      comment,
      time: new Date().toLocaleString('zh-CN', { hour12: false }),
    };
  }

  function handleAction(action: 'approved' | 'rejected') {
    if (!selectedTask) {
      return;
    }

    if (selectedTask.status !== 'pending') {
      setFeedback({ type: 'error', message: '该任务已处理，无法重复操作。' });
      setSelectedTask(null);
      return;
    }

    const comment = reviewComment.trim() || (action === 'approved' ? '已同意该请假申请。' : '已驳回该请假申请。');
    const event = createReviewEvent(action, comment);

    setTasks(current =>
      current.map(task =>
        task.id === selectedTask.id
          ? { ...task, status: action, history: [...task.history, event] }
          : task
      )
    );

    setFeedback({
      type: 'success',
      message: action === 'approved' ? `已批准 ${selectedTask.id}` : `已驳回 ${selectedTask.id}`,
    });
    setSelectedTask(null);
    setReviewComment('');
  }

  function handleBatchAction(action: 'approved' | 'rejected') {
    if (!selectedCount) {
      setFeedback({ type: 'error', message: '请先选择至少一条待审批任务。' });
      return;
    }

    const comment = reviewComment.trim() || (action === 'approved' ? '批量批准申请。' : '批量驳回申请。');
    const event = createReviewEvent(action, comment);

    setTasks(current =>
      current.map(task =>
        selectedTaskIds.includes(task.id) && task.status === 'pending'
          ? { ...task, status: action, history: [...task.history, event] }
          : task
      )
    );

    setFeedback({
      type: 'success',
      message: action === 'approved' ? `已批量批准 ${selectedCount} 条任务。` : `已批量驳回 ${selectedCount} 条任务。`,
    });
    setSelectedTaskIds([]);
    setReviewComment('');
    setSelectedTask(null);
  }

  const selectedHistory = selectedTask?.history ?? [];
  const canReview = selectedTask?.status === 'pending';

  return (
    <>
      <section className="space-y-6">
        {feedback ? <Alert variant={feedback.type} title={feedback.type === 'success' ? '操作成功' : '操作失败'} message={feedback.message} /> : null}

        <div className="rounded-[28px] border border-outline-variant bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-on-surface-variant">审批任务</p>
              <h2 className="mt-3 text-2xl font-semibold text-on-surface">当前待办</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="rounded-xl border border-outline-variant bg-surface-container px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-container-highest"
              >
                {allPendingSelected ? '取消全选' : '全选待审批'}
              </button>
              <button
                type="button"
                disabled={!selectedCount}
                onClick={() => handleBatchAction('approved')}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  selectedCount ? 'bg-primary text-on-primary hover:opacity-90' : 'cursor-not-allowed bg-surface-container text-on-surface-variant'
                }`}
              >
                批量批准{selectedCount ? ` (${selectedCount})` : ''}
              </button>
              <button
                type="button"
                disabled={!selectedCount}
                onClick={() => handleBatchAction('rejected')}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  selectedCount ? 'bg-rose-600 text-white hover:opacity-90' : 'cursor-not-allowed bg-surface-container text-on-surface-variant'
                }`}
              >
                批量驳回{selectedCount ? ` (${selectedCount})` : ''}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <ApprovalTaskTable
              tasks={tasks}
              showSelection
              selectableTaskIds={pendingTaskIds}
              selectedTaskIds={selectedTaskIds}
              onToggleAll={toggleSelectAll}
              onToggleTask={toggleTaskSelection}
              onViewTask={task => setSelectedTask(tasks.find(item => item.id === task.id) ?? null)}
            />
          </div>
        </div>
      </section>

      <Modal
        open={selectedTask !== null}
        title={selectedTask ? `审批任务 ${selectedTask.id}` : ''}
        onClose={() => {
          setSelectedTask(null);
          setReviewComment('');
        }}
        footer={
          selectedTask ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setFeedback(null);
                  setSelectedTask(null);
                  setReviewComment('');
                }}
                className="rounded-xl border border-outline-variant bg-surface-container px-4 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container-highest"
              >
                取消
              </button>
              {canReview ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleAction('rejected')}
                    className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    驳回
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction('approved')}
                    className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90"
                  >
                    批准
                  </button>
                </>
              ) : (
                <div className="rounded-3xl bg-surface-container p-4 text-sm text-on-surface-variant">
                  此任务已处理，审批结果仅供查看。
                </div>
              )}
            </div>
          ) : null
        }
      >
        {selectedTask ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-surface-container p-4">
                <p className="text-sm font-semibold text-on-surface-variant">申请人</p>
                <p className="mt-2 text-base text-on-surface">{selectedTask.applicant}</p>
              </div>
              <div className="rounded-3xl bg-surface-container p-4">
                <p className="text-sm font-semibold text-on-surface-variant">请假类型</p>
                <p className="mt-2 text-base text-on-surface">{selectedTask.type}</p>
              </div>
            </div>
            <div className="rounded-3xl bg-surface-container p-4">
              <p className="text-sm font-semibold text-on-surface-variant">时间范围</p>
              <p className="mt-2 text-base text-on-surface">{selectedTask.period}</p>
            </div>
            <div className="rounded-3xl bg-surface-container p-4">
              <p className="text-sm font-semibold text-on-surface-variant">当前状态</p>
              <div className="mt-2">
                <StatusBadge
                  label={selectedTask.status === 'approved' ? '已批准' : selectedTask.status === 'pending' ? '审批中' : '已拒绝'}
                  variant={selectedTask.status}
                />
              </div>
            </div>
            <div className="rounded-3xl bg-surface-container p-4">
              <label className="space-y-3 text-sm text-on-surface-variant">
                审批备注
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  rows={4}
                  placeholder="可选：填写审批说明"
                  disabled={!canReview}
                  className="w-full rounded-3xl border border-outline-variant bg-white px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </label>
            </div>
            <div className="rounded-3xl bg-surface-container p-4">
              <p className="text-sm font-semibold text-on-surface-variant">审批历史</p>
              <div className="mt-4 space-y-3">
                {selectedHistory.map(history => (
                  <div key={history.id} className="rounded-3xl border border-outline-variant bg-white p-4">
                    <div className="flex items-center justify-between gap-4 text-sm font-semibold text-on-surface">
                      <span>{formatEventLabel(history)}</span>
                      <span className="text-on-surface-variant">{formatTime(history.time)}</span>
                    </div>
                    <p className="mt-2 text-sm text-on-surface-variant">{history.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
