import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import userService from '../../service/userService';
import {getErrorMessages} from '../../util/requestUtils';

export const me = createAsyncThunk(
  'user/me',
  async (_, {getState, requestId, rejectWithValue}) => {
    const {currentRequestId, loading} = getState().user;

    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    try {
      const response = await userService.me();
      return response;
    } catch (e) {
      if (!e.response) {
        throw e;
      }

      return rejectWithValue(e.response);
    }
  }
);

export const updateMe = createAsyncThunk(
  'user/updateMe',
  async (args, {getState, requestId, rejectWithValue}) => {
    const {currentRequestId, loading} = getState().user;

    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const {email, password, firstName, lastName} = args;

    try {
      const response = await userService.updateMe({
        email,
        password,
        firstName,
        lastName
      });

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
  user: {}
};

const userSlice = createSlice({
  name: 'user',
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
      .addCase(me.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.errors = [];
        }
      })
      .addCase(me.fulfilled, (state, action) => {
        const {requestId} = action.meta;

        if (
          state.loading === 'pending' &&
          state.currentRequestId === requestId
        ) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.errors = [];

          const user = action.payload.data;

          state.user = user;
        }
      })
      .addCase(me.rejected, (state, action) => {
        state.loading = 'idle';
        state.errors = getErrorMessages(action.payload);
        state.currentRequestId = undefined;
      })
      .addCase(updateMe.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.errors = [];
        }
      })
      .addCase(updateMe.fulfilled, (state, action) => {
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
      .addCase(updateMe.rejected, (state, action) => {
        state.loading = 'idle';
        state.errors = getErrorMessages(action.payload);
        state.currentRequestId = undefined;
      });
  }
});

export const {setState, resetErrors} = userSlice.actions;

const {reducer: userReducer} = userSlice;
export default userReducer;
