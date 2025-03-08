'use client';

import { memo, type FC } from 'react';
import { useRouteError } from 'react-router-dom';

const ErrorComponent: FC = () => {
  const error = useRouteError() as { statusText?: string; message?: string };
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error?.message}</i>
      </p>
    </div>
  );
};

const Error = memo(ErrorComponent);

export default Error;
