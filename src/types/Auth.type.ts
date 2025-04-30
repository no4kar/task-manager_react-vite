/* eslint @typescript-eslint/no-namespace: 'off' */
export namespace TyAuth {
  export type Item = {
    id: string;
    email: string;
  }

  export type CreationAttributes = Omit<Item, 'id'> & { password: string };

  export namespace Request {
    export type Login = CreationAttributes;
    export type Logout = void;
    export type Activation = string; // activationToken
    export type Registration = CreationAttributes;
    export type Refresh = void;
  }

  export namespace Response {
    export type Login = {
      user: Item,
      accessToken: string,
    };
    export type Logout = void;
    export type Activation = {
      user: Item,
      accessToken: string,
    };
    export type Registration = {
      message: string,
      error: unknown,
    };
    export type Refresh = {
      user: Item,
      accessToken: string,
    };
  }

  export enum Status {
    NONE = 'none',
    UNAUTHENTICATED = 'unauthenticated',
    REGISTERED = 'registered',
    ACTIVATED = 'activated',
    LOADING = 'loading',
    ERROR = 'error',
  }

  export enum Error {
    NONE = '',
    REGISTERATION = 'Registration failed',
    ACTIVATION = 'Activation failed',
    LOGIN = 'Login failed',
    LOGOUT = 'Logout failed',
    REFRESH = 'Refresh failed',
  }
}
