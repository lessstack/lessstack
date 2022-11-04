import { useContext } from "react";
import type { FC, ReactNode } from "react";

import ConfigContext from "../contexts/Config";
import type { RenderOptions } from "../types";

const Config: FC<{
  children?: ReactNode;
  doctype?: RenderOptions["doctype"];
  document?: RenderOptions["document"];
  hydratation?: RenderOptions["hydratation"];
  initialProps?: RenderOptions["initialProps"];
  response?: Partial<RenderOptions["response"]>;
  rootId?: RenderOptions["rootId"];
  statsPath?: RenderOptions["statsPath"];
}> = ({
  children = null,
  doctype = null,
  document = null,
  hydratation = null,
  initialProps = null,
  response = null,
  rootId = null,
  statsPath = null,
}) => {
  const config = useContext(ConfigContext);

  config.doctype = doctype ?? config.doctype;
  config.document = document ?? config.document;
  config.initialProps = initialProps
    ? { ...config.initialProps, ...initialProps }
    : config.initialProps;
  config.hydratation = hydratation ?? config.hydratation;
  config.response = response
    ? {
        ...config.response,
        ...response,
        headers: response.headers
          ? {
              ...config.response.headers,
              ...response.headers,
            }
          : config.response.headers,
      }
    : config.response;
  config.rootId = rootId ?? config.rootId;
  config.statsPath = statsPath ?? config.statsPath;

  return <>{children}</>;
};

export default Config;
