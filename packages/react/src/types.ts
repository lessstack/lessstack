import type { ReactElement } from "react";

export type OptionsProp = {
  doctype: string;
  hydratation: "all" | "selective";
  response: {
    headers: Record<Lowercase<string>, string>;
    statusCode: number;
    statusMessage: string;
  };
  statsPath: string;
};

export type RenderCollector = {
  linksAdded: boolean;
  scriptsAdded: boolean;
  stylesAdded: boolean;
};

export type EntryNode = (props: { options: OptionsProp }) => ReactElement;
