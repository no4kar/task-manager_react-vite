import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
  // PayloadAction,
} from '@reduxjs/toolkit';

import { authApi } from '../api/auth.api';
import { TyAuth } from '../types/Auth.type';
import { accessTokenApi } from '../api/accessToken.api';

const sliceName = 'author';

const initialState: {
  author: TyAuth.Item | null;
  status: TyAuth.Status;
  errorMsg: string,
} = {
  author: null,
  status: TyAuth.Status.UNAUTHENTICATED,
  errorMsg: '',
};

export const registrationThunk: AsyncThunk<
  TyAuth.Response.Registration,
  TyAuth.Request.Registration,
  Record<string, never>
> = createAsyncThunk(
  `${sliceName}/registrationThunk`,
  authApi.registration,
);

export const activationThunk: AsyncThunk<
  TyAuth.Response.Activation,
  TyAuth.Request.Activation['activationToken'],
  Record<string, never>
> = createAsyncThunk(
  `${sliceName}/activationThunk`,
  authApi.activation,
);

export const loginThunk: AsyncThunk<
  TyAuth.Response.Login,
  TyAuth.Request.Login,
  Record<string, never>
> = createAsyncThunk(
  `${sliceName}/loginThunk`,
  authApi.login,
);

export const logoutThunk: AsyncThunk<
  void,
  void,
  Record<string, never>
> = createAsyncThunk(
  `${sliceName}/logoutThunk`,
  authApi.logout,
);

export const refreshThunk: AsyncThunk<
  TyAuth.Response.Refresh,
  void,
  Record<string, never>
> = createAsyncThunk(
  `${sliceName}/refreshThunk`,
  authApi.refresh,
);

export const {
  actions: {
    errorReset,
  },
  reducer,
} = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    errorReset(
      state,
    ) {
      state.errorMsg = '';
      return state;
    },
  },

  extraReducers: (builder) => {
    builder // registrationThunk
      .addCase(
        registrationThunk.pending,
        (state) => {
          state.errorMsg = '';
          state.status = TyAuth.Status.LOADING;
        })
      .addCase(
        registrationThunk.fulfilled,
        (state, action) => {
          console.info(action.payload);

          state.status = TyAuth.Status.REGISTERED;
        })
      .addCase(
        registrationThunk.rejected,
        (state, action) => {
          console.error(action.error);

          state.errorMsg
          = action.error.message
          || 'Registration failed';
          state.status = TyAuth.Status.ERROR;
        });

    builder // activationThunk
      .addCase(
        activationThunk.pending,
        (state) => {
          state.errorMsg = '';
          state.status = TyAuth.Status.LOADING;
        })
      .addCase(
        activationThunk.fulfilled,
        (state, action) => {
          console.info(action.payload);

          accessTokenApi.save(action.payload.accessToken);
          state.author = action.payload.user;
          state.status = TyAuth.Status.ACTIVATED;
        })
      .addCase(
        activationThunk.rejected,
        (state, action) => {
          console.error(action.error); // Log the actual error message

          state.errorMsg
          = action.error.message
          || 'Activation failed'; // Use the error message
          state.status = TyAuth.Status.ERROR;
        });

    builder // loginThunk
      .addCase(
        loginThunk.pending,
        (state) => {
          state.errorMsg = '';
          state.status = TyAuth.Status.LOADING;
        })
      .addCase(
        loginThunk.fulfilled,
        (state, action) => {
          console.info(action.payload);

          accessTokenApi.save(action.payload.accessToken);
          state.author = action.payload.user;
          state.status = TyAuth.Status.ACTIVATED;
        })
      .addCase(
        loginThunk.rejected,
        (state, action) => {
          console.error(action.error); // Log the actual error message

          state.errorMsg
          = action.error.message
          || 'Login failed'; // Use the error message
          state.status = TyAuth.Status.ERROR;
        });

    builder // logoutThunk
      .addCase(
        logoutThunk.pending,
        (state) => {
          state.errorMsg = '';
          state.status = TyAuth.Status.LOADING;
        })
      .addCase(
        logoutThunk.fulfilled,
        (state, action) => {
          console.info(action.payload);

          accessTokenApi.remove();
          state.author = null;
          state.status = TyAuth.Status.UNAUTHENTICATED;
        })
      .addCase(
        logoutThunk.rejected,
        (state, action) => {
          console.error(action.error); // Log the actual error message

          // accessTokenApi.remove();
          // state.author = null;
          state.errorMsg
          = action.error.message
          || 'logout failed'; // Use the error message
          state.status = TyAuth.Status.ERROR;
        });

    builder // refreshThunk
      .addCase(
        refreshThunk.pending,
        (state) => {
          state.errorMsg = '';
          state.status = TyAuth.Status.LOADING;
        })
      .addCase(
        refreshThunk.fulfilled,
        (state, action) => {
          console.info(action.payload);
          accessTokenApi.save(action.payload.accessToken);

          state.author = action.payload.user;
          state.status = TyAuth.Status.ACTIVATED;
        })
      .addCase(
        refreshThunk.rejected,
        (state, action) => {
          console.error(action.error); // Log the actual error message

          state.errorMsg
            = action.error.message
            || 'refresh failed'; // Use the error message
          state.status = TyAuth.Status.ERROR;
        });
  },
});
