import express, { Router } from "express";

const createWebMiddleware = ({ assetRoute = "/assets", client }) => {
  const middleware = new Router();

  if (!client.isLoaded()) {
    client.setup({ publicRoute: assetRoute });
  }

  middleware.use(assetRoute, express.static(client.publicPath));
  middleware.get("*", async (req, res, next) => {
    try {
      await client.pipeRenderToResponse(res, {
        location: req.originalUrl,
        publicRoute: assetRoute,
      });
    } catch (e) {
      next(e);
    }
  });

  return middleware;
};

export default createWebMiddleware;
