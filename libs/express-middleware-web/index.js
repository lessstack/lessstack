import express, { Router } from "express";

const createWebMiddleware = ({ publicRoute = "/assets", client, logger }) => {
  const middleware = new Router();

  if (!client.isLoaded()) {
    client.setup({ publicRoute });
  }

  middleware.use(publicRoute, express.static(client.publicPath));
  middleware.get("*", async (req, res, next) => {
    try {
      await client.render(res, {
        location: req.originalUrl,
        logger,
      });
    } catch (e) {
      next(e);
    }
  });

  return middleware;
};

export default createWebMiddleware;
