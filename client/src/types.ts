export type AppPage = 'dashboard' | 'my-leaves' | 'approval-tasks' | 'settings';

export interface UserProfile {
  id: string;
  name: string;
  role: 'employee' | 'hr' | 'admin';
  email: string;
}

export interface ApprovalTask {
  id: string;
  applicant: string;
  type: string;
  period: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface LeaveRecord {
  id: string;
  type: string;
  period: string;
  days: number;
  status: 'approved' | 'pending' | 'rejected';
}
