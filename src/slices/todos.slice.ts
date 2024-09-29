import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AsyncThunk } from '@reduxjs/toolkit';

import { TyTodo } from '../types/Todo.type';
import { todosApi } from '../api/todos.api';

const sliceName = 'todos';

const initialState: {
  items: TyTodo.Item[];
  status: TyTodo.Status;
  errorMsg: TyTodo.Error,
} = {
  items: [] as TyTodo.Item[],
  status: TyTodo.Status.NONE,
  errorMsg: TyTodo.Error.NONE,
};

export const getAllThunk: AsyncThunk<
  TyTodo.Response.GetAll,
  TyTodo.Request.GetAll,
  Record<string, never>
> = createAsyncThunk(
  `${sliceName}/getAllThunk`,
  todosApi.getAll,
);

export const createThunk: AsyncThunk<
  TyTodo.Response.Create,
  TyTodo.Request.Create,
  Record<string, never>
> = createAsyncThunk(
  `${sliceName}/createThunk`,
  todosApi.create,
);

export const removeThunk: AsyncThunk<
  TyTodo.Item['id'],
  TyTodo.Item['id'],
  Record<string, never>
> = createAsyncThunk(
  `${sliceName}/removeThunk`,
  todosApi.remove,
);

export const updateThunk: AsyncThunk<
  TyTodo.Response.Update,
  TyTodo.Request.Update,
  Record<string, never>
> = createAsyncThunk(
  `${sliceName}/updateThunk`,
  todosApi.update,
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
    errorReset(state) {
      state.status = TyTodo.Status.NONE;
      state.errorMsg = TyTodo.Error.NONE;
    },
  },

  extraReducers: (builder) => {
    builder // getAllThunk
      .addCase(getAllThunk.pending, (state) => {
        state.status = TyTodo.Status.LOADING;
        state.errorMsg = TyTodo.Error.NONE;
      })
      .addCase(getAllThunk.fulfilled, (state, action) => {
        state.items = action.payload.content;
        state.status = TyTodo.Status.NONE;
      })
      .addCase(getAllThunk.rejected, (state, action) => {
        console.error(action.error.message);

        state.status = TyTodo.Status.ERROR;
        state.errorMsg = TyTodo.Error.LOAD;
      });

    builder // createThunk
      .addCase(createThunk.pending, (state) => {
        state.status = TyTodo.Status.LOADING;
        state.errorMsg = TyTodo.Error.NONE;
      })
      .addCase(createThunk.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.status = TyTodo.Status.NONE;
      })
      .addCase(createThunk.rejected, (state, action) => {
        console.error(action.error.message);

        state.status = TyTodo.Status.ERROR;
        state.errorMsg = TyTodo.Error.UNABLE_ADD;
      });

    builder // removeThunk
      .addCase(removeThunk.pending, (state) => {
        state.status = TyTodo.Status.LOADING;
        state.errorMsg = TyTodo.Error.NONE;
      })
      .addCase(removeThunk.fulfilled, (state, action) => {
        state.items
          = state.items.filter(item => item.id !== action.payload);
        state.status = TyTodo.Status.NONE;
      })
      .addCase(removeThunk.rejected, (state, action) => {
        console.error(action.error.message);

        state.status = TyTodo.Status.ERROR;
        state.errorMsg = TyTodo.Error.UNABLE_DELETE;
      });

    builder // updateThunk
      .addCase(updateThunk.pending, (state) => {
        state.status = TyTodo.Status.LOADING;
        state.errorMsg = TyTodo.Error.NONE;
      })
      .addCase(updateThunk.fulfilled, (state, action) => {
        const updatedItem = action.payload;

        state.items = state.items.map(item => (
          item.id !== updatedItem.id ? item : updatedItem));
        state.status = TyTodo.Status.NONE;
      })
      .addCase(updateThunk.rejected, (state, action) => {
        console.error(action.error.message);

        state.status = TyTodo.Status.ERROR;
        state.errorMsg = TyTodo.Error.UNABLE_UPDATE;
      });
  },
});
