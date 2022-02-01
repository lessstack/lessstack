module.exports = {
  env: {
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "prettier"],
  extends: ["plugin:react/recommended", "airbnb", "prettier"],
  reportUnusedDisableDirectives: true,
  rules: {
    "no-use-before-define": ["error", { variables: false }],
    "prettier/prettier": ["error"],
    "react/jsx-filename-extension": ["off"],
    "sort-imports": ["error", { ignoreDeclarationSort: true }],
  },
  overrides: [
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      env: {
        jest: true,
      },
    },
  ],
};
