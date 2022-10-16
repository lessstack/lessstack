import type { LessstackRuntimeProps } from "@lessstack/webpack-config/types";
import { ChunkExtractor } from "@loadable/server";
import type { FC, ReactElement } from "react";
import { useMemo } from "react";
import type { OptionsProp } from "../types";
import NodeContext from "./NodeContext";

declare global {
  const __webpack_public_path__: string;
}

export type NodeWrapperProps = {
  children: ReactElement;
  // options: RefObject<OptionsProp>;
  options: OptionsProp;
};

const filterHmrElements = (elements: ReactElement[]) =>
  elements.filter(
    (element) =>
      !(element.props.src || element.props.href)?.match(/-wps-hmr\.[^.\\/]+$/),
  );

const NodeWrapper: FC<NodeWrapperProps> = ({ children, options }) => {
  const extractor = useMemo(
    () =>
      new ChunkExtractor({
        publicPath: __webpack_public_path__,
        statsFile: options.statsPath,
      }),
    [options],
  );

  const output = extractor.collectChunks(children);
  const contextValue = useMemo(
    () => ({
      collector: {
        linksAdded: false,
        scriptsAdded: false,
        stylesAdded: false,
      },
      links: filterHmrElements(extractor.getLinkElements()),
      scripts: [
        <script
          key="__LESSSTACK_GLOBAL_VARS__"
          dangerouslySetInnerHTML={{
            __html: Object.entries({
              __LESSSTACK_RUNTIME_PROPS__: {
                webpackPublicPath: __webpack_public_path__,
              },
            } as { __LESSSTACK_RUNTIME_PROPS__: LessstackRuntimeProps })
              .map(([key, value]) => `${key}=${JSON.stringify(value)};`)
              .join(""),
          }}
        />,
      ].concat(filterHmrElements(extractor.getScriptElements())),
      styles: filterHmrElements(extractor.getStyleElements()),
    }),
    [extractor],
  );

  return (
    <NodeContext.Provider value={contextValue}>{output}</NodeContext.Provider>
  );
};

export default NodeWrapper;
