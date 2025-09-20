const entities = {
  author: 'author',
  tasks: 'tasks',
  todos: 'todos',
} as const;

type Entities = typeof entities;
export type EntityKey = keyof typeof entities;

// subsets
export const apis: Pick<
  Entities,
  | 'author'
> = {
  author: entities.author,
};

export type Apis
  = keyof typeof apis;

export const slices: Pick<
  Entities,
  | 'todos'
  | 'tasks'
  | 'author'
> = {
  author: 'author',
  tasks: 'tasks',
  todos: 'todos',
};

export type Slices
  = keyof typeof slices;
