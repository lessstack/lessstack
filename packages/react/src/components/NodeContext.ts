import { createContext } from "react";

import type { ReactElement } from "react";
import type { RenderCollector } from "../types";

const NodeContext = createContext<{
  collector: RenderCollector;
  links: ReactElement[];
  scripts: JSX.Element[];
  styles: ReactElement[];
}>({
  collector: {
    linksAdded: false,
    scriptsAdded: false,
    stylesAdded: false,
  },
  links: [],
  scripts: [],
  styles: [],
});

export default NodeContext;
