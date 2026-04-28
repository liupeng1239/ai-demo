import { useState } from 'react';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { Alert } from '../../components/Alert';

interface LeaveRecord {
  id: string;
  type: string;
  period: string;
  days: number;
  status: 'approved' | 'pending' | 'rejected';
}

const balanceCards = [
  { title: '年假余额', value: '7.5 天', description: '本年度剩余年假天数' },
  { title: '调休余额', value: '3 天', description: '可用调休时长' },
  { title: '病假额度', value: '5 天', description: '剩余病假天数' },
];

const initialLeaves: LeaveRecord[] = [
  { id: 'LV-2001', type: '年假', period: '2026-05-12 ~ 2026-05-14', days: 3, status: 'approved' },
  { id: 'LV-2009', type: '病假', period: '2026-04-28 ~ 2026-04-28', days: 1, status: 'pending' },
  { id: 'LV-2013', type: '事假', period: '2026-03-18 ~ 2026-03-19', days: 2, status: 'rejected' },
];

export function MyLeavesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [records, setRecords] = useState<LeaveRecord[]>(initialLeaves);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [form, setForm] = useState({
    type: '年假',
    period: '',
    days: '',
    contact: '',
    note: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(field: string, value: string) {
    setForm(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: '' }));
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    if (!form.period.trim()) nextErrors.period = '请输入请假时间范围。';
    if (!form.days.trim()) nextErrors.days = '请输入请假天数。';
    if (form.days.trim() && Number(form.days) <= 0) nextErrors.days = '请假天数必须大于 0。';
    if (!form.contact.trim()) nextErrors.contact = '请输入联系方式。';
    return nextErrors;
  }

  function handleSubmit() {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setNotification({ type: 'error', message: '请先修正表单中的错误，再提交申请。' });
      return;
    }

    const newRecord: LeaveRecord = {
      id: `LV-${Date.now().toString().slice(-4)}`,
      type: form.type,
      period: form.period,
      days: Number(form.days),
      status: 'pending',
    };

    setRecords(current => [newRecord, ...current]);
    setNotification({ type: 'success', message: '请假申请提交成功，等待审批。' });
    setCreateOpen(false);
    setForm({ type: '年假', period: '', days: '', contact: '', note: '' });
    setErrors({});
  }

  return (
    <>
      <section className="space-y-6">
        {notification ? (
          <Alert variant={notification.type} title={notification.type === 'success' ? '提交成功' : '提交失败'} message={notification.message} />
        ) : null}

        <div className="grid gap-6 sm:grid-cols-3">
          {balanceCards.map(card => (
            <div key={card.title} className="rounded-[28px] border border-outline-variant bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-on-surface-variant">{card.title}</p>
              <p className="mt-4 text-3xl font-semibold text-on-surface">{card.value}</p>
              <p className="mt-3 text-sm text-on-surface-variant">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[28px] border border-outline-variant bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-on-surface-variant">个人请假</p>
              <h2 className="mt-3 text-2xl font-semibold text-on-surface">请假记录</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setCreateOpen(true);
                setNotification(null);
              }}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:opacity-90"
            >
              新建请假
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-outline-variant">
            <table className="min-w-full divide-y divide-outline-variant text-left text-sm">
              <thead className="bg-surface-container-lowest text-on-surface-variant">
                <tr>
                  <th className="px-6 py-4">请假编号</th>
                  <th className="px-6 py-4">类型</th>
                  <th className="px-6 py-4">时间</th>
                  <th className="px-6 py-4">天数</th>
                  <th className="px-6 py-4">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant bg-white">
                {records.map(item => (
                  <tr key={item.id} className="hover:bg-surface-container-highest">
                    <td className="px-6 py-4 font-medium text-on-surface">{item.id}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{item.type}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{item.period}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{item.days}</td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        label={
                          item.status === 'approved'
                            ? '已批准'
                            : item.status === 'pending'
                            ? '审批中'
                            : '已拒绝'
                        }
                        variant={item.status as 'approved' | 'pending' | 'rejected'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Modal
        open={createOpen}
        title="新建请假申请"
        onClose={() => setCreateOpen(false)}
        footer={
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="rounded-xl border border-outline-variant bg-surface-container px-4 py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container-highest"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-on-primary transition hover:opacity-90"
            >
              提交申请
            </button>
          </div>
        }
      >
        <form className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-on-surface-variant">
              请假类型
              <select
                value={form.type}
                onChange={e => handleChange('type', e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option>年假</option>
                <option>事假</option>
                <option>病假</option>
                <option>调休</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-on-surface-variant">
              时间区间
              <input
                value={form.period}
                onChange={e => handleChange('period', e.target.value)}
                type="text"
                placeholder="2026-05-12 ~ 2026-05-14"
                className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {errors.period ? <p className="text-sm text-rose-600">{errors.period}</p> : null}
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-on-surface-variant">
              请假天数
              <input
                value={form.days}
                onChange={e => handleChange('days', e.target.value)}
                type="number"
                placeholder="3"
                className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {errors.days ? <p className="text-sm text-rose-600">{errors.days}</p> : null}
            </label>
            <label className="space-y-2 text-sm text-on-surface-variant">
              联系方式
              <input
                value={form.contact}
                onChange={e => handleChange('contact', e.target.value)}
                type="text"
                placeholder="张敏 / 13800000000"
                className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              {errors.contact ? <p className="text-sm text-rose-600">{errors.contact}</p> : null}
            </label>
          </div>

          <label className="space-y-2 text-sm text-on-surface-variant">
            备注说明
            <textarea
              value={form.note}
              onChange={e => handleChange('note', e.target.value)}
              rows={4}
              placeholder="请输入请假理由或补充说明"
              className="w-full rounded-3xl border border-outline-variant bg-white px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </form>
      </Modal>
    </>
  );
}
