/* eslint-env browser */
import type { ComponentType } from "react";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { loadableReady, lazy, default as loadable } from "@loadable/component";
import Links from "./components/ExtractedLinks";
import Scripts from "./components/ExtractedScripts";
import Styles from "./components/ExtractedStyles";
import Root from "./components/Root";
import Config from "./components/Config";
import Document from "./components/Document";

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

export { lazy, loadable, Config, Document, Root, Links, Scripts, Styles };
