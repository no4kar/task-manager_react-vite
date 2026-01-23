export function FuncComponent() {
  return (
    <aside
      data-ui="page-aside"
      className="flex flex-col shrink-0      
      border-r border-slate-200 dark:border-border-dark  
      bg-background-light dark:bg-background-dark 
      overflow-y-auto custom-scrollbar
      project-inspect"
    >
      <nav className="flex-1 px-4 py-6 space-y-1">
        <a className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-card-dark transition-colors group" href="#">
          <i className="fa-solid fa-house text-slate-500 dark:text-slate-400 group-hover:text-primary" />
          <span className="text-sm font-medium">Home</span>
        </a>

        <div className="space-y-1">
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary transition-colors" href="#">
            <i className="fa-solid fa-circle-check" />
            <span className="text-sm font-semibold">My Tasks</span>
            <i className="fa-solid fa-chevron-down ml-auto text-sm" />
          </a>

          <div className="ml-4 pl-4 border-l border-slate-200 dark:border-border-dark space-y-1 mt-1">
            <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" href="#">
              <i className="fa-solid fa-plus text-[14px]" />
              <span className="text-[13px] font-medium">Add Todo</span>
            </a>

            <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" href="#">
              <i className="fa-solid fa-list text-[14px]" />
              <span className="text-[13px] font-medium">Todo List</span>
            </a>

            <a className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" href="#">
              <i className="fa-solid fa-table-cells text-[14px]" />
              <span className="text-[13px] font-medium">Dashboard</span>
            </a>
          </div>
        </div>

        <a className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-card-dark transition-colors group" href="#">
          <i className="fa-solid fa-folder-open text-slate-500 dark:text-slate-400 group-hover:text-primary" />
          <span className="text-sm font-medium">Categories</span>
        </a>

        <a className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-card-dark transition-colors group" href="#">
          <i className="fa-solid fa-gear text-slate-500 dark:text-slate-400 group-hover:text-primary" />
          <span className="text-sm font-medium">Settings</span>
        </a>
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-100 dark:bg-card-dark rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Storage
          </p>

          <div className="w-full bg-slate-200 dark:bg-border-dark rounded-full h-1.5 mb-2">
            <div className="bg-primary h-1.5 rounded-full"></div>
          </div>
          <p className="text-xs text-slate-500">7.5 GB of 10 GB used</p>
        </div>
      </div>
    </aside>
  );
}
