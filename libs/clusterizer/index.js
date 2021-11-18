#!/usr/bin/env node
import { readFile } from "fs/promises";
import path from "path";
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
const execFallback = path.join(
  process.cwd(),
  JSON.parse(
    await readFile(`${path.join(process.cwd(), "./package.json")}`).catch(
      () => "{}",
    ),
  ).main ?? "index.js",
);

// create settings from config
const settingsList = configList.map((config, key) => ({
  name: `Pool ${key + 1}`,
  ...createSettings({
    exec: execFallback,
    ...config,
  }),
}));

if ((process.env.NODE_ENV ?? "development") === "development") {
  // eslint-disable-next-line no-console
  console.log("Starting clusterizer with settings:", settingsList, "\n");
}

// Create and start clusterizers
const clusterizerList = settingsList.map((settings) => {
  const pool = createPool();
  let watcher;

  pool.start(settings);
  if (settings.watch.length) {
    watcher = createWatcher(() => {
      pool.reload();
    }, settings);
    watcher.start();
  }

  return { pool, watcher, settings };
});

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
  await Promise.all(
    clusterizerList.map(({ pool, watcher }) =>
      Promise.all([pool.stop(), watcher && watcher.stop()]),
    ),
  );

  process.exit(0);
});
