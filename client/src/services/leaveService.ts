import api from './api';
import { LeaveRequest } from '../types';

interface CreateLeaveRequest {
  startTime: string;
  endTime: string;
  reason: string;
}

export async function getLeaveList(): Promise<LeaveRequest[]> {
  const response = await api.get('/api/leave');
  return response.data.data;
}

export async function getLeaveById(id: string): Promise<LeaveRequest> {
  const response = await api.get(`/api/leave/${id}`);
  return response.data.data;
}

export async function createLeaveRequest(data: CreateLeaveRequest): Promise<LeaveRequest> {
  const response = await api.post('/api/leave', data);
  return response.data.data;
}

export async function updateLeave(id: string, data: Partial<LeaveRequest>): Promise<LeaveRequest> {
  const response = await api.put(`/api/leave/${id}`, data);
  return response.data.data;
}

export async function submitLeave(id: string): Promise<void> {
  await api.post(`/api/leave/${id}/submit`);
}