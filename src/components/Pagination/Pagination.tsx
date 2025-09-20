import React from 'react';
import cn from 'classnames';

import { Button } from '../Button';

export const Pagination
  = React.memo(FuncComponent);

function FuncComponent({
  currentPage,
  totalPages,
  handlersFor,
}: {
  currentPage: number;
  totalPages: number;
  handlersFor: {
    btnPrev?: Pick<
      React.DOMAttributes<HTMLButtonElement>,
      'onClick'>,
    btnPage?: Pick<
      React.DOMAttributes<HTMLButtonElement>,
      'onClick'>,
    btnNext?: Pick<
      React.DOMAttributes<HTMLButtonElement>,
      'onClick'>,
  }
}) {
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="flex items-center gap-x-4">
      <Button
        className={cn(
          'hover:enabled:bg-gray-600 hover:enabled:text-white transition-all', {
          'cursor-not-allowed opacity-50': isFirst,
        })}
        handlersFor={handlersFor.btnPrev}
        disabled={isFirst}
        ariaLabel="Previous page"
      >
        <p>Prev</p>
      </Button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <Button
            key={page}
            dataPage={String(page)}
            className={
              `hover:enabled:bg-gray-600 hover:enabled:text-white transition-all ${currentPage === page
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-gray-800 text-gray-300 border-gray-500 hover:bg-gray-600 hover:text-white'
              }`
            }
            handlersFor={handlersFor.btnPage}
            ariaLabel={`Page ${page}`}
          >
            <p>{page}</p>
          </Button>
        )
      )}

      <Button
        className={cn(
          'hover:enabled:bg-gray-600 hover:enabled:text-white transition-all', {
          'cursor-not-allowed opacity-50': isLast,
        })}
        handlersFor={handlersFor.btnNext}
        disabled={isLast}
        ariaLabel="Next page"
      >
        <p>Next</p>
      </Button>
    </div>
  );
}
