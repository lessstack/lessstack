import { hydrate } from "@lessstack/react";
import { BrowserRouter } from "react-router-dom";
import type { FC } from "react";

import App from "./app";

const BrowserApp: FC<{ basename: string }> = ({ basename }) => (
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>
);

hydrate(BrowserApp);
