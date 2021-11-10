import express from "express";
import client from "@witb/web-client";
import createWebMiddleware from "@witb/express-middleware-web";

const app = express();

app.use(createWebMiddleware({ client }));

app.listen(5000);
