import type { ESLint } from "eslint";

const config: ESLint.ConfigData = {
  extends: ["./base", "./jest", "./react", "./typescript"],
};

export = config;
