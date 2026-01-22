import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  useReduxDispatch,
} from '../../store/hooks';
import { useReduxAuthor } from '../../store/useReduxAuthor';
import * as authSlice from '../../slices/auth.slice';
import { Loader } from '../Loader';
import { TyAuth } from '../../types/Auth.type';

export const RequireAuth
  = React.memo(FuncComponent);

function FuncComponent() {
  //#region RRD
  const location
    = useLocation();
  //#endregion RRD

  //#region Redux
  const {
    author,
    status: authStatus,
  } = useReduxAuthor();
  const dispatch
    = useReduxDispatch();
  //#endregion RRD

  React.useEffect(() => {
    if (!author) {
      dispatch(authSlice.asyncThunk.refresh());
    }
  }, []);

  if (authStatus === TyAuth.Status.LOADING) {
    return <Loader
      style={{
        container: `project-page-container
        py-4 sm:py-6 md:py-10
        h-full flex flex-col gap-4 items-center justify-center`
      }}>
      <>
        <h1 className='text-lg sm:text-xl font-bold bg-transparent text-white'>
          Processing...
        </h1>

        <p className='text-xs sm:text-sm font-light text-system-warn 
        animate-pulse'
        >
          Remember about 50 sec delay.
        </p>
      </>
    </Loader>;
  }

  if (!author
    || authStatus !== TyAuth.Status.ACTIVATED) {
    return (
      <Navigate
        to='/login'
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}
