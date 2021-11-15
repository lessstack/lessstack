module.exports = {
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
