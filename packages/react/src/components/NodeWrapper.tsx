import { useMemo } from "react";
import type { ChunkExtractor } from "@loadable/server";
import type { FC, ReactElement } from "react";

import RenderContext from "../contexts/Render";
import type { RenderContextProps } from "../contexts/Render";
import type { RenderCollector } from "../renderCollector";
import type { InitialProps, LessstackRuntimeProps } from "../types";

const NodeWrapper: FC<{
  children: ReactElement;
  collector: RenderCollector;
  extractor: ChunkExtractor;
  initialProps: InitialProps;
  rootHtml: string;
  rootId: string;
}> = ({ children, collector, extractor, initialProps, rootHtml, rootId }) => {
  const RenderContextValue = useMemo<RenderContextProps>(
    () => ({
      collector,
      links: filterHmrElements(extractor.getLinkElements()),
      rootHtml,
      rootId,
      scripts: [
        <script
          key="LESSSTACK_GLOBAL_VARS"
          dangerouslySetInnerHTML={{
            __html: `LESSSTACK_RUNTIME_PROPS=${JSON.stringify({
              initialProps,
              rootId,
              webpackPublicPath: LESSSTACK_RUNTIME_PROPS.webpackPublicPath,
            } as LessstackRuntimeProps)};`,
          }}
        />,
      ].concat(filterHmrElements(extractor.getScriptElements())),
      styles: filterHmrElements(extractor.getStyleElements()),
    }),
    [collector, extractor, initialProps, rootHtml, rootId],
  );

  return (
    <RenderContext.Provider value={RenderContextValue}>
      {children}
    </RenderContext.Provider>
  );
};

export default NodeWrapper;

const filterHmrElements = (elements: ReactElement[]) =>
  elements.filter(
    (element) =>
      !(element.props.src || element.props.href)?.match(/-wps-hmr\.[^.\\/]+$/),
  );
