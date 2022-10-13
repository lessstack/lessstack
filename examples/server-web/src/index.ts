import express from "express";
import client from "@lessstack/example-client-web/build/node";

const app = express();

app.use("/assets", express.static(client.publicPath));
app.use((req, res) => {
  client.streamRendering({
    publicRoute: "/assets",
    response: res,
  });
});

app.listen(3000);
