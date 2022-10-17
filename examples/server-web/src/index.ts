import express from "express";
import createClient from "@lessstack/example-client-web";

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
    initialProps: {},
    response: res,
  });
});

app.use("/assets", express.static(primary.publicPath));
app.use((req, res) => {
  primary.streamRendering({
    response: res,
  });
});

app.listen(3000);
