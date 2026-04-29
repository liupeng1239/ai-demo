import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { Alert } from '../../components/Alert';
import { getLeaveById, submitLeave } from '../../services/leaveService';
import { LeaveRequest } from '../../types';

function getStatusVariant(status: string): 'approved' | 'pending' | 'rejected' {
  if (status === 'approved') return 'approved';
  if (status === 'rejected') return 'rejected';
  return 'pending';
}

function getStatusLabel(status: string): string {
  if (status === 'draft') return '草稿';
  if (status === 'submitted') return '已提交';
  if (status === 'approved') return '已批准';
  if (status === 'rejected') return '已拒绝';
  return status;
}

export function LeaveDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [leave, setLeave] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadLeave();
    }
  }, [id]);

  const loadLeave = async () => {
    try {
      setLoading(true);
      const data = await getLeaveById(id!);
      setLeave(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!leave) return;
    setActionLoading(true);
    try {
      await submitLeave(leave._id);
      await loadLeave();
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失败');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="请假详情" subtitle="查看请假申请详情" />
        <div className="max-w-2xl mx-auto p-6">
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!leave) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="请假详情" subtitle="查看请假申请详情" />
        <div className="max-w-2xl mx-auto p-6">
          <Alert variant="error" title="加载失败" message="请假申请不存在" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="请假详情" subtitle="查看请假申请详情" />
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          {error && <Alert variant="error" title="操作失败" message={error} />}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">状态</span>
              <StatusBadge label={getStatusLabel(leave.status)} variant={getStatusVariant(leave.status)} />
            </div>

            <div>
              <span className="text-gray-500">开始时间</span>
              <p className="mt-1">{new Date(leave.startTime).toLocaleString()}</p>
            </div>

            <div>
              <span className="text-gray-500">结束时间</span>
              <p className="mt-1">{new Date(leave.endTime).toLocaleString()}</p>
            </div>

            <div>
              <span className="text-gray-500">请假原因</span>
              <p className="mt-1">{leave.reason}</p>
            </div>

            <div>
              <span className="text-gray-500">创建时间</span>
              <p className="mt-1">{new Date(leave.createdAt).toLocaleString()}</p>
            </div>

            {leave.status === 'draft' && (
              <div className="pt-4 flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionLoading ? '提交中...' : '提交审批'}
                </button>
                <button
                  onClick={() => navigate('/leave')}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  返回
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}