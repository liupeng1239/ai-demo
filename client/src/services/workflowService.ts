import api from './api';
import { WorkflowTask } from '../types';

export async function getTasks(): Promise<WorkflowTask[]> {
  const response = await api.get('/api/workflow/tasks');
  return response.data.data;
}

export async function approveTask(id: string, comment?: string): Promise<void> {
  await api.post(`/api/workflow/tasks/${id}/approve`, { comment });
}

export async function rejectTask(id: string, comment?: string): Promise<void> {
  await api.post(`/api/workflow/tasks/${id}/reject`, { comment });
}