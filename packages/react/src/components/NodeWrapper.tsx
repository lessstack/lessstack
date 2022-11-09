import { useMemo } from "react";
import type { FC, ReactElement } from "react";

import RenderContext from "../contexts/Render";
import type { RenderContextProps } from "../contexts/Render";
import type { RenderCollector } from "../renderCollector";
import type { RenderExtraction } from "../types";

const NodeWrapper: FC<{
  children: ReactElement;
  collector: RenderCollector;
  extraction: RenderExtraction;
  rootHtml: string;
  rootId: string;
}> = ({ children, collector, extraction, rootHtml, rootId }) => {
  const RenderContextValue = useMemo<RenderContextProps>(
    () => ({
      collector,
      extraction,
      rootHtml,
      rootId,
    }),
    [collector, extraction, rootHtml, rootId],
  );

  return (
    <RenderContext.Provider value={RenderContextValue}>
      {children}
    </RenderContext.Provider>
  );
};

export default NodeWrapper;
