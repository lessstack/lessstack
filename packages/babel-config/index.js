module.exports = () => ({
  presets: ["@babel/preset-env", "@babel/preset-react", "@linaria"],
  plugins: ["@babel/plugin-transform-runtime", "@loadable/babel-plugin"],
});
