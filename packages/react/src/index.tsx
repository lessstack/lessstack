/* eslint-env browser */
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { loadableReady } from "@loadable/component";
import ExtractedLinks from "./components/ExtractedLinks";
import ExtractedScripts from "./components/ExtractedScripts";
import ExtractedStyles from "./components/ExtractedStyles";

import type { JSXElementConstructor } from "react";

export const hydrate = (
  Component: JSXElementConstructor<Record<string, never>>,
) =>
  loadableReady(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <Component />
      </StrictMode>,
    );
  });

export const Links = ExtractedLinks;
export const Scripts = ExtractedScripts;
export const Styles = ExtractedStyles;
