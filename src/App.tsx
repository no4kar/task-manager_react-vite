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
  // = MockUpFuncComponent;
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
        <div className='h-10 project-page-container bg-gray-900' />
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

function MockUpFuncComponent() {
  return (
    <div className="min-h-screen bg-gray-800 text-white font-robotomono-normal grid grid-cols-1 grid-rows-[auto,1fr,auto]">

      {/* <!-- HEADER --> */}
      <header className="page__header project-page-container w-full py-6 bg-gray-800">
        <div className="header__nav flex justify-between text-xl font-bold">
          <div className="header__nav-start flex gap-4">
            <a className="w-fit p-2 bg-indigo-400 text-white rounded hover:opacity-70" href="#">
              <p className="flex items-center justify-center">Home</p>
            </a>
            <a className="w-fit p-2 bg-indigo-400 text-white rounded hover:opacity-70" href="#">
              <p className="flex items-center justify-center">Tasks</p>
            </a>
          </div>
          <div className="header__nav-end flex gap-4">
            <button className="w-fit p-2 bg-red-400 text-white rounded hover:opacity-70">
              <p className="flex items-center justify-center">Log Out</p>
            </button>
          </div>
        </div>
      </header>

      {/* <!-- MAIN --> */}
      <main className="bg-gray-800 text-white font-robotomono-normal">
        <div className="project-page-container py-10 space-y-6">

          {/* <!-- TITLE --> */}
          <header className="todo__header space-y-4">
            <h1 className="font-bold text-3xl text-center">The sSome@email.com’s tasks</h1>

            {/* <!-- TITLE INPUT --> */}
            <div className="text-center">
              <div className="relative border border-yellow-300 rounded-md">
                <div className="flex space-x-2 rounded-md">
                  <input
                    className="flex-grow px-4 py-2 text-xl font-bold rounded-md text-indigo-400 bg-transparent focus:outline-none"
                    type="text"
                    value="repare in 3th room"
                  />
                  <button className="w-12 rounded aspect-square bg-system-warn text-white hover:opacity-70">
                    <i className="fa-solid fa-angle-down"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* <!-- CREATE FORM --> */}
            <form className="relative space-y-4">

              {/* <!-- DESCRIPTION + BUTTONS --> */}
              <div className="flex space-x-2 min-h-32">
                <textarea
                  className="flex-1 p-2 rounded bg-gray-700 text-white placeholder-gray-400 min-h-full"
                  placeholder="What are you planning to do?"
                ></textarea>

                <div className="flex flex-col space-y-2">
                  {/* <!-- OPTIONS --> */}
                  <button
                    type="button"
                    className="px-4 py-2 rounded
                      bg-indigo-400
                      text-black hover:opacity-70"
                  >
                    <i className="fa-solid fa-chevron-down" />
                  </button>

                  {true && (
                    <div className="absolute top-11 z-[1]
                    rounded bg-gray-500">

                      {/* <!-- CREATE BUTTON --> */}
                      <button
                        type="submit"
                        className="px-4 py-2 rounded
                          bg-gray-700
                          text-black hover:opacity-70"
                      >
                        <i className="fa-solid fa-plus" />
                        <p>Add the todo</p>
                      </button>

                      {/* <!-- ATTACH IMAGE BUTTON --> */}
                      <button
                        type="button"
                        className="px-4 py-2 rounded
                          bg-gray-700 
                          text-white hover:opacity-70"
                      >
                        <i className="fa-solid fa-paperclip" />
                        <p>Attach the image</p>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* IMAGE PREVIEW (STATIC EXAMPLE, UPDATED TO MATCH TODO DESIGN) */}
              <div className="flex space-x-2">

                {/* PREVIEW IMAGE BOX */}
                <div className="relative w-24 h-24 bg-gray-700 rounded overflow-hidden shadow-md">
                  <img
                    src="https://via.placeholder.com/120x120?text=Preview"
                    className="object-cover w-full h-full"
                    alt="preview"
                  />
                  {/* REMOVE BUTTON */}
                  <button
                    className="absolute top-0 right-0
                    bg-red-500 text-white text-xs px-1 rounded-full
                    hover:bg-red-600"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              </div>
            </form>
          </header>

          {/* <!-- PAGINATION BAR --> */}
          <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-700 rounded-md shadow-md">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-300">Items per page:</label>
              <select className="w-20 p-2 rounded-md border border-gray-500 bg-gray-800 text-sm text-gray-300">
                <option>5</option>
                <option>10</option>
                <option>20</option>
              </select>
            </div>

            <div className="flex items-center gap-x-4">
              <button className="px-3 py-2 rounded-md border border-gray-500 bg-gray-800 text-sm text-gray-300 opacity-50 cursor-not-allowed">Prev</button>
              <span className="text-sm text-gray-300">1 of 1</span>
              <button className="px-3 py-2 rounded-md border border-gray-500 bg-gray-800 text-sm text-gray-300 opacity-50 cursor-not-allowed">Next</button>
            </div>
          </div>

          {/* <!-- TODO LIST --> */}
          <div className="max-h-96 overflow-y-scroll no-scrollbar space-y-6">

            {/* === TASK ITEM WITH CIRCLE + 3 IMAGE THUMBNAILS === */}
            <div className="p-4 rounded bg-gray-600 space-y-4">

              {/* HEADER ROW */}
              <div className="flex space-x-4">

                {/* COMPLETED BUTTON */}
                <button
                  className="w-12 rounded aspect-square text-white hover:opacity-70 bg-gray-700"
                  title="Mark as completed"
                >
                  <i className="fa-regular fa-circle"></i>
                </button>

                {/* TITLE + DATES */}
                <div className="grow flex flex-col justify-between">
                  <h2 className="text-xl font-bold">6x Sand Kre</h2>
                  <p className="text-xs text-gray-400">10/16/2025, 5:53:52 PM</p>
                  <p className="self-end text-xs text-gray-400">10/10/2025, 7:02:54 PM</p>
                </div>

                {/* === ACTIONS BREADCRUMBS GROUP === */}
                <div className="flex items-center space-x-2">

                  {/* ATTACH IMAGE / FILE */}
                  <button
                    className="w-10 h-10 rounded bg-indigo-400 text-white hover:opacity-70 flex items-center justify-center"
                    title="Attach image or file"
                  >
                    <i className="fa-solid fa-paperclip"></i>
                  </button>

                  {/* DELETE TODO */}
                  <button
                    className="w-10 h-10 rounded 
                    flex items-center justify-center
                    bg-system-error 
                    text-white hover:opacity-70"
                    title="Delete todo"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>

              {/* THUMBNAIL STRIP */}
              <div className="flex space-x-2">
                {/* THUMBNAIL #1 */}
                <div className="relative w-20 h-20 bg-gray-700 rounded overflow-hidden">
                  <img
                    src="https://via.placeholder.com/100x100?text=1"
                    className="object-cover w-full h-full"
                    alt="thumbnail-1"
                  />
                  <button
                    className="absolute top-0 right-0 
                    bg-red-500 
                    text-white text-xs px-1 
                    rounded-full hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>

                {/* THUMBNAIL #2 */}
                <div className="relative w-20 h-20 bg-gray-700 rounded overflow-hidden">
                  <img
                    src="https://via.placeholder.com/100x100?text=2"
                    className="object-cover w-full h-full"
                    alt="thumbnail-2"
                  />
                  <button
                    className="absolute top-0 right-0 
                    bg-red-500 
                    text-white text-xs px-1 
                    rounded-full hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>

                {/* THUMBNAIL #3 */}
                <div className="relative w-20 h-20 bg-gray-700 rounded overflow-hidden">
                  <img
                    src="https://via.placeholder.com/100x100?text=3"
                    className="object-cover w-full h-full"
                    alt="thumbnail-3"
                  />
                  <button
                    className="absolute top-0 right-0 
                    bg-red-500 
                    text-white text-xs px-1 
                    rounded-full hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="text-xs whitespace-pre-wrap cursor-pointer">
                6x<br />
                Sand Kreisel<br />
                obi: 52722968, 0.58pln/kg<br />
                castorama: 5907418096203, 0.56pln/kg<br />
              </p>

            </div>

          </div>
        </div>
      </main>

      <footer>
        <div className="h-10 project-page-container bg-gray-900"></div>
      </footer>
    </div>
  );
}
