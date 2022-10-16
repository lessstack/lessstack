import path from "path";
import type { EntryNode } from "./types";
import { renderToStream } from "./renderer/stream";

export const statsPath = path.resolve(
  __dirname,
  __LESSSTACK_BUILD_PROPS__.statsPath,
);

export const publicPath = path.resolve(
  __dirname,
  __LESSSTACK_BUILD_PROPS__.publicPath,
);

export const createEntry = (Component: EntryNode) =>
  ({
    publicPath,
    streamRendering: (
      options: Omit<
        Parameters<typeof renderToStream>[0],
        "component" | "publicPath" | "statsPath"
      >,
    ) =>
      renderToStream({
        ...options,
        component: Component,
        publicPath: __LESSSTACK_RUNTIME_PROPS__.webpackPublicPath,
        statsPath,
      }),
  } as const);
