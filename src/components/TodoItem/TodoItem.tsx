import React from 'react';
import cn from 'classnames';

import { Loader } from '.././Loader';
import { truncateString } from '../../utils';

import { TyTodo } from '../../types/Todo.type';
import { TyEvt } from '../../types/Evt.type';

export const TodoItem
  = React.memo(FuncComponent);

function FuncComponent({
  todo,
  onDelete,
  onUpdate,
  isProcessed = false,
}: {
  todo: TyTodo.Item;
  onDelete: (todo: TyTodo.Item) => Promise<unknown>;
  onUpdate: (updatedTodo: TyTodo.Item) => Promise<unknown>;
  isProcessed?: boolean;
}) {
  const {
    title,
    images,
    completed,
    createdAt,
    updatedAt,
  } = todo;

  const [isEditing, setIsEditing] = React.useState(false);

  // callbacks are wrapped in useCallback so child components get stable refs
  const handleDelete
    = React.useCallback(() => {
      // return promise from onDelete; parent may show processing state externally
      onDelete(todo).catch(() => {
        // revert editing focus: no DOM access here — top-level can trigger editing false
        // optionally set focus using refs if you split into files and forward refs
      });
      setIsEditing(false);
    }, [onDelete, todo]);

  const handleToggleComplete
    = React.useCallback(() => {
      const updatedTodo: TyTodo.Item = {
        ...todo,
        completed: !todo.completed,
      };

      onUpdate(updatedTodo)
        .then(() => setIsEditing(false))
        .catch(() => {
          // focus handling can be done with forwarded refs if needed
        });
    }, [onUpdate, todo]);

  const handleSubmitTitle
    = React.useCallback((newTitle: string) => {
      if (newTitle === '') {
        // deleting on empty title (same behaviour as original)
        onDelete(todo)
          .then(() => setIsEditing(false));
        return;
      }

      if (newTitle === title) {
        setIsEditing(false);
        return;
      }

      const updatedTodo: TyTodo.Item = {
        ...todo,
        title: newTitle,
      };

      onUpdate(updatedTodo)
        .then(() => setIsEditing(false));
    }, [onDelete, onUpdate, todo]);

  return (
    <div className='relative'>
      {isProcessed && (
        <Loader
          style={{
            container: `absolute inset-0 z-[1] 
              flex items-center justify-center 
              bg-white bg-opacity-30 rounded`,
          }}
        />
      )}

      <div
        className={cn('flex flex-col space-y-6 p-4 mb-2 rounded', {
          'bg-gray-700': completed,
          'bg-gray-600': !completed,
          'pointer-events-none blur-[2px]': isProcessed,
        })}
      >
        <div className='flex space-x-4'>
            <CompletedButton
              completed={completed}
              onToggle={handleToggleComplete}
            />

          <div className='grow flex flex-col justify-between'>
            <h2 className={cn('text-lg sm:text-xl font-bold', {
              'line-through text-gray-400': completed,
            })}>
              {truncateString(title, 11, '..')}
            </h2>

            <Dates
              createdAt={createdAt}
              updatedAt={updatedAt}
            />
          </div>

          <DeleteButton onDelete={handleDelete} />
        </div>

        {(images && images.length !== 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div
                className="relative 
                w-20 h-20 bg-gray-700
                rounded-lg overflow-hidden"
              >
                <img
                  src={image.src || undefined}
                  className="object-cover w-full h-full"
                  alt={`thumbnail-${index}`}
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
            ))}
          </div>
        )}

        {isEditing ? (
          <Editor
            initialTitle={title}
            onSubmit={handleSubmitTitle}
            onCancel={() => { setIsEditing(false); }}
            isDisabled={isProcessed}
          />
        ) : (
          <p
            className={cn('text-xs sm:text-sm whitespace-pre-wrap cursor-pointer', {
              'line-through text-gray-400': completed,
            })}
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </p>
        )}
      </div>
    </div>
  );
};

/* -------------------------
  Small components
   ------------------------- */

function CompletedButton({
  completed,
  onToggle,
}: {
  completed: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(`w-14 sm:w-16 rounded-full aspect-square
        text-white hover:opacity-70`, {
        'bg-system-success': completed,
        'bg-gray-700': !completed,
      })}
      aria-pressed={completed}
      title={completed ? 'Mark as not completed' : 'Mark as completed'}
    >
      <i className={cn('w-4 aspect-square fa-circle', {
        'fa-solid ': completed,
        'fa-regular': !completed,
      })} />
    </button>
  );
}

function DeleteButton({
  onDelete
}: {
  onDelete: () => void
}) {
  return (
    <button
      onClick={onDelete}
      className='w-14 sm:w-16 rounded aspect-square
      bg-system-error text-white hover:opacity-70'
      title='Delete todo'
    >
      <i className='w-4 aspect-square fa-solid fa-xmark' />
    </button>
  );
}

function Dates({
  createdAt,
  updatedAt,
}: {
  createdAt: string | number;
  updatedAt: string | number;
}) {
  // keep the same locale/timezone as original
  return (
    <>
      <p className='text-xs sm:text-sm font-light text-gray-400'>
        {(new Date(updatedAt))
          .toLocaleString('ua-UA', { timeZone: 'UTC' })}
      </p>

      <p className='self-end text-xs sm:text-sm font-light text-gray-400'>
        {(new Date(createdAt))
          .toLocaleString('ua-UA', { timeZone: 'UTC' })}
      </p>
    </>
  );
}

function Editor({
  initialTitle,
  onSubmit,
  onCancel,
  isDisabled,
}: {
  initialTitle: string;
  onSubmit: (newTitle: string) => void;
  onCancel: () => void;
  isDisabled?: boolean;
}) {
  const [value, setValue] = React.useState(initialTitle);
  const ref = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    ref.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value.trim());
  };

  const handleKeyUp = (e: TyEvt.Keybr.TextAreaElmt) => {
    if (e.key === 'Escape') {
      onCancel();
      setValue(initialTitle);
    }
  };

  // compute rows from newlines (same as original)
  const rows = (value.match(/\n/g) || []).length + 1;

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        data-cy='TodoTitleField'
        className='w-full max-h-[60vh] resize-y overflow-hidden flex-1 p-2 rounded'
        placeholder='Empty todo will be deleted'
        ref={ref}
        value={value}
        rows={rows}
        disabled={isDisabled}
        onChange={e => setValue(e.target.value)}
        onBlur={handleSubmit}
        onKeyUp={handleKeyUp}
      />
    </form>
  );
}
