import client from "@hmr/web-client";

const NODE_ENV = process.env.NODE_ENV || "development";

const commonConfig = {
  execArgv: "--experimental-specifier-resolution=node",
  env: {
    NODE_ENV,
  },
};

const config =
  NODE_ENV === "development"
    ? {
        ...commonConfig,
        watch: ["./src", client.statsPath],
        maxInstances: 3,
        minInstances: 1,
      }
    : {
        ...commonConfig,
        maxInstances: 1,
        minInstances: 0,
        maxFailures: 0,
      };

export default config;
