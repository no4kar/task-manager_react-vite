import React from 'react';
import { Outlet } from 'react-router-dom';

import {
  useReduxSelector,
} from './store/hooks';
import { selectFromStore } from './store/store';

import { PageHeader } from './components/PageHeader';
import { Notification } from './components/Notification';

import './App.scss';
import { TyAuth } from './types/Auth.type';
import { TyTodo } from './types/Todo.type';

export const App
  = FuncComponent; // dont needs the React.memo. it will be rerendering each time

function FuncComponent() {
  const {
    errorMsg: authErrorMsg,
    status: authStatus,
  } = useReduxSelector(selectFromStore('author'));
  const {
    errorMsg: todosErrorMsg,
    status: todosStatus,
  } = useReduxSelector(selectFromStore('todos'));
  const [messages, setMessages]
    = React.useState<{ date: number, content: string }[]>([]);

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
      className='min-h-screen
      bg-gray-800 text-white font-robotomono-normal
      grid grid-cols-1 grid-rows-[auto,1fr,auto]'
    >
      <PageHeader />

      <main>
        <Outlet />
      </main>

      <footer>
        <div className='h-10 custom-page-container bg-gray-900' />
      </footer>

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
