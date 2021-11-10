import express, { Router } from "express";

const createWebMiddleware = ({ assetRoute = "/assets", client }) => {
  const middleware = new Router();

  middleware.use(assetRoute, express.static(client.publicPath));
  middleware.get("*", async (req, res, next) => {
    try {
      await client.pipeToResponse(res, {
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
