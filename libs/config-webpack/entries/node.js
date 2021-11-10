import React from "react";
import { renderToStaticMarkup, renderToPipeableStream } from "react-dom/server";
import { ChunkExtractor } from "@loadable/server";

import RenderProvider from "../components/RenderProvider";
import DefaultDocument from "../components/Document";

// __WITB__ is defined by webpack
// eslint-disable-next-line no-undef
const { publicPath, statsPath } = __WITB__;

const {
  default: Client,
  doctype = "<!DOCTYPE html>",
  Document = DefaultDocument,
  // @witb/config-webpack/alias/client is aliased by webpack
  // eslint-disable-next-line import/no-unresolved
} = require("@witb/config-webpack/alias/client");

export const pipeToResponse = (res, { publicRoute, location }) =>
  new Promise((resolve, reject) => {
    const extractor = new ChunkExtractor({
      publicPath: publicRoute,
      statsFile: statsPath,
    });

    const response = {
      statusCode: null,
      statusMessage: null,
      headers: {},
    };
    let handledError = false;
    let toAppendFirst = "";
    let toAppendLast = "";

    const { pipe, abort } = renderToPipeableStream(
      extractor.collectChunks(
        <Client location={location} response={response} />,
      ),
      {
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
            <RenderProvider
              extractor={extractor}
              collector={collector}
              html=">>>><<<<"
            >
              <Document />
            </RenderProvider>,
          )}`;

          if (!collector.scriptsAdded) {
            // eslint-disable-next-line no-console
            console.warn(
              `Custom Document does not contain <ExtractedScripts />`,
            );
          }
          if (!collector.linksAdded) {
            // eslint-disable-next-line no-console
            console.warn(`Custom Document does not contain <ExtractedLinks />`);
          }
          if (!collector.stylesAdded) {
            // eslint-disable-next-line no-console
            console.warn(
              `Custom Document does not contain <ExtractedStyles />`,
            );
          }
          if (!collector.rootAdded) {
            abort();
            return reject(
              new Error(`Custom Document does not contain <Root />`),
            );
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

export { publicPath, statsPath };
