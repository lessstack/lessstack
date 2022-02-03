import express from "express";
import createWebMiddleware from "@witb/express-middleware-web";

const app = express();
app.use(
  createWebMiddleware({
    clientPath: "@witb/web-client",
    getProps: (req) => ({
      url: req.url,
      baseUrl: req.baseUrl,
    }),
  }),
);

app.listen(5000);
