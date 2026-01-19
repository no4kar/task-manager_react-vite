import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReduxDispatch, useReduxSelector } from '../../store/hooks';
import { selectFromStore } from '../../store/store';
import * as authSlice from '../../slices/auth.slice';
import * as tasksSlice from '../../slices/tasks.slice';
import * as todosSlice from '../../slices/todos.slice';

export const PageHeader = React.memo(FuncComponent);

function FuncComponent() {
  const {
    author,
    // status: authorStatus,
  } = useReduxSelector(selectFromStore('author'));
  const dispatch = useReduxDispatch();
  const navigate = useNavigate();

  return (
    <header
      className='page__header
    project-page-container 
    w-full py-4 sm:py-6 md:py-10 bg-gray-800'
    >
      <div
        className='
      header__nav flex justify-between
      text-base sm:text-xl font-bold'
      >
        <div
          className='
        header__nav-start flex gap-4'
        >
          <Link
            to='/'
            className='w-fit p-2
          bg-indigo-400 text-white rounded hover:opacity-70'
          >
            <p className='flex items-center justify-center'>
              Home
            </p>
          </Link>

          <Link
            to='/tasks'
            className='w-fit p-2
          bg-indigo-400 text-white rounded hover:opacity-70'
          >
            <p className='flex items-center justify-center'>
              Tasks
            </p>
          </Link>
        </div>

        <div
          className='
        header__nav-end flex gap-4 justify-end'
        >
          {(author) ? (
            <button className='w-fit p-2 
          bg-red-400 text-white rounded hover:opacity-70'
              onClick={() => {
                dispatch(authSlice.asyncThunk.logout())
                  .then(() => {
                    dispatch(tasksSlice.reset());
                    dispatch(todosSlice.reset());
                    navigate('/');
                  })
              }}
            >
              <p className='flex items-center justify-center'>
                {'Log Out'}
              </p>
            </button>
          ) : (
            <>
              <Link
                to='/signup'
                className='w-fit p-2 
          bg-system-warn text-white rounded hover:opacity-70'
              >
                <p className='flex items-center justify-center'>
                  Sign up
                </p>
              </Link>

              <Link
                to='/login'
                className='w-fit p-2 
          bg-system-success text-white rounded hover:opacity-70'
              >
                <p className='w-fit flex items-center justify-center'>
                  Log in
                </p>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
