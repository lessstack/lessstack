import createClient from "@lessstack/example-client-web";
import express from "express";

const app = express();

const { entry: primary } = createClient({
  publicRoute: "/assets",
});

const { entry: secondary } = createClient({
  publicRoute: "/secondary/test",
});
app.use("/secondary/test", express.static(secondary.publicPath));
app.use("/secondary", (req, res) => {
  secondary.streamRendering({
    initialProps: {
      basename: req.baseUrl,
      location: req.originalUrl,
    },
    response: res,
  });
});

app.use("/assets", express.static(primary.publicPath));
app.use((req, res) => {
  primary.streamRendering({
    initialProps: {
      basename: req.baseUrl,
      location: req.originalUrl,
    },
    response: res,
  });
});

app.listen(3000);
