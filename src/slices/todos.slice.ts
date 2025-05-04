import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AsyncThunk } from '@reduxjs/toolkit';

import { TyGeneral } from '../types/General.type';
import { TyTodo as TySlice } from '../types/Todo.type';
import { todosApi as sliceApi } from '../api/todos.api';
import sliceNames from './names';
import { logger } from '../utils/logger';

type SliceAsyncThunkThunk<Req, Res>
  = TyGeneral.ApiAsyncThunk<Req, Res>;
type SliceAsyncThunkThunks = {
  getAll: SliceAsyncThunkThunk<
    TySlice.Response.GetAll,
    TySlice.Request.GetAll
  >;
  create: SliceAsyncThunkThunk<
    TySlice.Response.Create,
    TySlice.Request.Create
  >;
  update: SliceAsyncThunkThunk<
    TySlice.Response.Update,
    TySlice.Request.Update
  >;
  remove: SliceAsyncThunkThunk<
    TySlice.Response.Remove,
    TySlice.Request.Remove
  >;
};

const { todo: sliceName } = sliceNames;

// Helper function to create async thunks
function getAsyncThunk<Res, Req>(
  action: keyof SliceAsyncThunkThunks,
  fn: (arg: Req) => Promise<Res>
): AsyncThunk<Res, Req, Record<string, never>> {
  return createAsyncThunk<Res, Req>(
    `${sliceName}/${action}Thunk`,
    fn);
}

// Grouping async thunks
export const asyncThunk: SliceAsyncThunkThunks = {
  getAll: getAsyncThunk('getAll', sliceApi.getAll),
  create: getAsyncThunk('create', sliceApi.create),
  update: getAsyncThunk('update', sliceApi.update),
  remove: getAsyncThunk('remove', sliceApi.remove),
};

const initialState: {
  items: TySlice.Item[];
  status: TySlice.Status;
  errorMsg: TySlice.Error,
} = {
  items: [] as TySlice.Item[],
  status: TySlice.Status.NONE,
  errorMsg: TySlice.Error.NONE,
};

export const {
  actions: { // export the actions
    errorReset,
    reset,
  },
  reducer,
} = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    errorReset(state) {
      state.status = TySlice.Status.NONE;
      state.errorMsg = TySlice.Error.NONE;
    },

    reset(state) {
      state.items = [];
      state.status = TySlice.Status.NONE;
      state.errorMsg = TySlice.Error.NONE;
    },
  },

  extraReducers: (builder) => {
    builder // asyncThunk.getAll
      .addCase(asyncThunk.getAll.pending, (state) => {
        state.status = TySlice.Status.LOADING;
        state.errorMsg = TySlice.Error.NONE;
      })
      .addCase(asyncThunk.getAll.fulfilled, (state, action) => {
        state.items = action.payload.content;
        state.status = TySlice.Status.NONE;
      })
      .addCase(asyncThunk.getAll.rejected, (state, action) => {
        logger.error(action);

        state.status = TySlice.Status.ERROR;
        state.errorMsg = TySlice.Error.LOAD;
      });

    builder // asyncThunk.create
      .addCase(asyncThunk.create.pending, (state) => {
        state.status = TySlice.Status.LOADING;
        state.errorMsg = TySlice.Error.NONE;
      })
      .addCase(asyncThunk.create.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.status = TySlice.Status.NONE;
      })
      .addCase(asyncThunk.create.rejected, (state, action) => {
        logger.error(action);

        state.status = TySlice.Status.ERROR;
        state.errorMsg = TySlice.Error.UNABLE_ADD;
      });

    builder // asyncThunk.remove
      .addCase(asyncThunk.remove.pending, (state) => {
        state.status = TySlice.Status.LOADING;
        state.errorMsg = TySlice.Error.NONE;
      })
      .addCase(asyncThunk.remove.fulfilled, (state, action) => {
        state.items
          = state.items.filter(item => item.id !== action.payload);
        state.status = TySlice.Status.NONE;
      })
      .addCase(asyncThunk.remove.rejected, (state, action) => {
        logger.error(action);

        state.status = TySlice.Status.ERROR;
        state.errorMsg = TySlice.Error.UNABLE_DELETE;
      });

    builder // asyncThunk.update
      .addCase(asyncThunk.update.pending, (state) => {
        state.status = TySlice.Status.LOADING;
        state.errorMsg = TySlice.Error.NONE;
      })
      .addCase(asyncThunk.update.fulfilled, (state, action) => {
        const updatedItem = action.payload;

        state.items = state.items.map(item => (
          item.id !== updatedItem.id ? item : updatedItem));
        state.status = TySlice.Status.NONE;
      })
      .addCase(asyncThunk.update.rejected, (state, action) => {
        logger.error(action);

        state.status = TySlice.Status.ERROR;
        state.errorMsg = TySlice.Error.UNABLE_UPDATE;
      });
  },
});
