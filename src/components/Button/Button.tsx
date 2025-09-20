import React from "react";
import cn from "classnames";

type ButtonAttribute = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.memo(FuncComponent);

function FuncComponent({
  children = <p>Empty button...</p>,
  key,
  dataPage,
  className,
  handlersFor,
  disabled = false,
  ariaLabel,
}: {
  children?: JSX.Element,
  key?: React.Attributes['key'],
  dataPage?: string | undefined,
  className?: ButtonAttribute['className'],
  handlersFor?: Pick<
    React.DOMAttributes<HTMLButtonElement>,
    'onClick'>,
  disabled?: ButtonAttribute['disabled'],
  ariaLabel?: ButtonAttribute['aria-label'],
}) {
  return (
    <button
      key={key}
      data-page={dataPage}
      type="button" // Good practice to add type="button"
      className={cn(`px-3 py-2 rounded-md
            border border-gray-500 
            bg-gray-800
            text-sm font-medium text-gray-300`,
        className)}
      {...handlersFor}
      disabled={disabled}
      aria-label={ariaLabel} // Accessibility improvement
    >
      {children}
    </button>
  );
}
