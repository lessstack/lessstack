import { createContext } from "react";
import type { ReactElement } from "react";

import type { RenderCollector } from "../renderCollector";
import type { RenderOptions } from "../types";

export type RenderContextProps = {
  collector: RenderCollector;
  links: ReactElement[];
  rootHtml: string;
  rootId: RenderOptions["rootId"];
  scripts: JSX.Element[];
  styles: ReactElement[];
};

const RenderContext = createContext<RenderContextProps>({
  collector: {
    linksAdded: false,
    rootAdded: false,
    scriptsAdded: false,
    stylesAdded: false,
  },
  links: [],
  rootHtml: "",
  rootId: "root",
  scripts: [],
  styles: [],
});

export default RenderContext;
