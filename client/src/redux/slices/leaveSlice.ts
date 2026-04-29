import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as leaveService from '../../services/leaveService';
import { LeaveRequest } from '../../types';

interface LeaveState {
  leaves: LeaveRequest[];
  currentLeave: LeaveRequest | null;
  loading: boolean;
  error: string | null;
}

const initialState: LeaveState = {
  leaves: [],
  currentLeave: null,
  loading: false,
  error: null,
};

export const fetchLeaves = createAsyncThunk(
  'leave/fetchLeaves',
  async (_, { rejectWithValue }) => {
    try {
      return await leaveService.getLeaveList();
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : '获取请假列表失败');
    }
  }
);

export const fetchLeaveById = createAsyncThunk(
  'leave/fetchLeaveById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await leaveService.getLeaveById(id);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : '获取请假详情失败');
    }
  }
);

export const createLeave = createAsyncThunk(
  'leave/create',
  async (data: { startTime: string; endTime: string; reason: string }, { rejectWithValue }) => {
    try {
      return await leaveService.createLeaveRequest(data);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : '创建请假失败');
    }
  }
);

export const submitLeave = createAsyncThunk(
  'leave/submit',
  async (id: string, { rejectWithValue }) => {
    try {
      await leaveService.submitLeave(id);
      return id;
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : '提交失败');
    }
  }
);

const leaveSlice = createSlice({
  name: 'leave',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearCurrentLeave: state => {
      state.currentLeave = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchLeaves.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLeaveById.fulfilled, (state, action) => {
        state.currentLeave = action.payload;
      })
      .addCase(createLeave.fulfilled, (state, action) => {
        state.leaves.unshift(action.payload);
      })
      .addCase(submitLeave.fulfilled, (state, action) => {
        const leave = state.leaves.find(l => l._id === action.payload);
        if (leave) {
          leave.status = 'submitted';
        }
      });
  },
});

export const { clearError, clearCurrentLeave } = leaveSlice.actions;
export default leaveSlice.reducer;