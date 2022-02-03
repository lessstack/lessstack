import path from "path";
import { createRequire } from "module";
import express, { Router } from "express";

const requireCjs = createRequire(import.meta.url);
const knownClients = {};

const requireClient = (clientPath) => {
  delete requireCjs.cache[clientPath];
  const client = requireCjs(clientPath);

  return client;
};

const getClient = (clientPath, publicRoute) => {
  let client = knownClients[clientPath].byPublicRoute[publicRoute];

  if (!client) {
    if (knownClients[clientPath].prepared) {
      client = knownClients[clientPath].prepared;
      knownClients[clientPath].prepared = null;
    } else {
      client = requireClient(clientPath);
    }

    client.setup({ publicRoute });
    knownClients[clientPath].byPublicRoute[publicRoute] = client;
  }

  return client;
};

const prepareClient = (clientPath) => {
  if (!knownClients[clientPath]) {
    // we require once in advance to let client throws early
    const prepared = requireClient(clientPath);
    knownClients[clientPath] = {
      prepared,
      publicPath: prepared.publicPath,
      byPublicRoute: {},
    };
  }

  return { publicPath: knownClients[clientPath].publicPath };
};

const createWebMiddleware = ({
  publicRoute = "/assets",
  clientPath,
  logger,
  getProps,
}) => {
  const resolvedClientPath = requireCjs.resolve(clientPath);
  const { publicPath } = prepareClient(resolvedClientPath);

  const middleware = new Router();

  middleware.use(publicRoute, express.static(publicPath));
  middleware.get("*", async (req, res, next) => {
    try {
      const client = getClient(
        resolvedClientPath,
        path.join(req.baseUrl, publicRoute),
      );

      await client.render(res, {
        props: getProps?.(req, res) || {},
        logger,
      });
    } catch (e) {
      next(e);
    }
  });

  return middleware;
};

export default createWebMiddleware;
