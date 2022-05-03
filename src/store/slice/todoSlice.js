import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import todoService from '../../service/todoService';
import {getErrorMessages} from '../../util/requestUtils';

export const list = createAsyncThunk(
  'todo/list',
  async (_, {getState, requestId, rejectWithValue}) => {
    const {currentRequestId, loading} = getState().todo;

    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    try {
      const response = await todoService.list();

      return response;
    } catch (e) {
      if (!e.response) {
        throw e;
      }

      return rejectWithValue(e.response);
    }
  }
);

export const addOne = createAsyncThunk(
  'todo/addOne',
  async ({name, note, state}, {getState, requestId, rejectWithValue}) => {
    const {currentRequestId, loading} = getState().todo;

    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    try {
      const response = await todoService.postOne({name, note, state});

      return response;
    } catch (e) {
      if (!e.response) {
        throw e;
      }

      return rejectWithValue(e.response);
    }
  }
);

export const updateOne = createAsyncThunk(
  'todo/updateOne',
  async ({todo}, {getState, requestId, rejectWithValue}) => {
    const {currentRequestId, loading} = getState().todo;

    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    try {
      const response = await todoService.patchOne(todo);

      return response;
    } catch (e) {
      if (!e.response) {
        throw e;
      }

      return rejectWithValue(e.response);
    }
  }
);

export const deleteOne = createAsyncThunk(
  'todo/deleteOne',
  async ({todo}, {getState, requestId, rejectWithValue}) => {
    const {currentRequestId, loading} = getState().todo;

    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    try {
      const response = await todoService.deleteOne(todo);

      return response;
    } catch (e) {
      if (!e.response) {
        throw e;
      }

      return rejectWithValue(e.response);
    }
  }
);

const initialState = {
  loading: 'idle',
  currentRequestId: undefined,
  errors: [],
  todoOngoing: [],
  todoCompleted: []
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setState(state, action) {
      const {key, value} = action.payload;
      state[key] = value;
    },
    resetErrors(state) {
      state.errors = [];
    }
  },
  extraReducers: builder => {
    builder
      .addCase(list.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.errors = [];
        }
      })
      .addCase(list.fulfilled, (state, action) => {
        const {requestId} = action.meta;
        if (
          state.loading === 'pending' &&
          state.currentRequestId === requestId
        ) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.errors = [];

          const {rows: todo} = action.payload.data;

          state.todoOngoing = todo.filter(t => t.state === 'ongoing');
          state.todoCompleted = todo.filter(t => t.state === 'completed');
        }
      })
      .addCase(list.rejected, (state, action) => {
        state.loading = 'idle';
        state.errors = getErrorMessages(action.payload);
        state.currentRequestId = undefined;
      })
      .addCase(addOne.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.errors = [];
        }
      })
      .addCase(addOne.fulfilled, (state, action) => {
        const {requestId} = action.meta;
        if (
          state.loading === 'pending' &&
          state.currentRequestId === requestId
        ) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.errors = [];
        }
      })
      .addCase(addOne.rejected, (state, action) => {
        state.loading = 'idle';
        state.errors = getErrorMessages(action.payload);
        state.currentRequestId = undefined;
      })
      .addCase(updateOne.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.errors = [];
        }
      })
      .addCase(updateOne.fulfilled, (state, action) => {
        const {requestId} = action.meta;
        if (
          state.loading === 'pending' &&
          state.currentRequestId === requestId
        ) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.errors = [];
        }
      })
      .addCase(updateOne.rejected, (state, action) => {
        state.loading = 'idle';
        state.errors = getErrorMessages(action.payload);
        state.currentRequestId = undefined;
      })
      .addCase(deleteOne.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.errors = [];
        }
      })
      .addCase(deleteOne.fulfilled, (state, action) => {
        const {requestId} = action.meta;
        if (
          state.loading === 'pending' &&
          state.currentRequestId === requestId
        ) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.errors = [];
        }
      })
      .addCase(deleteOne.rejected, (state, action) => {
        state.loading = 'idle';
        state.errors = getErrorMessages(action.payload);
        state.currentRequestId = undefined;
      });
  }
});

export const {setState, resetErrors} = todoSlice.actions;

const {reducer: todoReducer} = todoSlice;
export default todoReducer;
