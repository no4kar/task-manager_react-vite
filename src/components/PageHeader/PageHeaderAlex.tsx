import { Link } from 'react-router-dom';
import { useReduxAuthor } from '../../hooks';

import { UserMenu } from '../UserMenu';
import { TyEvt } from '../../types/Evt.type';
import { dispatchCustomEvent } from '../../utils';

export function FuncComponent() {
  const {
    author,
  } = useReduxAuthor();

  return (
    <header
      data-ui="page-header"
      className="project-page-container
      sticky top-0 z-10
      w-full py-4 sm:py-6 md:py-10"
    >
      <div
        className="flex items-center justify-between
        rounded-lg"
      >
        <div className="flex items-center gap-6 flex-1">
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/"
                className="bg-system-warn rounded-lg p-1.5 flex items-center justify-center">
                <i className="fa-solid fa-circle-check text-surface-dark font-bold text-xl" />
              </Link>

              <div>
                <h1 className="text-base font-bold text-primary dark:text-secondary tracking-tight leading-none">Task Manager</h1>
                <p className="text-xs font-medium">Trials</p>
              </div>
            </div>

            <button data-ui="page-header-aside-show"
              className="p-2 md:hidden 
              rounded-xl hover:bg-slate-100 dark:hover:bg-card-dark 
              text-slate-500 transition-colors"
              onClick={() => dispatchCustomEvent(TyEvt.CustomEvent.TOGGLE_PAGE_ASIDE)}
            >
              <i className="fa-solid fa-bars" />
            </button>
          </div>

          <div className="flex items-center flex-1 max-w-2xl ml-4">
            <div data-ui="page-header-search"
              className="relative w-full group">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                className="w-full bg-slate-100 dark:bg-card-dark border-none rounded-xl py-2 pl-11 pr-4 text-sm focus:ring-1 focus:ring-primary transition-all"
                placeholder="Search tasks, projects, or documents..."
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-8">
          <button data-ui="page-header-bell"
            className="hidden
            w-10 h-10 rounded-xl 
          relative flex items-center justify-center 
          bg-slate-100 dark:bg-card-dark hover:bg-slate-200 dark:hover:bg-border-dark 
          transition-colors">
            <i className="fa-solid fa-bell text-slate-600 dark:text-slate-300" />
            <span className="w-2 h-2 
            absolute top-2 right-2 
            bg-red-500 rounded-full border-2 border-surface dark:border-surface-dark
            animate-ping"/>
          </button>

          <button data-ui="page-header-question"
            className="hidden
            w-10 h-10 rounded-xl 
            flex items-center justify-center 
            bg-slate-100 dark:bg-card-dark 
            hover:bg-slate-200 dark:hover:bg-border-dark 
            transition-colors">
            <i className="fa-regular fa-circle-question text-slate-600 dark:text-slate-300" />
          </button>
          {/* border */}
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-border-dark mx-2" />

          <div className="flex items-center gap-3 pl-2">
            {author && (
              <div className="text-right hidden sm:block">
                <p className="text-sm text-primary font-bold leading-none">
                  {author.email}
                </p>

                <p className="text-xs uppercase tracking-tight">
                  User
                </p>
              </div>
            )}

            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
