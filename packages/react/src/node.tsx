import path from "path";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "stream";
import NodeWrapper from "./components/NodeWrapper";

import type { LessstackBuildProps } from "@lessstack/webpack-config/types";
import type { EntryNode } from "./types";
import type { JSXElementConstructor } from "react";
import type { NodeWrapperProps } from "./components/NodeWrapper";

declare global {
  const __LESSSTACK_BUILD_PROPS__: LessstackBuildProps;
}

const statsPath = path.resolve(__dirname, __LESSSTACK_BUILD_PROPS__.statsPath);

export const publicPath = path.resolve(
  __dirname,
  __LESSSTACK_BUILD_PROPS__.publicPath,
);

export const streamRendering = ({
  component: Component,
  response,
}: {
  component: EntryNode;
  response: NodeJS.WritableStream;
}) => {
  const { pipe } = renderToPipeableStream(
    <Component
      options={{
        doctype: "<!DOCTYPE html>",
        hydratation: "all",
        response: {
          headers: {} as Record<Lowercase<string>, string>,
          statusCode: 200,
          statusMessage: "",
        },
        statsPath,
      }}
    />,
    {
      onAllReady: () => {
        const pass = new PassThrough();
        pass.on("data", (chunk) => response.write(chunk));
        pass.on("close", () => {
          response.end();
        });
        return pipe(pass);
      },
      onShellError(error) {
        console.log(error);
        response.end();
      },
    },
  );
};

export const createEntry = (
  Component: JSXElementConstructor<Record<string, never>>,
) => {
  const Entry = ({ options }: Pick<NodeWrapperProps, "options">) => (
    <NodeWrapper options={options}>
      <Component />
    </NodeWrapper>
  );

  return {
    publicPath,
    streamRendering: (
      options: Omit<Parameters<typeof streamRendering>[0], "component">,
    ) =>
      streamRendering({
        ...options,
        component: Entry,
      }),
  } as const;
};
