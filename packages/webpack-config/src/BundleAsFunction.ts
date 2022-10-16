import { Asset, Compilation, Compiler, sources } from "webpack";

export default class BundleAsFunction {
  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap("BundleAsFunction", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "BundleAsFunction",
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        () => {
          const asset = compilation.getAsset("node.js");

          if (!asset) {
            return;
          }

          compilation.updateAsset(
            "node.js",
            new sources.ConcatSource(
              `\
module.exports = ({
  publicRoute,
} = {}) => {
  var module = {...module, exports: {} };
  var exports = module.exports;
  var __LESSSTACK_RUNTIME_PROPS__ = {
    webpackPublicPath: publicRoute,
  };
`,
              asset.source,
              `
  ;return module.exports;
};
`,
            ),
          );
        },
      );

      compilation.hooks.processAssets.tap(
        {
          name: "BundleAsFunction",
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
        },
        () => {
          const asset = compilation.getAsset("node.d.ts");

          if (!asset) {
            return;
          }

          const source = asset.source.source().toString();
          const defaultExport = source.match(
            /^export default ([a-zA-Z0-9_]+);?/m,
          )?.[1];

          compilation.updateAsset(
            "node.d.ts",
            new sources.ConcatSource(
              "declare const createBundle: (options?: { publicRoute: string }) => {\n",
              (defaultExport
                ? source
                    .replace(
                      new RegExp(`^export default ${defaultExport};?`, "m"),
                      "",
                    )
                    .replace(
                      new RegExp(`^declare const ${defaultExport}`, "m"),
                      "default",
                    )
                : source
              )
                .replace(/^export declare const /gm, "")
                .replace(/= /g, ": ")
                .replace(
                  /^(\/\/# sourceMappingURL=node.d.ts.map\s*)$/gm,
                  ` };
export default createBundle;
$1`,
                ),
            ),
          );
        },
      );
    });
  }
}
