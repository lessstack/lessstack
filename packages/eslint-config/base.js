/** @type {import('eslint').ConfigData} */
module.exports = {
  env: {
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["prettier", "sort-destructure-keys"],
  reportUnusedDisableDirectives: true,
  rules: {
    "no-use-before-define": ["error", { variables: false }],
    "prettier/prettier": "error",
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
