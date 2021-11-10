import path from "path";
import webpack from "webpack";
import { WebpackPluginServe } from "webpack-plugin-serve";
import WebpackLoadablePlugin from "@loadable/webpack-plugin";
import WebpackMiniCssExtractPlugin from "mini-css-extract-plugin";
import WebpackReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";

export const createConfig = ({
  // "browser" | "node" = "browser"
  target = "browser",
  // "development" | "production" = "development"
  mode = "development",
  // false | true = false
  watch = false,
  env,
}) => {
  const isBrowser = target === "browser";
  const isDevelopment = mode === "development";
  const isHot = watch && isBrowser;

  const buildPath = path.join(process.cwd(), "build");
  const outputPath = path.join(buildPath, target);
  const publicPath = path.join(buildPath, "browser");
  const statsPath = path.join(buildPath, `${target}-stats.json`);
  const babelOptions = {
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: [
      "@babel/plugin-transform-runtime",
      "@loadable/babel-plugin",
      isHot && "react-refresh/babel",
    ].filter(Boolean),
  };

  return {
    name: target,
    target: isBrowser ? "web" : "node",
    mode,
    watch: typeof env.WEBPACK_WATCH === "boolean" ? null : watch,

    devtool:
      (!isBrowser && "source-map") ||
      (isDevelopment && "eval-cheap-module-source-map"),

    resolve: {
      alias: {
        "@witb/config-webpack/alias/client": path.join(
          process.cwd(),
          "src",
          `${target}.js`,
        ),
      },
    },

    entry: [
      !isBrowser && "source-map-support/register",
      isHot && "webpack-plugin-serve/client",
      path.join(path.dirname(import.meta.url), "entries", `${target}.js`),
    ].filter(Boolean),
    output: {
      path: outputPath,
      library: { type: "umd" },
      filename: isBrowser ? "[name].[contenthash].js" : "[name].js",
      clean: true,
    },
    optimization: !isBrowser
      ? {}
      : {
          moduleIds: "deterministic",
          runtimeChunk: isHot ? "single" : { name: "vendors" },
          splitChunks: {
            chunks: "all",
            minSize: 0,
            cacheGroups: {
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendors",
              },
            },
          },
        },

    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: babelOptions,
            },
            {
              loader: "@linaria/webpack-loader",
              options: {
                sourceMap: true,
                babelOptions,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: WebpackMiniCssExtractPlugin.loader,
              options: {
                emit: isBrowser,
              },
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      !isBrowser &&
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
      new WebpackMiniCssExtractPlugin({
        filename: isHot ? "[name].css" : "[name].[contenthash].css",
      }),
      !isBrowser &&
        new webpack.DefinePlugin({
          __WITB__: JSON.stringify({
            publicPath,
            statsPath: path.join(buildPath, `browser-stats.json`),
          }),
        }),
      new WebpackLoadablePlugin({
        filename: path.relative(outputPath, statsPath),
      }),
      isHot &&
        new WebpackPluginServe({
          status: false,
          hmr: true,
          port: 44444,
          client: {
            address: "localhost:44444",
          },
        }),
      isHot && new WebpackReactRefreshPlugin(),
    ].filter(Boolean),
  };
};

export const createConfigList = ({ env, mode, watch }) => [
  createConfig({ target: "browser", env, mode, watch }),
  createConfig({ target: "node", env, mode, watch }),
];

export default (_, { env, mode, watch }) =>
  createConfigList({ env, mode, watch });
