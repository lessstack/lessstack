import React from "react";
import { hydrateRoot } from "react-dom";
import { loadableReady } from "@loadable/component";

if (globalThis.WITB_ENVIRONMENT_VARS?.webpackPublickPath) {
  // eslint-disable-next-line no-undef, camelcase
  __webpack_public_path__ =
    globalThis.WITB_ENVIRONMENT_VARS?.webpackPublickPath;
}

// eslint-disable-next-line import/no-unresolved
import Client from "@witb/webpack-config/alias/client";

loadableReady(() => {
  hydrateRoot(document.getElementById("app"), <Client />);
});
