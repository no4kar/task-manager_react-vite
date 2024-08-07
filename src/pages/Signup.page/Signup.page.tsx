import React from 'react';
import {
  Link,
} from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import cn from 'classnames';

import * as authSlice from '../../slices/auth.slice';
import { useReduxSelector, useReduxDispatch } from '../../store/hooks';
import { selectFromStore } from '../../store/store';

import { authValidation } from '../../constants/formValidation';
import { TyForm } from '../../types/Form.type';
import { FormField } from '../../components/FormField';
// import { Loader } from '../../components/Loader';

export const SignupPage = React.memo(FuncComponent);

function FuncComponent() {
  const { errorMsg } = useReduxSelector(selectFromStore('author'));
  const [sent, setSent] = React.useState(false);
  const dispatch = useReduxDispatch();
  const {
    register,
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
  } = useForm<TyForm.Auth>({
    mode: 'onChange',
  });

  if (sent) {
    return (
      <div className='custom-page-container py-4 sm:py-6 md:py-10'>
        <div className='w-full max-w-md p-8 mx-auto
      bg-gray-800 text-gray-400 rounded-lg shadow-md space-y-6'>
          <div
            className='flex items-center justify-center flex-col gap-4'
          >
            <h2 className='text-2xl font-robotomono-bold font-bold text-white'>
              Check your email
            </h2>

            <p>We have sent you an email with the activation link</p>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit: SubmitHandler<TyForm.Auth>
    = async (data) => {
      try {
        await dispatch(authSlice.registrationThunk(data))
          .then(() => setSent(true));
        // await login(data);
        // navigate(location.state?.from?.pathname || '/');
      } catch (error) {
        console.error(error);
        alert((error as AxiosError).message);
      }
    };

  return (
    <div className='custom-page-container py-4 sm:py-6 md:py-10'>
      <div className='w-full max-w-md p-8 mx-auto
      bg-gray-800 text-gray-400 rounded-lg shadow-md space-y-6'>
        <div
          className='flex items-center justify-center'
        >
          <h2 className='text-2xl font-robotomono-bold font-bold text-white'>
            Sign Up
          </h2>
        </div>

        <form
          className='
          w-full p-4
          rounded bg-gray-700
          flex flex-col gap-5'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div
            className='flex-1 flex flex-col gap-2'
          >
            <FormField<TyForm.Auth>
              type='email'
              textLabel='E-mail'
              name='email'
              register={register}
              errors={errors}
              required
              validation={authValidation.email}
              placeholder='your@email.com'
            />

            <FormField<TyForm.Auth>
              type='password'
              textLabel='Password'
              name='password'
              register={register}
              errors={errors}
              required
              validation={authValidation.password}
              placeholder='your password'
            />
          </div>

          <button
            type='submit'
            disabled={!isValid}
            title='You can leave default values'
            className={cn('w-full py-2 bg-red-600 text-white rounded hover:opacity-70', {
              'blur-[2px]': !isValid,
            })}
          >
            <p className='flex items-center justify-center font-bold'>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </p>
          </button>
        </form>

        {/* <div className='text-center space-y-4'>
          <p>Login via social networks</p>
          <button className='w-full py-2 
          bg-white text-gray-800 font-bold rounded hover:opacity-70'>
            Google
          </button>
        </div> */}

        <div className='text-center'>
          <p>
            {'Already have an account? '}
            <Link to='/login' className='inline hover:underline'>Log in</Link>
          </p>
        </div>

        {errorMsg && (
          <p className='bg-red-100 text-system-error border border-red-400 p-4 rounded'>
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}
