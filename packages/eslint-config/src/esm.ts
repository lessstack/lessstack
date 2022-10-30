import type { ESLint } from "eslint";

const esmConfig: ESLint.ConfigData = {
  env: {
    node: true,
  },
  rules: {
    "import/extensions": [
      "error",
      {
        js: "ignorePackages",
      },
    ],
  },
};

export = esmConfig;
