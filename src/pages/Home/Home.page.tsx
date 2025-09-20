import React from 'react';


export const HomePage = React.memo(FuncComponent);

function FuncComponent() {
  return (
    <div
      className='bg-gray-800 text-white font-robotomono-normal'
    >
      <div className='project-page-container py-4 sm:py-6 md:py-10'>
        <h1 className='font-robotomono-bold text-3xl font-bold text-center mb-4'>
          The Task Manager Home Page
        </h1>

        <div className='space-y-4 sm:space-y-6 text-justify'>
          <p>
            Welcome to the Task Manager project! This application is
            built using modern technologies including React, Vite,
            Tailwind CSS, Redux Toolkit, and Axios on the frontend.
            The backend is powered by Node.js, Express, SQLite,
            and Sequelize.
          </p>

          <p>
            The Task Manager allows you to register a new user by email.
            For <em>demonstration</em> purposes, you can access a pre-created
            account using <em>the default values</em> provided on <em>the
              login page</em>.
          </p>

          <p className='text-system-warn font-semibold'>
            Warning: The hosting service where the server is deployed
            may run slowly. The first request, also known as a 'cold start',
            may take up to 50 seconds.
          </p>

          <p>
            Explore the features and manage your tasks efficiently with
            our user-friendly interface.
          </p>
        </div>
      </div>
    </div>
  );
}
