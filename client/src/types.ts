export type AppPage = 'dashboard' | 'my-leaves' | 'approval-tasks' | 'settings';

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  role: 'employee' | 'HR' | 'admin';
  email: string;
}

export type User = UserProfile;

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

export interface LeaveRequest {
  _id: string;
  user_id: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  workflow_id?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkflowTask {
  _id: string;
  workflow_id: string;
  assignee_id: string;
  status: 'pending' | 'completed';
  result?: 'approved' | 'rejected';
  comment?: string;
  created_at: string;
  completed_at?: string;
}
