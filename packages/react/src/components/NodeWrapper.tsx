import { ChunkExtractor } from "@loadable/server";
import type { FC, ReactElement } from "react";
import { useMemo } from "react";
import type { OptionsProp } from "../types";
import NodeContext from "./NodeContext";

export type NodeWrapperProps = {
  children: ReactElement;
  // options: RefObject<OptionsProp>;
  options: OptionsProp;
};

// const filterHmrElements = (elements: ReactElement[]) =>
//   elements.filter(
//     (element) =>
//       !(element.props.src || element.props.href)?.match(/-wps-hmr\.[^.\\/]+$/),
//   );

const NodeWrapper: FC<NodeWrapperProps> = ({ children, options }) => {
  const extractor = useMemo(
    () =>
      new ChunkExtractor({
        publicPath: options.publicRoute,
        statsFile: options.browserStatsPath,
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
      links: extractor.getLinkElements(),
      scripts: [
        <script
          key="LESSSTACK_ENVIRONMENT_VARS"
          dangerouslySetInnerHTML={{
            __html: `LESSSTACK_ENVIRONMENT_VARS = ${JSON.stringify({
              webpackPublickPath: __webpack_public_path__,
            })};`,
          }}
        />,
      ].concat(extractor.getScriptElements()),
      styles: extractor.getStyleElements(),
    }),
    [extractor],
  );

  return (
    <NodeContext.Provider value={contextValue}>{output}</NodeContext.Provider>
  );
};

export default NodeWrapper;
