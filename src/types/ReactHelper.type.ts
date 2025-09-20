import React from 'react';

/* eslint @typescript-eslint/no-namespace: 'off' */
export namespace TyReactHelper {
  export type SetState<T>
    = React.Dispatch<React.SetStateAction<T>>;
  export type UseState<T>
    = (initSt: T | (() => T)) => [T, SetState<T>];
}
