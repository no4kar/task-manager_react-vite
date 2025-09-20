import {
  AsyncThunk,
  CaseReducer
} from '@reduxjs/toolkit';
import { TyGeneral } from './General.type';

type EmptyObject
  = TyGeneral.EmptyObject;

/* eslint @typescript-eslint/no-namespace: 'off' */
export namespace TyReduxHelper {

  /**
   * A typed wrapper for an async Redux thunk, parameterized by response and request types.
   * - `Res` = response payload type returned by the thunk
   * - `Req` = request parameters accepted by the thunk */
  export type ApiAsyncThunk<Res, Req>
    = AsyncThunk<Res, Req, EmptyObject>;

  export namespace Action {
    export type Pending<Res, Req>
      = ReturnType<ApiAsyncThunk<Res, Req>['pending']>;

    /**
     * Represents the fulfilled action type for a given AsyncThunk.
     * Useful for safely narrowing the action type in logic that checks `.fulfilled.match(action)`.*/
    export type Fulfilled<Res, Req>
      = ReturnType<ApiAsyncThunk<Res, Req>['fulfilled']>;

    export type Rejected<Res, Req>
      = ReturnType<ApiAsyncThunk<Res, Req>['rejected']>;
  }

  /**
  * Groups the three common reducers associated with an AsyncThunk:
  * - `pending` = when the request starts
  * - `fulfilled` = when the request succeeds
  * - `rejected` = when the request fails
  *
  * Useful for cleanly organizing reducer logic in slice definitions.*/
  export type ThunkReducerGroup<Res, Req, State> = {
    pending: [
      ApiAsyncThunk<Res, Req>['pending'],
      CaseReducer<
        State,
        Action.Pending<Res,Req>
        // ReturnType<ApiAsyncThunk<Res, Req>['pending']>
      >
    ];
    fulfilled: [
      ApiAsyncThunk<Res, Req>['fulfilled'],
      CaseReducer<
        State,
        Action.Fulfilled<Res,Req>
        // ReturnType<ApiAsyncThunk<Res, Req>['fulfilled']>
      >
    ];
    rejected: [
      ApiAsyncThunk<Res, Req>['rejected'],
      CaseReducer<
        State,
        Action.Rejected<Res,Req>
        // ReturnType<ApiAsyncThunk<Res, Req>['rejected']>
      >
    ];
  };
}
