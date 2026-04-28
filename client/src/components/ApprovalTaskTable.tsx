export interface ApprovalTask {
  id: string;
  applicant: string;
  type: string;
  period: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface ApprovalTaskTableProps {
  tasks: ApprovalTask[];
  selectedTaskIds?: string[];
  selectableTaskIds?: string[];
  showSelection?: boolean;
  onToggleTask?: (id: string) => void;
  onToggleAll?: () => void;
  onViewTask: (task: ApprovalTask) => void;
}

export function ApprovalTaskTable({
  tasks,
  selectedTaskIds = [],
  selectableTaskIds = [],
  showSelection = false,
  onToggleTask,
  onToggleAll,
  onViewTask,
}: ApprovalTaskTableProps) {
  const allSelected =
    showSelection && selectableTaskIds.length > 0 && selectableTaskIds.every(id => selectedTaskIds.includes(id));

  return (
    <div className="overflow-hidden rounded-3xl border border-outline-variant bg-white">
      <table className="min-w-full divide-y divide-outline-variant text-left text-sm">
        <thead className="bg-surface-container-lowest text-on-surface-variant">
          <tr>
            {showSelection ? (
              <th className="px-6 py-4 w-20">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  aria-label="选择所有任务"
                  className="h-4 w-4 accent-primary"
                />
              </th>
            ) : null}
            <th className="px-6 py-4">任务编号</th>
            <th className="px-6 py-4">申请人</th>
            <th className="px-6 py-4">类型</th>
            <th className="px-6 py-4">时间</th>
            <th className="px-6 py-4">状态</th>
            <th className="px-6 py-4">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant bg-white">
          {tasks.map(task => (
            <tr key={task.id} className="hover:bg-surface-container-highest">
              {showSelection ? (
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.includes(task.id)}
                    disabled={task.status !== 'pending'}
                    onChange={() => onToggleTask?.(task.id)}
                    aria-label={`选择 ${task.id}`}
                    className="h-4 w-4 accent-primary"
                  />
                </td>
              ) : null}
              <td className="px-6 py-4 font-medium text-on-surface">{task.id}</td>
              <td className="px-6 py-4 text-on-surface-variant">{task.applicant}</td>
              <td className="px-6 py-4 text-on-surface-variant">{task.type}</td>
              <td className="px-6 py-4 text-on-surface-variant">{task.period}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    task.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : task.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {task.status === 'approved' ? '已批准' : task.status === 'pending' ? '审批中' : '已拒绝'}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onViewTask(task)}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:opacity-90"
                >
                  查看
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
