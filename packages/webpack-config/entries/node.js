/* global __LESSSTACK__ */
import path from "path";
import React, { StrictMode } from "react";
import { PassThrough } from "stream";
import { renderToStaticMarkup, renderToPipeableStream } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";

import RenderProvider from "../components/RenderProvider.js";
import DefaultDocument from "../components/Document.js";
import ConfigProvider from "../components/ConfigProvider.js";

// __LESSSTACK__ is defined by webpack
const browserStatsPath = path.resolve(
  __dirname,
  __LESSSTACK__.browserStatsPath,
);
const nodeStatsPath = path.resolve(__dirname, __LESSSTACK__.nodeStatsPath);
const publicPath = path.resolve(__dirname, __LESSSTACK__.publicPath);
const defaultLogger =
  (process.env.NODE_ENV ?? "development") === "development" ? console : null;

const validateCollector = (collector, logger) => {
  if (!collector.scriptsAdded) {
    logger?.warn(`Custom Document does not contain <ExtractedScripts />`);
  }

  if (!collector.linksAdded) {
    logger.warn(`Custom? Document does not contain <ExtractedLinks />`);
  }

  if (!collector.stylesAdded) {
    logger?.warn(`Custom Document does not contain <ExtractedStyles />`);
  }

  if (!collector.rootAdded) {
    throw new Error(`Custom Document does not contain <Root />`);
  }
};

let clientIsLoaded = false;
let publicRoute;
let Client;

export const setup = (options) => {
  if (clientIsLoaded) {
    throw new Error("Trying to setup client after it was loaded");
  }

  clientIsLoaded = true;

  if (options?.publicRoute) {
    if (options.publicRoute[options.publicRoute.length - 1] === "/") {
      publicRoute = options.publicRoute;
    } else {
      publicRoute = `${options.publicRoute}/`;
    }
    // eslint-disable-next-line no-undef, camelcase
    __webpack_public_path__ = publicRoute;
  }

  // eslint-disable-next-line import/no-unresolved, global-require
  ({ default: Client } = require("@lessstack/webpack-config/alias/client"));
};

export const isLoaded = () => clientIsLoaded;

export const render = (res, { props, logger = defaultLogger }) => {
  if (!isLoaded()) {
    setup();
  }

  return new Promise((resolve, reject) => {
    const extractor = new ChunkExtractor({
      publicPath: publicRoute,
      statsFile: browserStatsPath,
    });

    const response = {
      statusCode: null,
      statusMessage: null,
      headers: {},
    };
    const config = {
      doctype: "<!DOCTYPE html>",
      document: DefaultDocument,
      rootId: "root",
    };
    let toAppendFirst = "";
    let toAppendLast = "";

    const { pipe, abort } = renderToPipeableStream(
      extractor.collectChunks(
        <StrictMode>
          <ConfigProvider config={config}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Client {...props} response={response} />
          </ConfigProvider>
        </StrictMode>,
      ),
      {
        onCompleteShell() {
          if (response.headers.Location) {
            res.writeHead(
              response.statusCode || 308,
              response.statusMessage,
              response.headers,
            );
            abort();
            return resolve();
          }

          const { document: Document } = config;
          const collector = {};
          const documentString = renderToStaticMarkup(
            <StrictMode>
              <RenderProvider
                rootId={config.rootId}
                extractor={extractor}
                collector={collector}
                html=">>>><<<<"
              >
                <Document />
              </RenderProvider>
            </StrictMode>,
          );

          try {
            validateCollector(collector, logger);
          } catch (e) {
            abort();
            return reject(e);
          }

          res.writeHead(response.statusCode || 200, response.statusMessage, {
            "content-type": "text/html",
            ...response.headers,
          });

          [toAppendFirst, toAppendLast] = documentString.split(">>>><<<<");

          res.write(config.doctype);
          res.write(toAppendFirst);

          const pass = new PassThrough();
          pass.on("data", (chunk) => res.write(chunk));
          pass.on("close", () => {
            res.write(toAppendLast);
            res.end();
            resolve();
          });
          return pipe(pass);
        },
        onError(error) {
          abort();
          return reject(error);
        },
      },
    );
  });
};

export { publicPath, browserStatsPath, nodeStatsPath };
