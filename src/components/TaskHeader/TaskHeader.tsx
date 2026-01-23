import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import cn from 'classnames';

import { TyEvt } from '../../types/Evt.type';
import { TyTodo } from '../../types/Todo.type';
import { TyTask } from '../../types/Task.type';

import {
  useReduxDispatch,
  useReduxAuthor,
  useReduxTasks,
  useReduxTodos
} from '../../hooks';
import { Loader } from '../Loader';
import { DropdownReusable as Dropdown } from '../Dropdown';
import * as tasksSlice from '../../slices/tasks.slice';
import { createSearchParamUpdater } from '../../utils';

export const TaskHeader
  = React.memo(FuncComponent);

function FuncComponent({
  onTodoCreate,
  onTodoError = () => { },
}: {
  onTodoCreate: (todo: TyTodo.CreationAttributes)
    => Promise<TyTodo.Item | void>;
  onTodoError?: (errMsg: TyTodo.Error) => void;
}) {
  const [
    title,
    setTitle,
  ] = React.useState('');
  const titleInput
    = React.useRef<HTMLTextAreaElement>(null);

  //#region Redux
  const {
    items: todos,
    status: todosStatus,
  } = useReduxTodos();
  const {
    author,
  } = useReduxAuthor();
  const {
    items: tasks,
    status: tasksStatus,
  } = useReduxTasks();
  const dispatch
    = useReduxDispatch();
  //#endregion 

  //#region RRD
  const [
    searchParams,
    setSearchParams,
  ] = ReactRouterDom.useSearchParams();
  const updateSearchParams
    = React.useCallback(
      createSearchParamUpdater(setSearchParams),
      [setSearchParams],
    );
  //#endregion 

  const selectedTaskId
    = searchParams.get(TyTask.SearchParams.ID);
  const selectedTask
    = tasks.find(task => task.id === selectedTaskId)
    || null;

  const isTodosLoading
    = todosStatus === TyTodo.Status.LOADING;

  const handleInputChange
    = (event: TyEvt.Change.TextAreaElmt) => {
      setTitle(event.target.value);
    };

  const handleSelectTask
    = (taskId: TyTask.Item['id']) => {
      updateSearchParams(searchParams, {
        [TyTask.SearchParams.ID]: taskId,
      })
    };

  const handleCreateTask
    = React.useCallback(
      ({ name }: { name: TyTask.Item['name'] }) => {
        if (author) {
          dispatch(tasksSlice.asyncThunk.create({
            name,
            userId: author.id,
          })).then((action) => {
            if (tasksSlice.asyncThunk.create.fulfilled.match(action)) {
              updateSearchParams(searchParams, {
                [TyTask.SearchParams.ID]: action.payload.id,
              });
            }
          });
        }
      }, [author]);

  const handleUpdateTask
    = React.useCallback(
      ({ name }: { name: TyTask.Item['name'] }) => {
        if (selectedTask) {
          dispatch(tasksSlice.asyncThunk.update({
            ...selectedTask,
            name,
          })).then((action) => {
            if (tasksSlice.asyncThunk.update.fulfilled.match(action)) {
              updateSearchParams(searchParams, {
                [TyTask.SearchParams.ID]: action.payload.id,
              });
            }
          });
        }
      }, [selectedTask]);

  const handleRemoveTask
    = React.useCallback(
      (taskId: TyTask.Item['id']) => {
        dispatch(tasksSlice.asyncThunk.remove(taskId));
      }, []);

  const handleSubmit
    = (event: React.FormEvent) => {
      event.preventDefault();
      const trimedTitle = title.trim();

      if (trimedTitle === '') {
        onTodoError(TyTodo.Error.EMPTY_TITLE);
        return;
      }

      if (titleInput.current?.disabled) {
        return;
      }

      if (titleInput.current) {
        titleInput.current.disabled = true;
      }

      if (!author
        || !selectedTask) {
        onTodoError(TyTodo.Error.UNABLE_ADD);
        return;
      }

      onTodoCreate({
        userId: author.id,
        taskId: selectedTask.id,
        title: trimedTitle,
        completed: false,
      }).finally(() => {
        if (titleInput.current) {
          titleInput.current.disabled = false;
          titleInput.current.focus();
        }

        setTitle('');
      });
    };

  React.useEffect(() => {
    if (titleInput.current) {
      titleInput.current.focus();
    }
  }, [titleInput]);

  React.useEffect(() => {
    if (author) {
      dispatch(tasksSlice.asyncThunk.getAll({
        userId: author.id,
      }));
    }
  }, [author, dispatch]);

  return (
    <header className='todo__header space-y-2 sm:space-y-4'>
      <h1
        className='font-base font-bold font-bold 
        text-2xl sm:text-3xl text-center'
      >
        The {author?.email}'s tasks
      </h1>

      <div
        className='text-center'
      >
        <Dropdown
          items={tasks}
          selectedItem={selectedTask}
          isProcessing={tasksStatus === TyTask.Status.LOADING}
          onItem={{
            select: handleSelectTask,
            create: handleCreateTask,
            update: handleUpdateTask,
            remove: handleRemoveTask,
          }}
        />
      </div>

      {selectedTask && (
        <form
          className='relative'
          onSubmit={handleSubmit}
        >
          {!todos.length && isTodosLoading && (
            <Loader
              style={{
                container: `absolute inset-0 z-[1] 
            flex items-center justify-center 
            bg-white bg-opacity-30 rounded`,
              }}
            >
              <h1
                className='text-lg sm:text-xl font-bold 
                bg-transparent text-white animate-bounce'
              >
                Loading is in progress...
              </h1>
            </Loader>
          )}

          <div className={cn('flex space-x-2',
            'min-h-16 sm:min-h-32', {
            'pointer-events-none blur-[2px]': !todos.length && isTodosLoading,
          })}>
            <textarea
              ref={titleInput}
              className='flex-1 p-2 rounded min-h-full
            bg-gray-700 text-white placeholder-gray-400'
              value={title}
              onChange={handleInputChange}
              placeholder='What are you planning to do?'
            //rows={4} // replaced by 'min-h-16'
            />

            <button
              type='submit'
              className='px-4 py-2 rounded
            bg-system-warn text-black 
            hover:opacity-70'
            >
              <i className='fa-solid fa-plus' />
            </button>
          </div>
        </form>
      )}
    </header>
  );
}


{/* <div class="btn-icon btn-menu-toggle attach-file"><span class="tgico"></span></div> */ }
{/* <input type="file" multiple="" style="display: none;"></input> */ }