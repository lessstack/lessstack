module.exports = {
  root: true,
  extends: [require.resolve("@witb/config-eslint")],
  env: {
    browser: true,
  },
  ignorePatterns: ["/build"],
};
