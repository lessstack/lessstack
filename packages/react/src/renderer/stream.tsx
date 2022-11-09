import { ChunkExtractor } from "@loadable/server";
import { StrictMode, Suspense } from "react";
import { renderToPipeableStream, renderToStaticMarkup } from "react-dom/server";
import { PassThrough } from "stream";
import type { ServerResponse } from "http";
import type { ReactElement } from "react";
import type { Writable } from "stream";

import DefaultDocument from "../components/Document";
import NodeWrapper from "../components/NodeWrapper";
import ConfigContext from "../contexts/Config";
import { validateCollector } from "../renderCollector";
import type {
  RenderCollector,
  RenderCollectorLogger,
} from "../renderCollector";
import type {
  LessstackRuntimeProps,
  RendererBaseOptions,
  RenderExtraction,
  RenderOptions,
} from "../types";

const HTTP_REDIRECTION_STATUS_CODES = {
  found: 302,
  movedPermanently: 301,
  multipleChoices: 300,
  notModified: 304,
  permanentRedirect: 308,
  seeOther: 303,
  temporaryRedirect: 307,
} as const;

export const HTTP_REDIRECTION_STATUS_CODES_LIST = Object.values(
  HTTP_REDIRECTION_STATUS_CODES,
);

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
    document: DefaultDocument,
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
        <Suspense>
          <Component {...initialProps} />
        </Suspense>
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
        (HTTP_REDIRECTION_STATUS_CODES_LIST as readonly number[]).includes(
          config.response.statusCode,
        )
          ? config.response.statusCode
          : HTTP_REDIRECTION_STATUS_CODES.permanentRedirect,
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

  const { document: Document, rootId } = config;
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
        extraction={extract(extractor, config)}
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

const filterHmrElements = (elements: ReactElement[]) =>
  elements.filter(
    (element) =>
      !(element.props.src || element.props.href)?.match(/-wps-hmr\.[^.\\/]+$/),
  );

const extract = (
  extractor: ChunkExtractor,
  config: RenderOptions,
): RenderExtraction => ({
  linkElements: filterHmrElements(
    extractor.getLinkElements(),
  ) as RenderExtraction["linkElements"],
  scriptElements: [
    <script
      key="LESSSTACK_GLOBAL_VARS"
      dangerouslySetInnerHTML={{
        __html: `LESSSTACK_RUNTIME_PROPS=${JSON.stringify({
          initialProps: config.initialProps,
          rootId: config.rootId,
          webpackPublicPath: LESSSTACK_RUNTIME_PROPS.webpackPublicPath,
        } as LessstackRuntimeProps)};`,
      }}
    />,
  ].concat(
    filterHmrElements(extractor.getScriptElements()),
  ) as RenderExtraction["scriptElements"],
  styleElements: filterHmrElements(
    extractor.getStyleElements(),
  ) as RenderExtraction["styleElements"],
});
