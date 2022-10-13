import type { ReactElement } from "react";

declare global {
  // eslint-disable-next-line no-var
  var LESSSTACK_ENVIRONMENT_VARS: {
    webpackPublickPath: string;
  };
  // eslint-disable-next-line no-var
  var __webpack_public_path__: string;
}

export type OptionsProp = {
  browserStatsPath: string;
  doctype: string;
  hydratation: "all" | "selective";
  publicPath: string;
  publicRoute: string;
  response: {
    headers: Record<Lowercase<string>, string>;
    statusCode: number;
    statusMessage: string;
  };
};

export type RenderCollector = {
  linksAdded: boolean;
  scriptsAdded: boolean;
  stylesAdded: boolean;
};

export type EntryNode = (props: { options: OptionsProp }) => ReactElement;
