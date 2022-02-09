#!/usr/bin/env node
import { createRequire } from "module";
import path from "path";
import { createPoolLogger, createWatcherLogger } from "./src/logger.js";
import createPool from "./src/pool.js";
import createSettings from "./src/settings.js";
import createWatcher from "./src/watcher.js";

const resolveImport = async (basePath, extensions) => {
  try {
    return await import(`${basePath}${extensions[0]}`);
  } catch (e) {
    if (extensions.length > 1) {
      return resolveImport(basePath, extensions.slice(1));
    }
    throw new Error(`Could not resolve ${basePath}`);
  }
};

// Locate and import config file
let configList;
try {
  configList = [].concat(
    await resolveImport(path.join(process.cwd(), "./clusterizer.config"), [
      ".js",
      ".cjs",
      ".mjs",
      ".json",
    ]).then((result) => result.default),
  );
} catch (e) {
  configList = [{}];
}

// package's main or index.js as config.exec fallback
const execFallback = createRequire(process.cwd()).resolve(process.cwd());

// create settings from config
const settingsList = configList.map((config, key) => ({
  name: `pool-${key + 1}`,
  ...createSettings({
    exec: execFallback,
    ...config,
  }),
}));

if ((process.env.NODE_ENV ?? "development") === "development") {
  // eslint-disable-next-line no-console
  console.log("Starting clusterizer with settings:", settingsList);
}

// Create and start clusterizers
const clusterizerList = settingsList.map((settings) => {
  const pool = createPool(process);
  let watcher;

  createPoolLogger(pool);
  pool.start(settings);
  if (settings.watch.length) {
    watcher = createWatcher(() => {
      pool.reload();
    }, settings);
    createWatcherLogger(pool, watcher);
    watcher.start();
  }

  return { pool, watcher, settings };
});

const stop = async () => {
  await Promise.all(
    clusterizerList.map(({ pool, watcher }) =>
      Promise.all([pool.stop(), watcher && watcher.stop()]),
    ),
  );

  process.exit(0);
};

// Reload clusterizers pool using stdin data
process.stdin.resume();
process.stdin.setEncoding("utf-8");
process.stdin.on("data", (input) => {
  const data = input.trim();
  clusterizerList.forEach((clusterizer) => {
    if (data === clusterizer.settings.reloadStdinData) {
      clusterizer.pool.reload();
    }
  });
});

// Stop clusterizers on SIGINT
process.on("SIGINT", async () => {
  process.stdout.write("\n");
  await stop();
});
