/* eslint-env browser */
import { default as loadable, lazy, loadableReady } from "@loadable/component";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import type { ComponentType } from "react";

import Config from "./components/Config";
import Document from "./components/Document";
import Links from "./components/ExtractedLinks";
import Scripts from "./components/ExtractedScripts";
import Styles from "./components/ExtractedStyles";
import Root from "./components/Root";

export const hydrate = <Props extends object = object>(
  Component: ComponentType<Props>,
) =>
  loadableReady(() => {
    const root = document.getElementById(__LESSSTACK_RUNTIME_PROPS__.rootId);

    if (!root) {
      console.error(
        `Root element with id "${__LESSSTACK_RUNTIME_PROPS__.rootId}" not found`,
      );
      return;
    }

    hydrateRoot(
      root,
      <StrictMode>
        <Component {...(__LESSSTACK_RUNTIME_PROPS__.initialProps as Props)} />
      </StrictMode>,
    );
  });

export { Config, Document, lazy, Links, loadable, Root, Scripts, Styles };
