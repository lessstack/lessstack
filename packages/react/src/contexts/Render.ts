import { createContext } from "react";

import type { RenderCollector } from "../renderCollector";
import type { RenderExtraction, RenderOptions } from "../types";

export type RenderContextProps = {
  collector: RenderCollector;
  extraction: RenderExtraction;
  rootHtml: string;
  rootId: RenderOptions["rootId"];
};

const RenderContext = createContext<RenderContextProps>({
  collector: {
    linksAdded: false,
    rootAdded: false,
    scriptsAdded: false,
    stylesAdded: false,
  },
  extraction: {
    linkElements: [],
    scriptElements: [],
    styleElements: [],
  },
  rootHtml: "",
  rootId: "root",
});

export default RenderContext;
