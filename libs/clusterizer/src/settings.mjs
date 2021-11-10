import { cpus } from "os";
import defaultLogger from "./logger.mjs";

const DEFAULT_KILL_SIGNAL = "SIGINT";
const DEFAULT_MAX_INSTANCES = cpus().length;
const DEFAULT_RELOAD_STDIN_DATA = "reload";
const DEFAULT_WATCH_DELAY = 200;
const DEFAULT_WATCH_MAX_DELAY = 500;
const DEFAULT_WATCH_OPTIONS = { ignoreInitial: true };

const createSettings = (options) => {
  const config = {};

  // FORK related settings
  // Execution
  config.env = options.env || {};
  config.args = [].concat(options.args ?? []);
  config.exec = options.exec;
  config.execArgv = [].concat(options.execArgv ?? []);

  // Ready signal strategy
  config.readyMessage = options.readyMessage || null;
  config.readyTimeout = options.readyTimeout || null;
  config.readyWhenOnline =
    options.readyWhenOnline ?? (!config.readyMessage && !config.readyTimeout);

  // Killing
  config.killSignal = options.killSignal ?? DEFAULT_KILL_SIGNAL;

  if (!config.exec || typeof config.exec !== "string") {
    throw new Error("options.exec must be a non empty string");
  }

  // Pool related settings
  config.maxInstances = Math.max(
    1,
    options.maxInstances ?? DEFAULT_MAX_INSTANCES,
  );
  config.minInstances = Math.max(
    0,
    Math.min(
      config.maxInstances - 1,
      options.minInstances < 0
        ? config.maxInstances + options.minInstances
        : options.minInstances ?? 1,
    ),
  );
  config.maxFailures = Math.max(0, options.maxFailures ?? 1) || 0;

  // WORKER related settings
  config.watch = [].concat(options.watch || []);
  config.watchDelay = config.watch.length
    ? options.watchDelay ?? DEFAULT_WATCH_DELAY
    : null;
  config.watchMaxDelay = config.watch.length
    ? options.watchMaxDelay ?? DEFAULT_WATCH_MAX_DELAY
    : null;
  config.watchOptions = config.watch.length
    ? {
        ...DEFAULT_WATCH_OPTIONS,
        ...(options.watchOptions || {}),
      }
    : null;

  // LOGGER related settings
  config.logger =
    options.logger ||
    ((process.env.NODE_ENV ?? "development") === "development"
      ? defaultLogger
      : null);

  // CLI related settings
  switch (typeof options.reloadStdinData) {
    case "string":
    case "number":
      config.reloadStdinData = `${options.reloadStdinData}`;
      break;
    case "boolean":
      config.reloadStdinData = options.reloadStdinData
        ? DEFAULT_RELOAD_STDIN_DATA
        : options.reloadStdinData;
      break;
    default:
      config.reloadStdinData = DEFAULT_RELOAD_STDIN_DATA;
      break;
  }

  return config;
};

export default createSettings;
