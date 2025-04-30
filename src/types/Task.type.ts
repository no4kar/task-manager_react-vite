/* eslint @typescript-eslint/no-namespace: 'off' */

import type { TyGeneral } from './General.type';

export namespace TyTask {
  export type Item = {
    id: string;
    userId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }

  export type CreationAttributes = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;

  export namespace Request {
    export type Create = TyTask.CreationAttributes;
    export interface GetAll extends Partial<Omit<Item, 'id' | 'userId'>> {
      userId: Item['userId'],
      page?: number,
      size?: number,
    }
    export type Update = Item;
    export type Remove = Item['id'];
  }

  export namespace Response {
    export type Create = Item;
    export type GetAll = TyGeneral.PageFomServer<Item>;
    export type Update = Item;
    export type Remove = Item['id'];
  }

  export enum Status {
    NONE = 'none',
    LOADING = 'loading',
    ERROR = 'error',
  }

  export enum Error {
    NONE = '',
    LOAD = 'Unable to load tasks',
    EMPTY_USERID = 'The userId should not be empty',
    EMPTY_NAME = 'Task name should not be empty',
    UNABLE_ADD = 'Unable to add a task',
    UNABLE_DELETE = 'Unable to delete a task',
    UNABLE_UPDATE = 'Unable to update a task',
  }

  export enum SearchParams {
    ID = 'id',
    NAME = 'name',
    ITEM_PER_PAGE = 'itemsPerPage',
    PAGE = 'page',
  }
}
