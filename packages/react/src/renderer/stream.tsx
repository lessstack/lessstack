import { renderToPipeableStream, renderToStaticMarkup } from "react-dom/server";
import { PassThrough } from "stream";
import { StrictMode } from "react";
import { ChunkExtractor } from "@loadable/server";
import ConfigContext from "../contexts/Config";
import { validateCollector } from "../renderCollector";
import NodeWrapper from "../components/NodeWrapper";
import Document from "../components/Document";

import type { ServerResponse } from "http";
import type { Writable } from "stream";
import type { RendererBaseOptions, RenderOptions } from "../types";
import type {
  RenderCollector,
  RenderCollectorLogger,
} from "../renderCollector";

export const redirectionStatusCodes = [
  300, 301, 302, 303, 304, 307, 308,
] as const;

export type RenderToStreamResponse = ServerResponse | Writable;

export type RenderToStreamOptions<Props extends object = object> =
  RendererBaseOptions<Props> & {
    logger?: RenderCollectorLogger;
    publicPath: string;
    response: RenderToStreamResponse;
    statsPath: string;
  };

export const renderToStream = <Props extends object = object>({
  component: Component,
  initialProps = {} as Props,
  logger,
  publicPath,
  response,
  statsPath,
}: RenderToStreamOptions<Props>) => {
  const extractor = new ChunkExtractor({
    publicPath,
    statsFile: statsPath,
  });

  const config: RenderOptions = {
    doctype: "<!DOCTYPE html>",
    document: Document,
    hydratation: "all",
    initialProps: {},
    response: {
      headers: {},
      statusCode: 200,
      statusMessage: "",
    },
    rootId: "root",
    statsPath,
  };

  const { pipe } = renderToPipeableStream(
    extractor.collectChunks(
      <ConfigContext.Provider value={config}>
        <Component {...initialProps} />
      </ConfigContext.Provider>,
    ),
    {
      onAllReady: () => {
        if (config.hydratation === "selective") {
          return;
        }

        startRenderOutput({
          config,
          extractor,
          logger,
          pipe,
          response,
        });
      },
      onError(error) {
        logger?.error?.(error);
      },
      onShellError(error) {
        logger?.error?.(error);
        response.end();
      },
      onShellReady() {
        if (config.hydratation !== "selective") {
          return;
        }

        startRenderOutput({
          config,
          extractor,
          logger,
          pipe,
          response,
        });
      },
    },
  );
};

const startRenderOutput = ({
  config,
  extractor,
  logger,
  pipe,
  response,
}: {
  config: RenderOptions;
  extractor: ChunkExtractor;
  logger?: RenderCollectorLogger;
  pipe: (stream: Writable) => void;
  response: ServerResponse | Writable;
}) => {
  if ("writeHead" in response) {
    if (config.response.headers.location) {
      response.writeHead(
        (redirectionStatusCodes as readonly number[]).includes(
          config.response.statusCode,
        )
          ? config.response.statusCode
          : 308,
        config.response.statusMessage,
        config.response.headers,
      );
      return;
    }

    response.writeHead(
      config.response.statusCode,
      config.response.statusMessage,
      config.response.headers,
    );
  }

  const { document: Document, initialProps, rootId } = config;
  const collector: RenderCollector = {
    linksAdded: false,
    rootAdded: false,
    scriptsAdded: false,
    stylesAdded: false,
  };
  const [beforeRender, afterRender] = renderToStaticMarkup(
    <StrictMode>
      <NodeWrapper
        collector={collector}
        extractor={extractor}
        initialProps={initialProps}
        rootHtml={">>>><<<<"}
        rootId={rootId}
      >
        <Document />
      </NodeWrapper>
    </StrictMode>,
  ).split(">>>><<<<");

  validateCollector(collector, logger);

  const pass = new PassThrough();
  response.write(config.doctype);
  response.write(beforeRender);
  pass.on("data", (chunk) => response.write(chunk));
  pass.on("close", () => {
    response.write(afterRender);
    response.end();
  });
  return pipe(pass);
};
