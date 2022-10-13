/** @type {import('eslint').ConfigData} */
module.exports = {
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
