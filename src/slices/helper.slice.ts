import { createAsyncThunk } from '@reduxjs/toolkit';
import { TyReduxHelper } from '../types/ReduxHelper.type';

type ApiAsyncThunk<Res, Req>
  = TyReduxHelper.ApiAsyncThunk<Res, Req>;

// Helper function to create async thunks
export function getAsyncThunk<
  SliceAsyncThunks,
>(sliceName: string) {

  return <Res, Req>(
    action: keyof SliceAsyncThunks,
    fn: (arg: Req) => Promise<Res>
  ): ApiAsyncThunk<Res, Req> => {
    return createAsyncThunk<Res, Req>(
      `${sliceName}/${String(action)}Thunk`,
      fn);
  };
}
