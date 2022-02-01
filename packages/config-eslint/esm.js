module.exports = {
  root: true,
  extends: ["."],
  rules: {
    "import/extensions": [
      "error",
      {
        js: "ignorePackages",
      },
    ],
  },
};
