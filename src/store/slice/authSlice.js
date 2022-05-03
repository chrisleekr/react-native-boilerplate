import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import authService from '../../service/authService';
import TokenService from '../../service/tokenService';
import {getErrorMessages} from '../../util/requestUtils';

export const login = createAsyncThunk(
  'auth/login',
  async (args, {getState, requestId, rejectWithValue}) => {
    const {currentRequestId, loading} = getState().auth;

    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const {username, password} = args;

    try {
      const response = await authService.login({username, password});

      return response;
    } catch (e) {
      if (!e.response) {
        throw e;
      }

      return rejectWithValue(e.response);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (args, {getState, requestId, rejectWithValue}) => {
    const {currentRequestId, loading} = getState().auth;

    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const {email, username, password, firstName, lastName} = args;

    try {
      const response = await authService.register({
        email,
        username,
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

export const passwordResetRequest = createAsyncThunk(
  'auth/passwordResetRequest',
  async (args, {getState, requestId, rejectWithValue}) => {
    const {currentRequestId, loading} = getState().auth;

    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const {email} = args;

    try {
      const response = await authService.passwordResetRequest({
        email
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
  isAuthenticated: false,
  accessToken: '',
  refreshToken: ''
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setState(state, action) {
      const {key, value} = action.payload;
      state[key] = value;
    },
    initialise(state) {
      TokenService.loadToken(jwt => {
        if (jwt) {
          state.accessToken = jwt.accessToken;
          state.refreshToken = jwt.refreshToken;
          state.isAuthenticated = true;
        }
      });
    },
    logout(state) {
      state.errors = [];
      state.isAuthenticated = false;
      state.accessToken = '';
      state.refreshToken = '';

      TokenService.resetToken();
    },
    resetErrors(state) {
      state.errors = [];
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.errors = [];
          state.isAuthenticated = false;
        }
      })
      .addCase(login.fulfilled, (state, action) => {
        const {requestId} = action.meta;
        if (
          state.loading === 'pending' &&
          state.currentRequestId === requestId
        ) {
          state.loading = 'idle';
          state.currentRequestId = undefined;
          state.errors = [];

          const {auth_key: accessToken, refresh_auth_key: refreshToken} =
            action.payload.data;

          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;

          TokenService.updateToken({
            accessToken: accessToken,
            refreshToken: refreshToken
          });
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = 'idle';
        state.errors = getErrorMessages(action.payload);
        state.currentRequestId = undefined;
        state.isAuthenticated = false;
      })
      .addCase(register.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.errors = [];
        }
      })
      .addCase(register.fulfilled, (state, action) => {
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
      .addCase(register.rejected, (state, action) => {
        state.loading = 'idle';
        state.errors = getErrorMessages(action.payload);
        state.currentRequestId = undefined;
      })
      .addCase(passwordResetRequest.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending';
          state.currentRequestId = action.meta.requestId;
          state.errors = [];
        }
      })
      .addCase(passwordResetRequest.fulfilled, (state, action) => {
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
      .addCase(passwordResetRequest.rejected, (state, action) => {
        state.loading = 'idle';
        state.errors = getErrorMessages(action.payload);
        state.currentRequestId = undefined;
      });
  }
});

export const {setState, initialise, logout, resetErrors} = authSlice.actions;

const {reducer: authReducer} = authSlice;
export default authReducer;
