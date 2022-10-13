import { useMemo } from "react";
import NodeContext from "./NodeContext";

import type { FC, ReactNode } from "react";

const BrowserWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const contextValue = useMemo(
    () => ({
      collector: {
        linksAdded: false,
        scriptsAdded: false,
        stylesAdded: false,
      },
      links: [],
      scripts: [],
      styles: [],
    }),
    [],
  );

  return (
    <NodeContext.Provider value={contextValue}>{children}</NodeContext.Provider>
  );
};

export default BrowserWrapper;
