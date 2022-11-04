import { Config } from "@lessstack/react";
import { createEntry } from "@lessstack/react/node";
import { MemoryRouter } from "react-router-dom";
import type { FC } from "react";

import App from "./app";

const NodeApp: FC<{ basename: string; location: string }> = ({
  basename,
  location,
}) => (
  <Config initialProps={{ basename }}>
    <MemoryRouter basename={basename} initialEntries={[location]}>
      <App />
    </MemoryRouter>
  </Config>
);

export const entry = createEntry(NodeApp);
