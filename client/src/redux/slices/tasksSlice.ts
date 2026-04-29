import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as workflowService from '../../services/workflowService';
import { WorkflowTask } from '../../types';

interface TasksState {
  tasks: WorkflowTask[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      return await workflowService.getTasks();
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : '获取任务失败');
    }
  }
);

export const approveTask = createAsyncThunk(
  'tasks/approve',
  async ({ id, comment }: { id: string; comment?: string }, { rejectWithValue }) => {
    try {
      await workflowService.approveTask(id, comment);
      return id;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : '审批失败');
    }
  }
);

export const rejectTask = createAsyncThunk(
  'tasks/reject',
  async ({ id, comment }: { id: string; comment?: string }, { rejectWithValue }) => {
    try {
      await workflowService.rejectTask(id, comment);
      return id;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : '审批失败');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(approveTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      })
      .addCase(rejectTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
      });
  },
});

export const { clearError } = tasksSlice.actions;
export default tasksSlice.reducer;