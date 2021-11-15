import React from "react";
import { hydrateRoot } from "react-dom";
import { loadableReady } from "@loadable/component";

import "../utils/browserSetup";
// eslint-disable-next-line import/no-unresolved
import Client from "@witb/config-webpack/alias/client";

loadableReady(() => {
  hydrateRoot(document.getElementById("app"), <Client />);
});
