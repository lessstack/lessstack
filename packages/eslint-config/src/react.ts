import type { ESLint } from "eslint";

const reactConfig: ESLint.ConfigData = {
  extends: [
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "react-hooks"],
  rules: {
    /**
     * Boolean properties must starts with "is" or "has" prefix.
     */
    "react/boolean-prop-naming": [
      "error",
      {
        rule: "^(is|has)[A-Z]([A-Za-z0-9]?)+",
        validateNested: false,
      },
    ],
    /**
     * This rule is impracticable as it prohibits dynamic
     * assignment even with enforced type or proptype.
     * @see: https://github.com/jsx-eslint/eslint-plugin-react/issues/1555
     */
    "react/button-has-type": "off",
    /**
     * Use destructuring assignment instead of defaultProps they might
     * be deprecated in the future.
     * @see: https://twitter.com/dan_abramov/status/1133878326358171650
     */
    "react/default-props-match-prop-types": ["error"],
    /**
     * Destructuring props enforce the use of a single default value by
     * destructuring assignment.
     * @todo: find rule for enforcing destructuring assignment of optional
     * properties.
     */
    "react/destructuring-assignment": [
      "error",
      "always",
      { destructureInSignature: "always" },
    ],
    "react/function-component-definition": [
      "error",
      {
        namedComponents: ["arrow-function"],
      },
    ],
    "react/require-default-props": [
      "error",
      {
        functions: "defaultArguments",
      },
    ],
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/rules-of-hooks": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

export = reactConfig;
