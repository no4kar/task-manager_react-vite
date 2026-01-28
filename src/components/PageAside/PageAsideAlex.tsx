import { NavLink } from "react-router-dom";
import classNames from "classnames";

import { useReduxAuthor } from "../../hooks";

export function FuncComponent() {
  //#region Redux
  const {
    author,
  } = useReduxAuthor();

  return (
    <aside
      data-ui="page-aside"
      className="flex flex-col shrink-0      
      border-r border-slate-200 dark:border-border-dark  
      bg-surface dark:bg-surface-dark 
      overflow-y-auto custom-scrollbar
      project-inspect"
    >
      <nav className="flex-1 px-4 py-6 space-y-1">
        <NavLink to="/" >
          {({ isActive }) => (
            <div className={classNames(
              `flex items-center gap-3 
                px-4 py-3 
                rounded-xl
                hover:bg-card dark:hover:bg-card-dark 
                transition-colors group`, isActive
              ? "text-primary dark:text-primary-dark"
              : "text-secondary dark:text-secondary-dark")}
            >
              <i className={classNames(
                "fa-solid fa-house", isActive
                ? "text-primary dark:text-primary-dark"
                : "text-secondary dark:text-secondary-dark",
                "group-hover:text-primary")} />

              <p className="text-sm font-medium">
                Home
              </p>
            </div>
          )}
        </NavLink>

        <div
          data-ui="aside-tasks"
          className={classNames("space-y-1", {
            'hidden': author === null,
          })}
        >
          <NavLink to="/tasks">
            {({ isActive }) => (
              <div className={classNames(
                `flex items-center gap-3 
                px-4 py-3 
                rounded-xl
                hover:bg-card dark:hover:bg-card-dark 
                transition-colors group`, isActive
                ? "text-primary dark:text-primary-dark"
                : "text-secondary dark:text-secondary-dark")}
              >
                <i className={classNames(
                  "fa-solid fa-circle-check", isActive
                  ? "text-primary dark:text-primary-dark"
                  : "text-secondary dark:text-secondary-dark",
                  "group-hover:text-primary")} />

                <p className="text-sm font-semibold whitespace-nowrap">
                  My Tasks
                </p>

                <i className="fa-solid fa-chevron-down ml-auto text-sm" />
              </div>
            )}
          </NavLink>

          <div className="ml-4 pl-4 border-l border-slate-200 dark:border-border-dark space-y-1 mt-1">
            <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" href="#">
              <i className="fa-solid fa-plus text-[14px]" />
              <p className="text-xs font-medium">
                Add Todo
              </p>
            </a>

            <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" href="#">
              <i className="fa-solid fa-list text-[14px]" />
              <p className="text-xs font-medium">
                Todo List
              </p>
            </a>

            {/* <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" href="#">
              <i className="fa-solid fa-table-cells text-[14px]" />
              <span className="text-xs font-medium">Dashboard</span>
            </a> */}
          </div>
        </div>

        {/* <a className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-card-dark transition-colors group" href="#">
          <i className="fa-solid fa-folder-open text-slate-500 dark:text-slate-400 group-hover:text-primary" />
          <span className="text-sm font-semibold">Categories</span>
        </a>

        <a className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-card-dark transition-colors group" href="#">
          <i className="fa-solid fa-gear text-slate-500 dark:text-slate-400 group-hover:text-primary" />
          <span className="text-sm font-semibold">Settings</span>
        </a> */}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-100 dark:bg-card-dark rounded-xl p-4">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Storage
          </p>

          <div className="w-full bg-slate-200 dark:bg-border-dark rounded-full h-1.5 mb-2">
            <div className="bg-primary h-1.5 rounded-full" />
          </div>
          <p className="text-xs text-slate-500">7.5 GB of 10 GB used</p>
        </div>
      </div>
    </aside>
  );
}
