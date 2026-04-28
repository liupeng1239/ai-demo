import { ReactNode } from 'react';
import { AppPage } from '../types';
import { PageHeader } from './PageHeader';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  page: AppPage;
  onSelectPage: (page: AppPage) => void;
  onLogout: () => void;
  headerTitle: string;
  headerSubtitle: string;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function AppShell({
  page,
  onSelectPage,
  onLogout,
  headerTitle,
  headerSubtitle,
  headerAction,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[280px_1fr] lg:px-6 xl:px-8">
        <Sidebar currentPage={page} onSelectPage={onSelectPage} onLogout={onLogout} />
        <main className="space-y-6">
          <PageHeader title={headerTitle} subtitle={headerSubtitle} action={headerAction} />
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
