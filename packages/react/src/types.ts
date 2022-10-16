import type {
  LessstackBuildProps as LessstackWebpackBuildProps,
  LessstackRuntimeProps as LessstackWebpackRuntimeProps,
} from "@lessstack/webpack-config/types";
import type { JSXElementConstructor } from "react";

export type RootId = string;

export type RenderOptions = {
  doctype: string;
  document: JSXElementConstructor<Record<number | string, never>>;
  hydratation: "all" | "selective";
  response: {
    // headers: Record<Lowercase<string>, string>;
    headers: Record<string, string>;
    statusCode: number;
    statusMessage: string;
  };
  rootId: RootId;
  statsPath: string;
};

export type EntryNode = JSXElementConstructor<Record<string, never>>;

export type LessstackRuntimeProps = LessstackWebpackRuntimeProps & {
  rootId: RootId;
};

declare global {
  const __LESSSTACK_BUILD_PROPS__: LessstackWebpackBuildProps;
  const __LESSSTACK_RUNTIME_PROPS__: LessstackRuntimeProps;
}
