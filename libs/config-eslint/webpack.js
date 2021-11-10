const baseConfig = require(".");

module.exports = {
  ...baseConfig,
  env: {
    browser: true,
  },
  ignorePatterns: ["/build"],
};
