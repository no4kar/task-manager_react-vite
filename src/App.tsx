import React from 'react';
import { Outlet } from 'react-router-dom';
import cn from 'classnames';

import './App.scss';
import { TyAuth } from './types/Auth.type';
import { TyTodo } from './types/Todo.type';
import { useCustomEvent, useReduxAuthor, useReduxTodos } from './hooks';

import { PageAside } from './components/PageAside';
import { PageHeader } from './components/PageHeader';
import { PageFooter } from './components/PageFooter';
import { Notification } from './components/Notification';
import { TyEvt } from './types/Evt.type';

export const App
  = FuncComponent; // dont needs the React.memo. it will be rerendering each time

function FuncComponent() {
  const [messages, setMessages]
    = React.useState<{ date: number, content: string }[]>([]);
  const [isAsideOpen, setAsideOpen]
    = React.useState(false);

  //#region Redux
  const {
    errorMsg: authErrorMsg,
    status: authStatus,
  } = useReduxAuthor();
  const {
    errorMsg: todosErrorMsg,
    status: todosStatus,
  } = useReduxTodos();
  //#endregion

  const toggleAside
    = () => setAsideOpen(v => !v);

  //#region useEffect
  React.useEffect(() => {
    if (authStatus === TyAuth.Status.ERROR) {
      const newMsg = {
        date: Date.now(),
        content: authErrorMsg,
      };

      setMessages(prev => [...prev, newMsg]);
    }
  }, [authStatus]);

  React.useEffect(() => {
    if (todosStatus === TyTodo.Status.ERROR) {
      const newMsg = {
        date: Date.now(),
        content: todosErrorMsg,
      };

      setMessages(prev => [...prev, newMsg]);
    }
  }, [todosStatus]);
  //#endregion

  useCustomEvent(TyEvt.CustomEvent.TOGGLE_PAGE_ASIDE, () => {
    toggleAside();
  });

  return (
    <div
      className="min-h-screen
      grid grid-cols-1 grid-rows-[auto,1fr,auto]
      text-secondary dark:text-inverted
      font-base font-normal
      bg-surface/80 dark:bg-surface-dark/80"
    >
      <PageHeader />

      <main data-ui="page-main"
        className="project-page-container 
        w-full py-4 sm:py-6 md:py-10
        flex gap-6 flex-1 overflow-hidden"
      >
        <div className="relative md:static">
          <div
            className={cn(`absolute md:static
            transform transition-transform duration-300 ease-in-out
            z-[1]`, {
              "translate-x-0": isAsideOpen,
              "-translate-x-[150%]": !isAsideOpen,
            }, "md:translate-x-0")
            }
          >
            <PageAside />
          </div>
        </div>

        {/* Content shell */}
        <section className="flex-1 min-w-0 overflow-hidden">
          {/* Scroll container */}
          <div className="h-full overflow-y-auto custom-scrollbar">
            {/* Content padding layer */}
            <div className="py-10">
              <Outlet />
            </div>
          </div>
        </section>
      </main>

      <PageFooter />

      {messages && (
        <div
          className='fixed bottom-4 right-4'
        >
          {messages.map(msg => (
            <Notification
              key={msg.date}
              onClose={() => setMessages(
                prev => prev.filter(item => item.date !== msg.date)
              )}
            >
              <p>{msg.content}</p>
            </Notification>
          ))}
        </div>
      )}
    </div>
  );
}
