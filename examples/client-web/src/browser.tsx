import { hydrate } from "@lessstack/react";
import type { FC } from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./app";

const BrowserApp: FC<{ basename: string }> = ({ basename }) => (
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>
);

hydrate(BrowserApp);
