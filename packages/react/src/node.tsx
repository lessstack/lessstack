import path from "path";
import type { RenderToStreamOptions } from "./renderer/stream";
import { renderToStream } from "./renderer/stream";
import type { ComponentType } from "react";

export const statsPath = path.resolve(
  __dirname,
  __LESSSTACK_BUILD_PROPS__.statsPath,
);

export const publicPath = path.resolve(
  __dirname,
  __LESSSTACK_BUILD_PROPS__.publicPath,
);

export const createEntry = <Props extends object = object>(
  Component: ComponentType<Props>,
) =>
  ({
    publicPath,
    streamRendering: ({
      initialProps,
      logger,
      response,
    }: Pick<
      RenderToStreamOptions<Props>,
      "initialProps" | "logger" | "response"
    >) =>
      renderToStream<Props>({
        component: Component,
        initialProps,
        logger,
        publicPath: __LESSSTACK_RUNTIME_PROPS__.webpackPublicPath,
        response,
        statsPath,
      } as RenderToStreamOptions<Props>),
  } as const);
