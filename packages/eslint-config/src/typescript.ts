import type { ESLint } from "eslint";

const typescriptConfig: ESLint.ConfigData = {
  overrides: [
    {
      extends: [
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended",
      ],
      files: ["**/*.ts?(x)"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint", "typescript-sort-keys"],
      rules: {
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/sort-type-union-intersection-members": "error",
        "spaced-comment": ["error", "always", { markers: ["/"] }],
        "typescript-sort-keys/interface": "error",
        "typescript-sort-keys/string-enum": "error",
      },
    },
  ],
};

export = typescriptConfig;
