import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-outline-variant bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-on-surface">{title}</h1>
        <p className="mt-2 text-sm text-on-surface-variant">{subtitle}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
