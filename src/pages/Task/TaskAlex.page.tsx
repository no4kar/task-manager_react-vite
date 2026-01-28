import React from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  useReduxDispatch,
  useReduxAuthor,
  useReduxTasks,
} from '../../hooks';
import * as tasksSlice from '../../slices/tasks.slice';
import { TyTask } from '../../types/Task.type';
import {
  createSearchParamUpdater
} from '../../utils';

export function FuncComponent() {
  //#region Redux
  const {
    author,
  } = useReduxAuthor();
  const {
    items: tasks,
  } = useReduxTasks();
  const dispatch
    = useReduxDispatch();
  //#endregion 

  //#region RRD
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();
  const updateSearchParams
    = React.useCallback(
      createSearchParamUpdater(setSearchParams),
      [setSearchParams],
    );
  //#endregion 

  //#region CONST
  const tasksQuantity
    = tasks.length;
  const selectedTaskId
    = searchParams.get(TyTask.SearchParams.ID);
  const selectedTask
    = tasks.find(task => task.id === selectedTaskId)
    || null;

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
                [TyTask.SearchParams.ID]:
                  action.payload.id,
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
  //#endregion

  //#region useEffect
  React.useEffect(() => {
    if (author) {
      dispatch(tasksSlice.asyncThunk.getAll({
        userId: author.id,
      }));
    }
  }, [author, dispatch]);
  //#endregion

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="space-y-3">
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
          Welcome back
        </h2>

        <p className="text-slate-500 dark:text-slate-400 text-xl">
          {`You have ${tasksQuantity} task${tasksQuantity ? 's' : ''} to complete. Let's make it productive.`}
        </p>
      </div>
      <div className="bg-white dark:bg-card-dark rounded-2xl shadow-sm border border-slate-200 dark:border-border-dark p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <div className="flex flex-col">
          <div className="flex items-start gap-4 p-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-border-dark flex items-center justify-center shrink-0">
              <i className="fa-solid fa-pen-to-square text-slate-400"></i>
              {/* <i className="fa-solid fa-file-lines text-slate-400"></i> */}
            </div>
            <textarea className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-xl placeholder:text-slate-400 dark:placeholder:text-slate-600 h-14" placeholder="What needs to be done today?"></textarea>
          </div>

          <div
            className="flex items-center justify-between
            px-4 py-3 
            rounded-b-xl border-t border-slate-100 dark:border-border-dark
            bg-slate-50/50 dark:bg-surface-dark/30"
          >
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-border-dark transition-colors text-slate-500 dark:text-slate-400">
                <i className="fa-solid fa-calendar text-xl"></i>
              </button>

              <button className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-border-dark transition-colors text-slate-500 dark:text-slate-400">
                <i className="fa-solid fa-flag text-xl"></i>
                {/* <i className="fa-solid fa-flag-checkered text-xl"></i>
                <i className="fa-solid fa-triangle-exclamation text-xl"></i> */}
              </button>
            </div>

            <button
              className="bg-primary hover:bg-primary/90 
              text-surface-dark font-bold text-sm uppercase tracking-wider
              py-2.5 px-8 
              rounded-xl 
              transition-all 
              shadow-lg shadow-primary/20"
            >
              Create Task
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3
            className="flex items-center gap-2
          text-2xl font-bold"
          >
            Here is a list
          </h3>

          <div className="flex items-center gap-4">
            <button
              className="text-sm font-semibold text-slate-500 
            hover:text-slate-800 dark:hover:text-white 
            transition-colors">
              Sort
            </button>

            <span className="text-slate-300 dark:text-border-dark">
              |
            </span>

            <button
              className="text-sm font-semibold text-slate-500
            hover:text-slate-800 dark:hover:text-white
            transition-colors">
              Filter
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {tasks.map(task => (
            <div
              className="group 
            flex items-center gap-4
            p-5
            bg-white dark:bg-card-dark 
            border border-slate-200 dark:border-border-dark rounded-xl 
            hover:border-primary/50 hover:shadow-lg 
            transition-all"
            >
              <label
                className="relative 
              flex items-center justify-center 
              cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="w-6 h-6 
                rounded-lg border-2 border-slate-300 dark:border-slate-600 
                bg-transparent 
                text-primary 
                focus:ring-primary focus:ring-offset-0 
                transition-all"
                />
              </label>

              <div className="flex-1">
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">
                  {task.name}
                </h4>

                <div className="flex items-center gap-4 mt-1.5">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <i className="fa-solid fa-clock text-xs" />
                    <p>{task.createdAt}</p>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="p-2
                rounded-md
                opacity-0 group-hover:opacity-100 
                hover:bg-slate-100 dark:hover:bg-border-dark 
                transition-all">
                  <i className="fa-solid fa-ellipsis-vertical text-slate-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
