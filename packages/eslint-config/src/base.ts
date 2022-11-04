import type { ESLint } from "eslint";

const baseConfig: ESLint.ConfigData = {
  env: {
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["prettier", "sort-destructure-keys", "simple-import-sort"],
  reportUnusedDisableDirectives: true,
  rules: {
    "no-use-before-define": ["error", { variables: false }],
    "prettier/prettier": "error",
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // Side effect imports
          ["^\\u0000"],
          // Node.js builtin imports
          ["^node:", "^node:.+\\u0000$"],
          // Packages imports
          ["^[^./]", "^[^./].+\\u0000$"],
          // Relative imports
          ["^\\.", "^\\..+\\u0000$"],
          // Assets imports
          ["\\.(css|svg|jpg|gif|png|eot|svg|ttf|woff|woff2|md|mdx)"],
        ],
      },
    ],
    "sort-destructure-keys/sort-destructure-keys": [
      "error",
      { caseSensitive: true },
    ],
    "sort-keys": [
      "error",
      "asc",
      { caseSensitive: true, minKeys: 2, natural: true },
    ],
  },
};

export = baseConfig;
