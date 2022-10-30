import App from "./app";
import { createEntry } from "@lessstack/react/node";
import { MemoryRouter } from "react-router-dom";
import type { FC } from "react";
import { Config } from "@lessstack/react";

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
