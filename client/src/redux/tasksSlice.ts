import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ApprovalTask, LeaveRecord } from '../types';

interface TasksState {
  approvalTasks: ApprovalTask[];
  leaveRecords: LeaveRecord[];
  selectedTaskIds: string[];
}

const initialState: TasksState = {
  approvalTasks: [
    { id: 'AT-3001', applicant: '张婷', type: '年假', period: '2026-05-06 ~ 2026-05-08', status: 'pending' },
    { id: 'AT-3004', applicant: '李伟', type: '调休', period: '2026-05-02 ~ 2026-05-03', status: 'approved' },
    { id: 'AT-3010', applicant: '王芳', type: '事假', period: '2026-05-10 ~ 2026-05-10', status: 'rejected' },
  ],
  leaveRecords: [
    { id: 'LV-2001', type: '年假', period: '2026-05-12 ~ 2026-05-14', days: 3, status: 'approved' },
    { id: 'LV-2009', type: '病假', period: '2026-04-28 ~ 2026-04-28', days: 1, status: 'pending' },
    { id: 'LV-2013', type: '事假', period: '2026-03-18 ~ 2026-03-19', days: 2, status: 'rejected' },
  ],
  selectedTaskIds: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    toggleTaskSelection(state, action: PayloadAction<string>) {
      const taskId = action.payload;
      if (state.selectedTaskIds.includes(taskId)) {
        state.selectedTaskIds = state.selectedTaskIds.filter(id => id !== taskId);
      } else {
        state.selectedTaskIds.push(taskId);
      }
    },
    setSelectedTaskIds(state, action: PayloadAction<string[]>) {
      state.selectedTaskIds = action.payload;
    },
    clearSelectedTaskIds(state) {
      state.selectedTaskIds = [];
    },
    updateTaskStatus(state, action: PayloadAction<{ id: string; status: ApprovalTask['status'] }>) {
      state.approvalTasks = state.approvalTasks.map(task =>
        task.id === action.payload.id ? { ...task, status: action.payload.status } : task
      );
    },
    batchUpdateTaskStatus(state, action: PayloadAction<{ ids: string[]; status: ApprovalTask['status'] }>) {
      state.approvalTasks = state.approvalTasks.map(task =>
        action.payload.ids.includes(task.id) && task.status === 'pending'
          ? { ...task, status: action.payload.status }
          : task
      );
      state.selectedTaskIds = [];
    },
    addLeaveRecord(state, action: PayloadAction<LeaveRecord>) {
      state.leaveRecords.unshift(action.payload);
    },
  },
});

export const {
  toggleTaskSelection,
  setSelectedTaskIds,
  clearSelectedTaskIds,
  updateTaskStatus,
  batchUpdateTaskStatus,
  addLeaveRecord,
} = tasksSlice.actions;
export default tasksSlice.reducer;
