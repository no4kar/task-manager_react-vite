import {
  createSlice,
} from '@reduxjs/toolkit';

import { TyAuth as TySlice } from '../types/Auth.type';
import { authApi as sliceApi } from '../api/auth.api';
import { accessTokenApi } from '../api/accessToken.api';
import { slices as sliceNames } from '../utils/entities';
import { logger } from '../utils/logger';
import { TyReduxHelper } from '../types/ReduxHelper.type';
import { getAsyncThunk } from './helper.slice';

type ApiAsyncThunk<Req, Res>
  = TyReduxHelper.ApiAsyncThunk<Req, Res>;

type SliceAsyncThunks = {
  registration: ApiAsyncThunk<
    TySlice.Response.Registration,
    TySlice.Request.Registration
  >;
  activation: ApiAsyncThunk<
    TySlice.Response.Activation,
    TySlice.Request.Activation
  >;
  login: ApiAsyncThunk<
    TySlice.Response.Login,
    TySlice.Request.Login
  >;
  logout: ApiAsyncThunk<
    TySlice.Response.Logout,
    undefined // because createAsyncThunk always expects the thunk function to accept one argument, and if the function has no parameters, TS infers undefined
  // TySlice.Request.Logout
  >;
  refresh: ApiAsyncThunk<
    TySlice.Response.Refresh,
    undefined
  // TySlice.Request.Refresh
  >;
};

const {
  author: sliceName
} = sliceNames;

// Helper function to create async thunks
const sliceAsyncThunk
  = getAsyncThunk<SliceAsyncThunks>(sliceName);

// Grouping async thunks
export const asyncThunk: SliceAsyncThunks = {
  registration: sliceAsyncThunk('registration', sliceApi.registration),
  activation: sliceAsyncThunk('activation', sliceApi.activation),
  login: sliceAsyncThunk('login', sliceApi.login),
  logout: sliceAsyncThunk('logout', sliceApi.logout),
  refresh: sliceAsyncThunk('refresh', sliceApi.refresh),
};

const initialState: {
  author: TySlice.Item | null;
  status: TySlice.Status;
  errorMsg: string;
} = {
  author: null,
  status: TySlice.Status.UNAUTHENTICATED,
  errorMsg: TySlice.Error.NONE,
};

export const {
  actions: {
    errorReset,
    reset,
  },
  reducer,
} = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    errorReset(
      state,
    ) {
      state.status = TySlice.Status.NONE;
      state.errorMsg = TySlice.Error.NONE;
    },

    reset(state) {
      state.author = null;
      state.status = TySlice.Status.NONE;
      state.errorMsg = TySlice.Error.NONE;
    },
  },

  extraReducers: (builder) => {
    builder // asyncThunk.registration
      .addCase(
        asyncThunk.registration.pending,
        (state) => {
          state.errorMsg = TySlice.Error.NONE;
          state.status = TySlice.Status.LOADING;
        })
      .addCase(
        asyncThunk.registration.fulfilled,
        (state) => {
          state.status = TySlice.Status.REGISTERED;
        })
      .addCase(
        asyncThunk.registration.rejected,
        (state, action) => {
          logger.error(action);
          state.errorMsg
            = action.error.message
            || TySlice.Error.REGISTERATION;
          state.status = TySlice.Status.ERROR;
          state.author = null;
        });

    builder // asyncThunk.activation
      .addCase(
        asyncThunk.activation.pending,
        (state) => {
          state.errorMsg = TySlice.Error.NONE;
          state.status = TySlice.Status.LOADING;
        })
      .addCase(
        asyncThunk.activation.fulfilled,
        (state, action) => {
          accessTokenApi.save(action.payload.accessToken);
          state.author = action.payload.user;
          state.status = TySlice.Status.ACTIVATED;
        })
      .addCase(
        asyncThunk.activation.rejected,
        (state, action) => {
          logger.error(action);
          state.errorMsg
            = action.error.message
            || TySlice.Error.ACTIVATION;
          state.status = TySlice.Status.ERROR;
          state.author = null;
        });

    builder // asyncThunk.login
      .addCase(
        asyncThunk.login.pending,
        (state) => {
          state.errorMsg = TySlice.Error.NONE;
          state.status = TySlice.Status.LOADING;
        })
      .addCase(
        asyncThunk.login.fulfilled,
        (state, action) => {
          accessTokenApi.save(action.payload.accessToken);
          state.author = action.payload.user;
          state.status = TySlice.Status.ACTIVATED;
        })
      .addCase(
        asyncThunk.login.rejected,
        (state, action) => {
          logger.error(action);
          state.errorMsg
            = action.error.message
            || TySlice.Error.LOGIN;
          state.status = TySlice.Status.ERROR;
          state.author = null;
        });

    builder // asyncThunk.logout
      .addCase(
        asyncThunk.logout.pending,
        (state) => {
          state.errorMsg = TySlice.Error.NONE;
          state.status = TySlice.Status.LOADING;
        })
      .addCase(
        asyncThunk.logout.fulfilled,
        (state) => {
          accessTokenApi.remove();
          state.author = null;
          state.status = TySlice.Status.UNAUTHENTICATED;
        })
      .addCase(
        asyncThunk.logout.rejected,
        (state, action) => {
          logger.error(action);
          state.errorMsg
            = action.error.message
            || TySlice.Error.LOGOUT;
          state.status = TySlice.Status.ERROR;
          state.author = null;
        });

    builder // asyncThunk.refresh
      .addCase(
        asyncThunk.refresh.pending,
        (state) => {
          state.errorMsg = TySlice.Error.NONE;
          state.status = TySlice.Status.LOADING;
        })
      .addCase(
        asyncThunk.refresh.fulfilled,
        (state, action) => {
          accessTokenApi.save(action.payload.accessToken);
          state.author = action.payload.user;
          state.status = TySlice.Status.ACTIVATED;
        })
      .addCase(
        asyncThunk.refresh.rejected,
        (state, action) => {
          logger.error(action);
          state.errorMsg
            = action.error.message
            || TySlice.Error.REFRESH;
          state.status = TySlice.Status.ERROR;
          state.author = null;
        });

    // Note: No extraReducers for activationAndGetAllTasksThunk as it primarily dispatches another action
    // and its fulfilled state doesn't directly modify this slice differently than asyncThunk.activation.fulfilled
  },
});