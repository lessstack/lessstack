/* eslint-env node */
const { VanillaExtractPlugin } = require("@vanilla-extract/webpack-plugin");
const { createConfig } = require("@lessstack/webpack-config/build");

module.exports = createConfig({
  postProcess: (configs) =>
    configs.map((config) => {
      config.plugins.push(new VanillaExtractPlugin());
      return config;
    }),
});
