import path from "path";

import webpack from "webpack";
import { WebpackPluginServe } from "webpack-plugin-serve";
import WebpackLoadablePlugin from "@loadable/webpack-plugin";
import WebpackMiniCssExtractPlugin from "mini-css-extract-plugin";
import WebpackReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import BundleAsFunction from "./BundleAsFunction";

export type WebpackArgv = {
  env: {
    WEBPACK_WATCH?: boolean;
  };
  mode: "development" | "production";
  watch: boolean;
};

const isEnabled = <T = unknown>(value: unknown): value is Exclude<T, false> =>
  value !== false;

export const createTargetConfig = ({
  buildPath,
  entry,
  env,
  mode = "development",
  target = "browser",
  watch = false,
}: WebpackArgv & {
  buildPath: string;
  entry: string;
  target: "browser" | "node";
}): webpack.Configuration => {
  const isBrowser = target === "browser";
  const isDevelopment = mode === "development";
  const isHot = watch && isBrowser;

  const outputPath = isBrowser ? path.join(buildPath, "browser") : buildPath;
  const statsPath = path.join(buildPath, `${target}.stats.json`);

  return {
    devtool:
      (!isBrowser && "source-map") ||
      (isDevelopment && "eval-cheap-module-source-map"),
    entry: [
      !isBrowser && require.resolve("source-map-support/register"),
      require.resolve("./runtime"),
      isHot && require.resolve("webpack-plugin-serve/client"),
      entry,
    ].filter<string>(isEnabled),
    mode,
    module: {
      rules: [
        {
          exclude: {
            and: [/node_modules/],
          },
          test: /\.[cm]?tsx?$/,
          use: [
            {
              loader: require.resolve("babel-loader"),
              options: {
                plugins: [
                  "@babel/plugin-transform-runtime",
                  "@loadable/babel-plugin",
                ],
                presets: ["@babel/preset-env", "@babel/preset-typescript"],
              },
            },
            {
              loader: require.resolve("ts-loader"),
              options: {
                compilerOptions: isBrowser
                  ? {
                      declaration: false,
                      declarationMap: false,
                      outDir: outputPath,
                    }
                  : {
                      declaration: true,
                      outDir: outputPath,
                    },
              },
            },
          ],
        },
        // {
        //   exclude: {
        //     and: [/node_modules/],
        //   },
        //   test: /\.[cm]?jsx?$/,
        //   use: [
        //     {
        //       loader: require.resolve("babel-loader"),
        //       options: {
        //         plugins: [
        //           "@babel/plugin-transform-runtime",
        //           "@loadable/babel-plugin",
        //         ],
        //         presets: [
        //           "@babel/preset-env",
        //           ["@babel/preset-react", { runtime: "automatic" }],
        //         ],
        //       },
        //     },
        //   ],
        // },
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
              loader: require.resolve("css-loader"),
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        {
          generator: {
            emit: isBrowser,
          },
          test: /\.(svg|jpg|gif|png|eot|svg|ttf|woff|woff2)$/,
          type: "asset/resource",
        },
      ],
    },
    name: target,
    optimization: !isBrowser
      ? {}
      : {
          moduleIds: "deterministic",
          runtimeChunk: isHot ? "single" : { name: "vendors" },
          splitChunks: {
            cacheGroups: {
              vendors: {
                name: "vendors",
                test: /[\\/]node_modules[\\/]/,
              },
            },
            chunks: "all",
            minSize: 0,
          },
        },
    output: {
      clean: isBrowser,
      filename: isBrowser ? "[name].[contenthash].js" : "node.js",
      library: { type: "umd" },
      path: outputPath,
    },
    plugins: [
      !isBrowser && new BundleAsFunction(),
      !isBrowser &&
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              ["svgo"],
            ],
          },
        },
      }),
      new WebpackMiniCssExtractPlugin({
        filename: isHot ? "[name].css" : "[name].[contenthash].css",
      }),
      new webpack.DefinePlugin({
        __LESSSTACK_BUILD_PROPS__: JSON.stringify({
          publicPath: "./browser",
          statsPath: `./browser.stats.json`,
        }),
      }),
      new WebpackLoadablePlugin({
        filename: path.relative(outputPath, statsPath),
      }),
      isHot &&
        new WebpackPluginServe({
          client: {
            address: "localhost:44444",
          },
          hmr: true,
          port: 44444,
          status: false,
        }),
      isHot && new WebpackReactRefreshPlugin(),
    ].filter<webpack.WebpackPluginInstance>(isEnabled),
    resolve: {
      extensionAlias: {
        ".cjs": [".cts", ".cjs"],
        ".js": [".ts", ".js"],
        ".mjs": [".mts", ".mjs"],
      },
      extensions: [".ts", ".tsx", ".js", ".jsx", "..."],
    },
    stats: {
      assetsSpace: 15,
      groupAssetsByExtension: true,
      preset: "minimal",
    },
    target: isBrowser ? "web" : "node",
    watch: typeof env.WEBPACK_WATCH === "boolean" ? undefined : watch,
  };
};

export const createConfig = ({
  srcPath = "src",
  buildPath = "build",
  entries = {},
}: {
  buildPath?: string;
  entries?: {
    browser?: string;
    node?: string;
  };
  srcPath?: string;
} = {}) => {
  const cwd = process.cwd();
  const srcResolvedPath = path.resolve(cwd, srcPath);
  const buildResolvedPath = path.resolve(cwd, buildPath);
  const nodeEntry = path.resolve(srcResolvedPath, entries.node ?? `node`);
  const browserEntry = path.resolve(
    srcResolvedPath,
    entries.browser ?? `browser`,
  );

  return (
    _: unknown,
    { env, mode, watch }: WebpackArgv,
  ): webpack.Configuration[] => [
    createTargetConfig({
      buildPath: buildResolvedPath,
      entry: browserEntry,
      env,
      mode,
      target: "browser",
      watch,
    }),
    createTargetConfig({
      buildPath: buildResolvedPath,
      entry: nodeEntry,
      env,
      mode,
      target: "node",
      watch,
    }),
  ];
};

export default createConfig();