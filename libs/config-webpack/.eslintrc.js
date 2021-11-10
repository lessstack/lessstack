module.exports = {
  root: true,
  extends: [require.resolve("@hmr/config-eslint")],
  overrides: [
    {
      files: ["entries/browser.js"],
      env: {
        browser: true,
      },
    },
  ],
};
