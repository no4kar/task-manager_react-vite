import { Provider } from 'react-redux';
import { store } from './store/store';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { App } from './App';
import { RequireAuth } from './components/RequireAuth';
import { NotFoundPage } from './pages/NotFound';
import { LoginPage } from './pages/Login';
import { FuncComponent as TaskPage } from './pages/Task/TaskAlex.page';
import { SignupPage } from './pages/Signup';
import { ActivationPage } from './pages/Activation';
import { HomePage } from './pages/Home';

const router = createBrowserRouter([
  {
    path: '/', element: <App />,
    children: [
      { path: '/', element: <HomePage />, },
      { path: 'login', element: <LoginPage />, },
      { path: 'signup', element: <SignupPage /> },
      { path: '*', element: <NotFoundPage />, },
      {
        path: '/', element: <RequireAuth />,
        children: [
          {
            path: 'tasks',
            element: <TaskPage />,
            // children: [
            //   {
            //     path: ':taskId',
            //     element: <NotFoundPage />
            //   }
            // ],
          },
        ],
      },
      {
        path: 'activate',
        children: [
          {
            path: ':activationToken',
            element: <ActivationPage />
          }
        ],
      },
    ],
  },
], {
  basename: '/task-manager_react-vite/',
});

export const Root = () => (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
