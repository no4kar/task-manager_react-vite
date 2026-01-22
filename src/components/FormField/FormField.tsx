import React from 'react';
import {
  UseFormRegister,
  FieldErrors,
  RegisterOptions,
  Path,
} from 'react-hook-form';
import cn from 'classnames';

export const FormField = FuncComponent;

function FuncComponent<T extends Record<string, any>>({
  type,
  textLabel,
  name,
  register,
  validation,
  errors,
  placeholder = '',
  required,
  style = {},
}: {
  type: React.HTMLInputTypeAttribute;
  textLabel?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  validation?: RegisterOptions<T>;
  errors: FieldErrors<T>;
  placeholder?: string;
  required?: boolean;
  style?: {
    container?: string,
    label?: {
      container: string;
      hasError: string;
      required: string;
    },
    input?: {
      container: string;
      hasError: string;
    },
    errorMsg?: {
      container: string;
    },
  },
}) {
  const hasError = errors[name];
  const {
    container = 'flex flex-col gap-2',
    label = {
      container: 'font-base font-normal font-normal text-base',
      hasError: '',
      required: 'after:content-["*"] after:ml-1 after:text-system-error',
    },
    input = {
      container: `py-2
      border-b border-black outline-none text-gray-400 resize-none`,
      hasError: 'text-system-error',
    },
    errorMsg = {
      container: `font-base font-light font-light text-xs text-system-error 
      overflow-hidden transition-all duration-500 ease-in-out`,
    },
  } = style;

  return (
    <div className={container}>
      {textLabel && (
        <label
          htmlFor={name}
          className={cn(label.container, {
            [label.hasError]: hasError,
            [label.required]: required,
          })}
        >
          {textLabel}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={name}
          placeholder={placeholder}
          className={input.container}
          {...register(name, { ...validation })}
        />
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          className={cn(input.container, {
            [input.hasError]: hasError,
          })}
          {...register(name, { ...validation })}
        />
      )}

      <p
        className={cn(errorMsg.container,
          'origin-top',
          {
            'scale-y-0': !hasError,
            'scale-y-100': hasError,
          })}
      >
        {(hasError?.message as string) || ''}
      </p>
    </div>
  );
}
