import React from "react";
import { renderToStaticMarkup, renderToPipeableStream } from "react-dom/server";
import fs from "fs";

import RenderProvider from "../components/RenderProvider.js";
import DefaultDocument from "../components/Document.js";

// __WITB__ is defined by webpack
// eslint-disable-next-line no-undef
const { publicPath, statsPath } = __WITB__;

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
let doctype;
let Document;
let bootstrapScripts;

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

  bootstrapScripts = JSON.parse(fs.readFileSync(statsPath))
    .scripts.filter((script) => script.isInitial)
    .map((script) => `${publicRoute}${script.path}`);

  ({
    default: Client,
    doctype = "<!DOCTYPE html>",
    Document = DefaultDocument,
    // eslint-disable-next-line import/no-unresolved, global-require
  } = require("@witb/webpack-config/alias/client"));
};

export const isLoaded = () => clientIsLoaded;

export const pipeRenderToResponse = (
  res,
  { location, logger = defaultLogger },
) => {
  if (!isLoaded()) {
    setup();
  }

  return new Promise((resolve, reject) => {
    const response = {
      statusCode: null,
      statusMessage: null,
      headers: {},
    };
    let handledError = false;
    let toAppendFirst = "";
    let toAppendLast = "";

    console.log(bootstrapScripts);

    const { pipe, abort } = renderToPipeableStream(
      <Client location={location} response={response} />,
      {
        bootstrapScripts,
        onCompleteShell() {
          if (handledError) {
            abort();
            return reject(handledError);
          }

          if (response.headers.Location) {
            res.writeHead(
              response.statusCode || 308,
              response.statusMessage,
              response.headers,
            );
            abort();
            return resolve();
          }

          const collector = {};
          const documentString = `${doctype}\n${renderToStaticMarkup(
            <RenderProvider collector={collector} html=">>>><<<<">
              <Document />
            </RenderProvider>,
          )}`;

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

          res.write(toAppendFirst);
          return pipe(res);
        },
        onCompleteAll() {
          if (toAppendLast) {
            res.write(toAppendLast);
            resolve();
          }
        },
        onError(error) {
          handledError = error;
        },
      },
    );
  });
};

export { publicPath, statsPath };
