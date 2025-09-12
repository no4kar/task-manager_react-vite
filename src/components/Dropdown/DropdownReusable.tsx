import React from 'react';
import cn from 'classnames';

import { Spiner } from '../SVG/Spiner';
import { TyEvt } from '../../types/Evt.type';

type TyItem = {
  id: string;
  name: string;
  [key: string]: any;
};

export const DropdownReusable
  // = FuncComponent;
= React.memo(FuncComponent);

function FuncComponent({
  items,
  selectedItem = null,
  isProcessing = false,
  onItem = {
    select: () => { },
    create: () => { },
    update: () => { },
    remove: () => { },
  }
}: {
  items: TyItem[],
  selectedItem?: TyItem | null,
  isProcessing?: boolean,
  onItem: {
    select: (itemId: TyItem['id']) => void,
    create: ({ name }: { name: TyItem['name'] })
      => Promise<void> | void,
    update: ({ name }: { name: TyItem['name'] })
      => Promise<void> | void,
    remove: (itemId: TyItem['id']) => Promise<void> | void,
  }
}) {
  const {
    name: lableTitle,
  } = selectedItem || { id: 'defualt', name: 'Select task' };

  const [
    isOpen,
    setIsOpen,
  ] = React.useState(false);
  const [
    isEditing,
    setIsEditing,
  ] = React.useState(false);
  const [
    mode,
    setMode,
  ] = React.useState<'' | 'update' | 'create'>('');
  const [
    title,
    setTitle,
  ] = React.useState(lableTitle);

  const toggleDropdown
    = () => setIsOpen(prev => !prev);

  const handleSave
    = async () => {
      const trimmedTitle = title.trim();
      if (!trimmedTitle) return;

      switch (mode) {
        case 'create': {
          await onItem.create({
            name: trimmedTitle,
          });

          break;
        }

        case 'update': {
          await onItem.update({
            name: trimmedTitle,
          });

          break;
        }

        default:
          break;
      }

      setMode('');
      setIsEditing(false);
    };

  React.useEffect(() => {
    if (!isEditing) {
      setTitle(lableTitle);
    }
  }, [lableTitle]);

  return (
    <div
      className={cn(
        'relative border border-yellow-300 rounded-md', {
        'is-active': isOpen,
      })}
    >
      <Lable
        title={isProcessing ? 'Processing...' : title}
        isOpen={isOpen}
        isProcessing={isProcessing}
        isEditing={isEditing}
        handlersFor={{
          btnAngle: {
            onClick: toggleDropdown,
          },
          input: {
            onChange: (event: TyEvt.Change.InputElmt) => {
              setTitle(event.target.value);
            },
            onKeyDown: (event: TyEvt.Keybr.InputElmt) => {
              if (event.key === 'Enter') {
                handleSave();
              }
            },
            onBlur: handleSave,
            onClick: () => {
              setMode('update')
              setIsEditing(true);
            },
          }
        }}
      />

      {isOpen && (
        <div
          className='
          absolute top-11 z-10
          bg-white border rounded-md shadow-lg mt-2 w-full md:w-auto'
        >
          <OptionCreateNew
            key={'OptionCreateNew'}
            handlersFor={{
              divCreate: {
                onClick: () => {
                  setMode('create');
                  setIsEditing(true);
                  toggleDropdown();
                }
              }
            }} />

          <hr className='border-gray-300' />

          {items.map((item) =>
            <Option
              key={item.id}
              item={item}
              selectedItem={selectedItem}
              handlersFor={{
                btnXmark: {
                  onClick: (event) => {
                    event.stopPropagation(); // Prevent triggering item selection
                    onItem.remove(item.id);
                  },
                },
                divName: {
                  onClick: (event) => {
                    event.stopPropagation(); // Prevent triggering item selection
                    onItem.select(item.id);
                    setTitle(item.name);
                    toggleDropdown();
                  },
                }
              }} />
          )}
        </div>
      )}
    </div>
  );
}



function Option({
  item,
  selectedItem,
  handlersFor,
}: {
  item: TyItem,
  selectedItem: TyItem | null,
  handlersFor: {
    btnXmark?: Pick<
      React.DOMAttributes<HTMLButtonElement>,
      'onClick'>,
    divName?: Pick<
      React.DOMAttributes<HTMLDivElement>,
      'onClick'>,
  }
}) {
  return (
    <div
      className={cn(
        `px-4 py-2 flex justify-between items-center
         font-semibold text-sm
        text-gray-700 cursor-pointer hover:bg-gray-100`,
        {
          'bg-blue-100': item.id === selectedItem?.id,
        }
      )}
    >
      <div
        className='flex-grow'
        {...handlersFor.divName}
      >
        <p>{item.name}</p>
      </div>

      {item.id !== selectedItem?.id && (
        <button
          className="w-6 ml-4 aspect-square rounded-full
                  text-red-500 hover:text-red-700 focus:outline-none"
          {...handlersFor.btnXmark}
        >
          <i className='fas fa-xmark' />
        </button>
      )}
    </div>
  );
}

function OptionCreateNew({
  handlersFor,
}: {
  handlersFor: {
    divCreate?: Pick<
      React.DOMAttributes<HTMLDivElement>,
      'onClick'>,
  }
}) {
  return (
    <div
      className='px-4 py-2 font-semibold text-sm
                text-gray-700 cursor-pointer hover:bg-gray-100'
      {...handlersFor.divCreate}
    >
      Create new task
    </div>
  );
}

function Lable({
  title,
  isOpen,
  isEditing,
  isProcessing,
  handlersFor,
}: {
  title: string,
  isOpen: boolean,
  isEditing: boolean,
  isProcessing: boolean,
  handlersFor: {
    btnAngle?: Pick<
      React.DOMAttributes<HTMLButtonElement>,
      'onClick'>,
    input?: Pick<
      React.DOMAttributes<HTMLInputElement>,
      'onChange' | 'onKeyDown' | 'onBlur' | 'onClick'>,
  }
}) {
  const inputRef
    = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className='flex space-x-2 rounded-md'>
      <div className={cn(
        'cursor-move',
        'relative flex flex-grow rounded-md', {
        'is-loading': isProcessing,
      })}
      >
        <input
          type='text'
          className='
              flex flex-grow px-4 py-2
              text-lg sm:text-xl font-bold rounded-md
              text-indigo-400
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition ease-in-out duration-150'
          ref={inputRef}
          value={title}
          {...handlersFor.input}
          disabled={isProcessing}
        />

        {isProcessing && (
          <div
            className='absolute top-[50%] right-0 
                transform -translate-x-1/2 -translate-y-1/2'
          >
            <Spiner style={{
              container: 'animate-spin h-5 w-5 fill-none',
              circle1: 'opacity-25 stroke-blue-400 stroke-[4]',
              path1: 'opacity-75 fill-blue-400',
            }}
            />
          </div>
        )}
      </div>

      <button
        className='w-11 sm:w-12 rounded aspect-square
            bg-system-warn text-white
            hover:opacity-70'
        {...handlersFor.btnAngle}
      >
        <i className={cn(
          'w-4 aspect-square fa-solid fa-angle-down', {
          '-scale-y-100': isOpen,
        })} />
      </button>
    </div>
  );
}
