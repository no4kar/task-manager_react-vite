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
  loaded: boolean;
  registered: boolean;
  activated: boolean;
  errorMsg: string,
} = {
  author: null,
  loaded: false,
  registered: false,
  activated: false,
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
      // action: PayloadAction<TyAuth.Request.Login>,
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
          state.loaded = false;
          state.registered = false;
          state.errorMsg = '';
        })
      .addCase(
        registrationThunk.fulfilled,
        (state, action) => {
          console.info(action.payload);
          state.registered = true;
          state.loaded = true;
        })
      .addCase(
        registrationThunk.rejected,
        (state, action) => {
          console.error(action.error);

          state.errorMsg
            = action.error.message
            || 'Registration failed';

          state.loaded = true;
        });

    builder // activationThunk
      .addCase(
        activationThunk.pending,
        (state) => {
          state.loaded = false;
          state.errorMsg = '';
        })
      .addCase(
        activationThunk.fulfilled,
        (state, action) => {
          console.info(action.payload);
          accessTokenApi.save(action.payload.accessToken);

          state.author = action.payload.user;
          state.registered = true;
          state.activated = true;
          state.loaded = true;
        })
      .addCase(
        activationThunk.rejected,
        (state, action) => {
          console.error(action.error); // Log the actual error message

          state.errorMsg
            = action.error.message
            || 'Activation failed'; // Use the error message

          state.loaded = true;
        });

    builder // loginThunk
      .addCase(
        loginThunk.pending,
        (state) => {
          state.loaded = false;
          state.errorMsg = '';
        })
      .addCase(
        loginThunk.fulfilled,
        (state, action) => {
          console.info(action.payload);
          accessTokenApi.save(action.payload.accessToken);

          state.author = action.payload.user;
          state.registered = true;
          state.activated = true;
          state.loaded = true;
        })
      .addCase(
        loginThunk.rejected,
        (state, action) => {
          console.error(action.error); // Log the actual error message

          state.errorMsg
            = action.error.message
            || 'Login failed'; // Use the error message

          state.loaded = true;
        });

    builder // logoutThunk
      .addCase(
        logoutThunk.pending,
        (state) => {
          state.loaded = false;
          state.errorMsg = '';
        })
      .addCase(
        logoutThunk.fulfilled,
        (state, action) => {
          console.info(action.payload);
          accessTokenApi.remove();

          state.author = null;
          state.registered = false;
          state.activated = false;
          state.loaded = true;
        })
      .addCase(
        logoutThunk.rejected,
        (state, action) => {
          console.error(action.error); // Log the actual error message

          state.errorMsg
            = action.error.message
            || 'logout failed'; // Use the error message

          state.loaded = true;
        });

    builder // refreshThunk
      .addCase(
        refreshThunk.pending,
        (state) => {
          state.loaded = false;
          state.errorMsg = '';
        })
      .addCase(
        refreshThunk.fulfilled,
        (state, action) => {
          console.info(action.payload);
          accessTokenApi.save(action.payload.accessToken);

          state.author = action.payload.user;
          state.registered = true;
          state.activated = true;
          state.loaded = true;
        })
      .addCase(
        refreshThunk.rejected,
        (state, action) => {
          console.error(action.error); // Log the actual error message

          state.errorMsg
            = action.error.message
            || 'refresh failed'; // Use the error message

          state.loaded = true;
        });
  },
});
