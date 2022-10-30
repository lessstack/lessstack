import type { ESLint } from "eslint";

const jestConfig: ESLint.ConfigData = {
  overrides: [
    {
      env: {
        jest: true,
      },
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    },
  ],
};

export = jestConfig;
