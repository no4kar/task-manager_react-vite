import { createSlice } from '@reduxjs/toolkit';

import { TyReduxHelper } from '../types/ReduxHelper.type';
import { TyTodo as TySlice } from '../types/Todo.type';
import { todosApi as sliceApi } from '../api/todos.api';
import { slices as sliceNames } from '../utils/entities';
import { logger } from '../utils/logger';
import { getAsyncThunk } from './helper.slice';

type ApiAsyncThunk<Req, Res>
  = TyReduxHelper.ApiAsyncThunk<Req, Res>;

type SliceAsyncThunks = {
  getAll: ApiAsyncThunk<
    TySlice.Response.GetAll,
    TySlice.Request.GetAll
  >;
  create: ApiAsyncThunk<
    TySlice.Response.Create,
    TySlice.Request.Create
  >;
  update: ApiAsyncThunk<
    TySlice.Response.Update,
    TySlice.Request.Update
  >;
  remove: ApiAsyncThunk<
    TySlice.Response.Remove,
    TySlice.Request.Remove
  >;
};

const { 
  todos: sliceName
 } = sliceNames;

// Helper function to create async thunks
const sliceAsyncThunk
  = getAsyncThunk<SliceAsyncThunks>(sliceName);

// Grouping async thunks
export const asyncThunk: SliceAsyncThunks = {
  getAll: sliceAsyncThunk('getAll', sliceApi.getAll),
  create: sliceAsyncThunk('create', sliceApi.create),
  update: sliceAsyncThunk('update', sliceApi.update),
  remove: sliceAsyncThunk('remove', sliceApi.remove),
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
