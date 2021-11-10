import express from "express";
import client from "@hmr/web-client";
import createWebMiddleware from "@hmr/express-middleware-web";

const app = express();

app.use(createWebMiddleware({ client }));

app.listen(5000);
