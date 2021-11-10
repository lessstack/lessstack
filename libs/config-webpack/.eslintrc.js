module.exports = {
  root: true,
  extends: [require.resolve("@witb/config-eslint")],
  overrides: [
    {
      files: ["entries/browser.js"],
      env: {
        browser: true,
      },
    },
  ],
};
