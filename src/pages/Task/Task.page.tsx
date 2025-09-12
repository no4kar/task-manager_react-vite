import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import { AxiosResponse } from 'axios';

import { useReduxDispatch, useReduxSelector } from '../../store/hooks';
import * as todosSlice from '../../slices/todos.slice';
import { selectFromStore } from '../../store/store';

import { TyTodo } from '../../types/Todo.type';
import { TyTask } from '../../types/Task.type';
import { TyEvt } from '../../types/Evt.type';

import { TaskHeader } from '../../components/TaskHeader';
import { TodoItem } from '../../components/TodoItem';
import { SimplePagination as Pagination } from '../../components/Pagination';
import { ItemsPerPage } from '../../components/ItemsPerPage';
import { createSearchParamUpdater } from '../../utils';
import { Loader } from '../../components/Loader';
import { logger } from '../../utils/logger';

const {
  ID,
  ITEM_PER_PAGE,
  PAGE,
} = TyTask.SearchParams;

export const TaskPage
  = React.memo(FuncComponent);

const optionsPerPage = [5, 10, 20];
const defualtPage = '1';

function FuncComponent() {
  //#region useState
  const [
    totalItems,
    setTotalItems
  ] = React.useState<number>(0);
  const [
    processings,
    setProcessings
  ] = React.useState<TyTodo.Item['id'][]>([]);
  //#endregion useState

  //#region RTK
  const {
    items: todos,
    status: todosStatus,
  } = useReduxSelector(selectFromStore('todos'));
  const dispatch = useReduxDispatch();
  //#endregion RTK

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
  //#endregion RRD

  //#region const
  const selectedTaskId
    = searchParams.get(ID);
  const itemsPerPage
    = Number(searchParams.get(ITEM_PER_PAGE));
  const currentPage
    = Number(searchParams.get(PAGE));
  const isTodosLoading
    = todosStatus === TyTodo.Status.LOADING;

  const refetchTodos = React.useCallback(
    (selectedTaskId: TyTodo.Request.GetAll['taskId'],
      currentPage: TyTodo.Request.GetAll['page'],
      itemsPerPage: TyTodo.Request.GetAll['size'],
    ) => {
      dispatch(todosSlice.reset());

      return dispatch(todosSlice.asyncThunk.getAll({
        taskId: selectedTaskId || '',
        page: currentPage,
        size: itemsPerPage,
      })).then((action) => {
        if (todosSlice.asyncThunk.getAll.fulfilled.match(action)) {
          setTotalItems(action.payload.total);
        }
      });
    }, [dispatch]);
  //#endregion const

  //#region useRef
  const refetchTodosRef
    = React.useRef(refetchTodos);
  const updateSearchParamsRef
    = React.useRef(updateSearchParams);
  const searchParamsRef
    = React.useRef(searchParams);
  //#endregion useRef

  const addTodo = React.useCallback(
    (newTodo: TyTodo.CreationAttributes) => {
      return dispatch(todosSlice.asyncThunk.create(newTodo))
        .then<TyTodo.Item>((response) => (
          response.payload as AxiosResponse<TyTodo.Item>).data);
    }, [dispatch]);

  const deleteTodo = React.useCallback(
    (todo: TyTodo.Item) => {
      setProcessings(prev => [...prev, todo.id]);

      return dispatch(todosSlice.asyncThunk.remove(todo.id))
        .finally(() => {
          setProcessings(prev => prev.filter(item => item !== todo.id));
        });
    }, [dispatch]);

  const updateTodo = React.useCallback(
    (updatedTodo: TyTodo.Item) => {
      setProcessings(prev => [...prev, updatedTodo.id]);

      return dispatch(todosSlice.asyncThunk.update(updatedTodo))
        .finally(() => {
          setProcessings(prev => prev.filter(item => item !== updatedTodo.id));
        });
    }, [dispatch]);


  //#region useEffect
  // use useRef to store and persist the objects without causing unnecessary re-renders
  React.useEffect(() => {
    refetchTodosRef.current
      = refetchTodos;
    updateSearchParamsRef.current
      = updateSearchParams;
    searchParamsRef.current
      = searchParams;
  }, [refetchTodos, updateSearchParams, searchParams]);

  // if URL without id, select null task and reset todos
  React.useEffect(() => {
    if (!selectedTaskId) {
      updateSearchParamsRef.current(
        searchParamsRef.current, {
        [ID]: null,
        [PAGE]: null,
        [ITEM_PER_PAGE]: null,
      });

      dispatch(todosSlice.reset());
      setTotalItems(0);
    }
  }, [selectedTaskId, dispatch]);

  // defualt pagable sets and first request
  React.useEffect(() => {
    if (selectedTaskId) {
      updateSearchParamsRef.current(
        searchParamsRef.current, {
        [PAGE]: defualtPage,
        [ITEM_PER_PAGE]: String(optionsPerPage[0]),
      });
    }
  }, [selectedTaskId]);

  // tracking changes in search parameters
  React.useEffect(() => {
    if (selectedTaskId) {
      refetchTodosRef.current(selectedTaskId, currentPage, itemsPerPage);
    }
  }, [selectedTaskId, currentPage, itemsPerPage]);
  //#endregion useEffect

  logger.info(`
    selectedTaskId = ${selectedTaskId}
    totalItems = ${totalItems}
    itemsPerPage = ${itemsPerPage}
    todos.length = ${todos.length}
    `);

  return (
    <div
      className="h-full
      bg-gray-800 text-white font-robotomono-normal"
    // border border-red-500
    >
      <div
        className="custom-page-container 
      py-4 sm:py-6 md:py-10
      space-y-4 sm:space-y-6"
      >
        <TaskHeader
          onTodoCreate={addTodo}
        />

        {/* while todos are loading, totalItems is '0' or itemsPerPage is '0', totalPages, as derivative, is 'Infinity' or 'NaN'*/}
        {(!!totalItems && !!itemsPerPage) && (
          <div
            className="p-4 
          flex flex-col sm:flex-row items-center justify-between gap-4
        bg-gray-700 rounded-md shadow-md"
          >
            <ItemsPerPage
              selected={itemsPerPage}
              options={optionsPerPage}
              handlersFor={{
                select: {
                  onChange: (event: TyEvt.Change.SelectElmt) => {
                    updateSearchParams(
                      searchParams, {
                      [ITEM_PER_PAGE]: event.target.value,
                      [PAGE]: defualtPage,
                    })
                  }
                }
              }}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / itemsPerPage)}
              handlersFor={{
                btnPrev: {
                  onClick: () => updateSearchParams(
                    searchParams, {
                    [PAGE]: String(currentPage - 1),
                  })
                },
                // btnPage: {
                //   onClick: (event) => {
                //     updateSearchParams(searchParams, {
                //       [PAGE]:
                //         (event.target as HTMLButtonElement).dataset.page || null,
                //     })
                //   }
                // },
                btnNext: {
                  onClick: () => updateSearchParams(
                    searchParams, {
                    [PAGE]: String(currentPage + 1),
                  })
                },
              }}
            />
          </div>
        )}

        {(todos.length !== 0) && (
          <div
            data-cy="TodoList"
            className="max-h-80 sm:max-h-96
            overflow-y-scroll no-scrollbar"
          >
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
                isProcessed={processings.includes(todo.id)}
              />
            ))}
          </div>
        )}

        {(selectedTaskId && isTodosLoading && !!todos.length) && (
          <Loader
            style={{
              container: `flex items-center justify-center`,
            }}
          >
            <h1
              className='text-lg sm:text-xl font-bold 
                          bg-transparent text-white animate-bounce'
            >
              Todos is loading...
            </h1>
          </Loader>
        )}

      </div>
    </div>
  );
}
