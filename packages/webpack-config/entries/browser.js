/* eslint-env browser */
import React, { StrictMode } from "react";
import { hydrateRoot } from "react-dom";
import { loadableReady } from "@loadable/component";
import "./browser.entries";

// eslint-disable-next-line import/no-unresolved
import Client from "@lessstack/webpack-config/alias/client";

loadableReady(() => {
  hydrateRoot(
    document.getElementById(globalThis.LESSSTACK_ENVIRONMENT_VARS.rootId),
    <StrictMode>
      <Client />
    </StrictMode>,
  );
});
