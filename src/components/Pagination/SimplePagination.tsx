import React from 'react';
import cn from 'classnames';
import { Button } from '../Button';

export const SimplePagination
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
    btnNext?: Pick<
      React.DOMAttributes<HTMLButtonElement>,
      'onClick'>,
  };
}) {
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    // Using gap-x-4 for spacing between elements. Adjust as needed.
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

      {/* Page X of Y Text */}
      <span className="text-sm font-medium text-gray-300 tabular-nums">
        {currentPage} of {totalPages}
      </span>

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
    </div >
  );
}
