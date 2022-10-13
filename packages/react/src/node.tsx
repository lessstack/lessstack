import path from "path";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "stream";
import NodeWrapper from "./components/NodeWrapper";

import type { EntryNode } from "./types";
import type { JSXElementConstructor } from "react";
import type { NodeWrapperProps } from "./components/NodeWrapper";

// eslint-disable-next-line no-var
declare var __LESSSTACK__: {
  browserStatsPath: string;
  publicPath: string;
};

const browserStatsPath = path.resolve(
  __dirname,
  __LESSSTACK__.browserStatsPath,
);

export const publicPath = path.resolve(__dirname, __LESSSTACK__.publicPath);

export const streamRendering = ({
  component: Component,
  publicRoute,
  response,
}: {
  component: EntryNode;
  publicRoute: string;
  response: NodeJS.WritableStream;
}) => {
  const { pipe } = renderToPipeableStream(
    <Component
      options={{
        browserStatsPath,
        doctype: "<!DOCTYPE html>",
        hydratation: "all",
        publicPath,
        publicRoute,
        response: {
          headers: {} as Record<Lowercase<string>, string>,
          statusCode: 200,
          statusMessage: "",
        },
      }}
    />,
    {
      onAllReady: () => {
        console.log(publicPath);
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
  };
};
