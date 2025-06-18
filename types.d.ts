/// <reference types="react" />

import React from "react";

declare global {
  namespace React {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
      [key: string]: any;
    }
  }
}

export {};
