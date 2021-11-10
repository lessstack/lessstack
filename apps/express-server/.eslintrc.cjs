module.exports = {
  root: true,
  extends: [require.resolve("@hmr/config-eslint")],
  env: {
    browser: true,
  },
  ignorePatterns: ["/build"],
};
