import type { FC, ReactNode } from "react";
import { useContext } from "react";
import ConfigContext from "../contexts/Config";
import type { RenderOptions } from "../types";

const Config: FC<Partial<RenderOptions> & { children?: ReactNode }> = ({
  children = null,
  doctype,
  document,
  hydratation,
  initialProps,
  response,
  rootId,
  statsPath,
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
