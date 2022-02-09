import client from "@witb/web-client";

const NODE_ENV = process.env.NODE_ENV || "development";

const commonConfig = {
  env: {
    NODE_ENV,
  },
};

const config =
  NODE_ENV === "development"
    ? {
        ...commonConfig,
        watch: ["./src", client.nodeStatsPath, client.browserStatsPath],
        maxInstances: 3,
        minInstances: 1,
      }
    : {
        ...commonConfig,
        maxInstances: 1,
        minInstances: 0,
        maxFailures: 0,
        logs: false,
      };

export default config;
