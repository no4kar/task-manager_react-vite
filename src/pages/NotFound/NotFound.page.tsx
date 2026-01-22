import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Loader } from '../../components/Loader';

export const NotFoundPage = React.memo(FuncComponent);

function FuncComponent({
  title = 'Page not found',
  redirect,
  style = {},
}: {
  title?: string;
  redirect?: {
    to: string;
    delay: number;
  };
  style?: {
    container?: string;
  };
}) {
  const {
    container = `flex flex-col gap-16 items-center justify-center content min-h-96`,
  } = style;

  const navigate = useNavigate();

  React.useEffect(() => {
    if (redirect?.to) {
      const timeoutId
        = setTimeout(() => {
          navigate(redirect.to);
        }, redirect.delay);

      return () => clearTimeout(timeoutId);
    }

    return () => { };
  }, []);


  return (
    <div
      className={container}
    >
      <h1
        className='font-base font-bold text-3xl font-bold text-center'
      >
        {title}
      </h1>

      {redirect?.to && (
        <Loader />
      )}
    </div>
  );
}
