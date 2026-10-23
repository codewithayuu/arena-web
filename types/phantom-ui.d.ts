import type { PhantomUiAttributes as BaseAttributes } from "@aejkatappaja/phantom-ui";
import type { CSSProperties } from "react";

export type PhantomUiAttributes = Omit<BaseAttributes, "style"> & {
  style?: CSSProperties | string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "phantom-ui": PhantomUiAttributes;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "phantom-ui": PhantomUiAttributes;
    }
  }
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "phantom-ui": PhantomUiAttributes;
    }
  }
}

export {};
