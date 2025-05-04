import React from 'react';
import cn from 'classnames';

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
  }
}) {
  return (
    // Using gap-x-4 for spacing between elements. Adjust as needed.
    <div className="flex items-center gap-x-4">
      {/* Prev Button - Styling mostly copied, adjusted props */}
      <button
        type="button" // Good practice to add type="button"
        className={cn(
          `px-3 py-2 rounded-md
            border border-gray-500 bg-gray-800
            text-sm font-medium text-gray-300
            hover:enabled:bg-gray-600 hover:enabled:text-white transition-all`, // Use hover:enabled:
          {
            'cursor-not-allowed opacity-50': currentPage === 1,
          }
        )}
        {...handlersFor.btnPrev}
        disabled={currentPage === 1}
        aria-label="Previous page" // Accessibility improvement
      >
        Prev
      </button>

      {/* Page X of Y Text */}
      <span className="text-sm font-medium text-gray-300 tabular-nums">
        {/* Use clamped values for display consistency */}
        {currentPage} of {totalPages}
      </span>

      {/* Next Button - Styling mostly copied, adjusted props */}
      <button
        type="button" // Good practice to add type="button"
        className={cn(
          `px-3 py-2 rounded-md
            border border-gray-500 bg-gray-800
            text-sm font-medium text-gray-300
            hover:enabled:bg-gray-600 hover:enabled:text-white transition-all`, // Use hover:enabled:
          {
            'cursor-not-allowed opacity-50': currentPage === totalPages,
          }
        )}
        {...handlersFor.btnNext}
        disabled={currentPage === totalPages}
        aria-label="Next page" // Accessibility improvement
      >
        Next
      </button>
    </div>
  );
}
