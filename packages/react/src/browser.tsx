/* eslint-env browser */
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { loadableReady, lazy, default as loadable } from "@loadable/component";
import Links from "./components/ExtractedLinks";
import Scripts from "./components/ExtractedScripts";
import Styles from "./components/ExtractedStyles";
import Root from "./components/Root";
import Config from "./components/Config";
import Document from "./components/Document";

import type { JSXElementConstructor } from "react";
export const hydrate = (
  Component: JSXElementConstructor<Record<string, never>>,
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
        <Component />
      </StrictMode>,
    );
  });

export { lazy, loadable, Config, Document, Root, Links, Scripts, Styles };
