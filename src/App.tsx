import React from 'react';
import { Outlet } from 'react-router-dom';

import { PageHeader } from './components/PageHeader';
import { PageFooter } from './components/PageFooter';
import { Notification } from './components/Notification';

import './App.scss';
import { TyAuth } from './types/Auth.type';
import { TyTodo } from './types/Todo.type';
import { useReduxAuthor } from './store/useReduxAuthor';
import { useReduxTodos } from './store/useReduxTodos';
import { PageAside } from './components/PageAside';

export const App
  // = MockUpFuncComponent;
  = FuncComponent; // dont needs the React.memo. it will be rerendering each time

function FuncComponent() {
  const [messages, setMessages]
    = React.useState<{ date: number, content: string }[]>([]);

  const {
    errorMsg: authErrorMsg,
    status: authStatus,
  } = useReduxAuthor();
  const {
    errorMsg: todosErrorMsg,
    status: todosStatus,
  } = useReduxTodos();

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
        flex flex-1 overflow-hidden"
      >
        <PageAside />

        {/* Content shell */}
        <section className="flex-1 min-w-0 overflow-hidden">
          {/* Scroll container */}
          <div className="h-full overflow-y-auto custom-scrollbar">
            {/* Content padding layer */}
            <div className="pl-6 py-10">
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
