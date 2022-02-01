const path = require("path");

module.exports = {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "\\.[jt]sx?$": "babel-jest",
    "\\.(gif|jpg|png|svg)$": path.join(__dirname, "transformers/base64.js"),
  },
};
