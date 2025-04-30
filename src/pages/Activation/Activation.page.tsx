import React from 'react';
import {
  Navigate,
  useParams,
} from 'react-router-dom';

import { TyAuth } from '../../types/Auth.type';

import { useReduxSelector, useReduxDispatch } from '../../store/hooks';
import { selectFromStore } from '../../store/store';
import * as authSlice from '../../slices/auth.slice';
import { Loader } from '../../components/Loader';

export const ActivationPage = React.memo(FuncComponent);

function FuncComponent() {
  const {
    status: authStatus,
    errorMsg,
  } = useReduxSelector(selectFromStore('author'));
  const {
    activationToken = 'unknown',
  } = useParams();
  const dispatch = useReduxDispatch();

  React.useEffect(() => {
    dispatch(authSlice.asyncThunk.activation(activationToken));
  }, []);

  let content: JSX.Element = (
    <Navigate to={'/'} />
  );


  if (authStatus === TyAuth.Status.LOADING) {
    content = (
      <Loader />
    );
  }

  if (errorMsg) {
    content = (
      <p className='text-system-error border border-red-400 p-4 rounded'>
        {errorMsg}
      </p>
    );
  }

  if (!errorMsg
    && authStatus === TyAuth.Status.ACTIVATED) {
    content = (
      <p>Your account is now active</p>
    );
  }

  return (
    <div className='custom-page-container py-4 sm:py-6 md:py-10'>
      <div className='w-full max-w-md p-8 mx-auto
      bg-gray-800 text-gray-400 rounded-lg shadow-md space-y-6'>
        <div
          className='flex items-center justify-center flex-col gap-4'
        >
          <h2 className='text-2xl font-robotomono-bold font-bold text-white'>
            Account activation
          </h2>

          {content}
        </div>
      </div>
    </div>
  );
}
