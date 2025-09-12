import React from 'react';
import cn from 'classnames';

import { Loader } from '../Loader';
import { base64ToBlob, fileToBase64, truncateString } from '../../utils';

import { TyTodo } from '../../types/Todo.type';
import { TyEvt } from '../../types/Evt.type';

export const TodoItem = React.memo(({
  todo,
  onDelete,
  onUpdate,
  isProcessed = false,
}: {
  todo: TyTodo.Item;
  onDelete: (todo: TyTodo.Item) => Promise<unknown>;
  onUpdate: (updatedTodo: TyTodo.Item) => Promise<unknown>;
  isProcessed?: boolean;
}) => {
  const { title, completed, image: todoImageBase64 } = todo;

  const [isEditing, setIsEditing] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState(title);

  // Image state: {src = blob URL or base64 string, raw = Blob/File or null}
  const [image, setImage] = React.useState<{
    src: string | null;
    raw: Blob | File | null;
  }>({ src: null, raw: null });

  const titleField = React.useRef<HTMLTextAreaElement>(null);

  // Initialize image state from todo.image base64
  React.useEffect(() => {
    if (todoImageBase64) {
      // Convert base64 → Blob → create blob URL for consistent src
      const blob = base64ToBlob(todoImageBase64);
      const blobUrl = URL.createObjectURL(blob);

      setImage(prev => {
        // Revoke old blob URL if present
        if (prev.src && prev.raw === null) {
          URL.revokeObjectURL(prev.src);
        }
        return { src: blobUrl, raw: null };
      });

      return () => {
        // Cleanup blob URL on unmount or image change
        URL.revokeObjectURL(blobUrl);
      };
    } else {
      setImage(prev => {
        if (prev.src && prev.raw === null) {
          URL.revokeObjectURL(prev.src);
        }
        return { src: null, raw: null };
      });
    }
  }, [todoImageBase64]);

  // Handle file input change (user picks new image)
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Revoke old blob URL if exists and was from raw file (preview)
      if (image.src && image.raw !== null) {
        URL.revokeObjectURL(image.src);
      }

      const newBlobUrl = URL.createObjectURL(file);
      setImage({
        src: newBlobUrl,
        raw: file,
      });
    }
  };

  const handleDelete = () => {
    onDelete(todo)
      .then(() => setIsEditing(false))
      .catch(() => titleField.current?.focus());
  };

  const handleToggleComplete = () => {
    const updatedTodo: TyTodo.Item = {
      ...todo,
      completed: !todo.completed,
    };

    onUpdate(updatedTodo)
      .then(() => setIsEditing(false))
      .catch(() => titleField.current?.focus());
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isProcessed) return;

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      handleDelete();
      return;
    }

    if (trimmedTitle === title && image.raw === null) {
      setIsEditing(false);
      return;
    }

    if (titleField.current) {
      titleField.current.disabled = true;
    }

    let updatedImageBase64 = todoImageBase64;

    if (image.raw) {
      try {
        updatedImageBase64 = await fileToBase64(image.raw);
      } catch {
        // Fallback: keep old image
        updatedImageBase64 = todoImageBase64;
      }
    }

    const updatedTodo: TyTodo.Item = {
      ...todo,
      title: trimmedTitle,
      image: updatedImageBase64,
    };

    onUpdate(updatedTodo)
      .then(() => {
        setIsEditing(false);
        // After save, raw is cleared, src stays as blob URL created from base64 on next update
        setImage({ src: image.src, raw: null });
        if (titleField.current) {
          titleField.current.disabled = false;
        }
      })
      .catch(() => titleField.current?.focus());
  };

  const handleKeyUp = (event: TyEvt.Keybr.TextAreaElmt) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title);

      // Reset image state to original
      if (todoImageBase64) {
        const blob = base64ToBlob(todoImageBase64);
        const blobUrl = URL.createObjectURL(blob);

        if (image.src && image.raw !== null) {
          URL.revokeObjectURL(image.src);
        }
        setImage({ src: blobUrl, raw: null });
      } else {
        if (image.src && image.raw !== null) {
          URL.revokeObjectURL(image.src);
        }
        setImage({ src: null, raw: null });
      }
    }
  };

  React.useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isEditing]);

  React.useEffect(() => {
    setNewTitle(title);
  }, [title]);

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
          <button
            onClick={handleToggleComplete}
            className={cn(`w-11 sm:w-12 rounded aspect-square 
              text-white hover:opacity-70`, {
              'bg-system-success': completed,
              'bg-gray-700': !completed,
            })}
          >
            <i className={cn('w-4 aspect-square fa-circle', {
              'fa-solid ': completed,
              'fa-regular': !completed,
            })} />
          </button>

          <div className='grow flex flex-col justify-between'>
            <h2 className={cn('text-lg sm:text-xl font-bold', {
              'line-through text-gray-400': completed,
            })}>
              {truncateString(todo.title, 11, '..')}
            </h2>

            <p className='text-xs sm:text-sm font-light text-gray-400'>
              {(new Date(todo.createdAt)).toLocaleString('ua-UA', { timeZone: 'UTC' })}
            </p>

            <p className='self-end text-xs sm:text-sm font-light text-gray-400'>
              {(new Date(todo.updatedAt)).toLocaleString('ua-UA', { timeZone: 'UTC' })}
            </p>
          </div>

          <button
            onClick={handleDelete}
            className='w-11 sm:w-12 rounded aspect-square
            bg-system-error text-white
            hover:opacity-70'
          >
            <i className='w-4 aspect-square fa-solid fa-xmark' />
          </button>
        </div>

        {!isEditing && image.src && (
          <div className='mt-2'>
            <img
              src={image.src}
              alt={title}
              className='max-w-full max-h-48 rounded object-contain'
            />
            <p className='mt-1 text-sm text-gray-300 font-semibold'>{title}</p>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <textarea
              data-cy='TodoTitleField'
              className='w-full max-h-[60vh] resize-y overflow-hidden flex-1 p-2 rounded'
              placeholder='Empty todo will be deleted'
              ref={titleField}
              value={newTitle}
              rows={(newTitle.match(/\n/g) || []).length + 1}
              onChange={e => setNewTitle(e.target.value)}
              onBlur={handleSubmit}
              onKeyUp={handleKeyUp}
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className='mt-2 text-sm text-gray-300'
            />

            {image.src && (
              <img
                src={image.src}
                alt='Preview'
                className='mt-2 max-w-full max-h-48 rounded object-contain'
              />
            )}
          </form>
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
});
