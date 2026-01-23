import React from 'react';

/* eslint @typescript-eslint/no-namespace: 'off' */
export namespace TyEvt {
  export namespace Change {
    export type InputElmt = React.ChangeEvent<HTMLInputElement>;
    export type TextAreaElmt = React.ChangeEvent<HTMLTextAreaElement>;
    export type ButtonElmt = React.ChangeEvent<HTMLButtonElement>;
    export type SelectElmt = React.ChangeEvent<HTMLSelectElement>;
  }

  export namespace Keybr {
    export type InputElmt = React.KeyboardEvent<HTMLInputElement>;
    export type TextAreaElmt = React.KeyboardEvent<HTMLTextAreaElement>;
  }

  export namespace Mouse {
    export type ButtonElmt = React.MouseEvent<HTMLButtonElement>;
    export type DivElmt = React.MouseEvent<HTMLDivElement>;
    export type InputElmt = React.MouseEvent<HTMLInputElement>;
  }

  export namespace Focus {
    export type InputElmt = React.FocusEvent<HTMLInputElement>;
  }

  // Centralized custom event names
  export const CustomEvent = {
    TOGGLE_PAGE_ASIDE: "toggle-page-aside",
    // Add more events here as needed
  } as const;
  
  export type CustomEventName
    = typeof CustomEvent[keyof typeof CustomEvent];
}
