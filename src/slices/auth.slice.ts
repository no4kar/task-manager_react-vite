import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import { TyGeneral } from '../types/General.type';
import { TyAuth as TySlice } from '../types/Auth.type';
import { authApi as sliceApi } from '../api/auth.api';
import { accessTokenApi } from '../api/accessToken.api';
import sliceNames from './names';

export type ApiAsyncThunk<Req, Res>
  = TyGeneral.ApiAsyncThunk<Req, Res>;

const { author: sliceName } = sliceNames;

// Helper function to create async thunks
function getAsyncThunk<Res, Req>(
  action: string,
  fn: (arg: Req) => Promise<Res>
): AsyncThunk<Res, Req, Record<string, never>> {
  return createAsyncThunk<Res, Req>(
    `${sliceName}/${action}Thunk`,
    fn);
}

// import * as tasksSlice from './tasks.slice';
// // Special thunk with custom logic involving dispatch
// export const activationAndGetAllTasksThunk: AsyncThunk<
//   TySlice.Response.Activation,
//   TySlice.Request.Activation,
//   Record<string, never>
// > = createAsyncThunk(
//   `${sliceName}/activationAndGetAllTasksThunk`, // Use a distinct name
//   async (activationToken: TySlice.Request.Activation,
//     { dispatch },
//   ) => {
//     // Perform the activation API call
//     const response = await sliceApi.activation(activationToken);

//     // Chain asyncThunk.getAll to fetch tasks for the activated user
//     dispatch(tasksSlice.asyncThunk.getAll({
//       userId: response.user.id,
//     }));

//     // Return the response for potential use (though not handled in extraReducers below)
//     return response;
//   }
// );


// Grouping async thunks
export const asyncThunk: {
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
    TySlice.Request.Logout
  >;
  refresh: ApiAsyncThunk<
    TySlice.Response.Refresh,
    TySlice.Request.Refresh
  >;
} = {
  registration: getAsyncThunk('registration', sliceApi.registration),
  activation: getAsyncThunk('activation', sliceApi.activation),
  login: getAsyncThunk('login', sliceApi.login),
  logout: getAsyncThunk('logout', sliceApi.logout),
  refresh: getAsyncThunk('refresh', sliceApi.refresh),
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
          console.error(action);
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
          console.error(action);
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
          console.error(action);
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
          console.error(action);
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
          console.error(action);
          state.errorMsg
            = action.error.message
            || TySlice.Error.REFRESH;
          state.status = TySlice.Status.ERROR;
          state.author = null;
        });
  },
});
