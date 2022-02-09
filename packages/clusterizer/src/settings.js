import { cpus } from "os";

const DEFAULT_KILL_SIGNAL = "SIGINT";
const DEFAULT_MAX_INSTANCES = cpus().length;
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

  // POOL related settings
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

  // WATCHER related settings
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
  config.logs = !!(options.logs ?? true);
  config.logs = {
    poolState: options.logs?.poolState ?? config.logs,
    workerState: options.logs?.workerState ?? config.logs,
    workerOut: options.logs?.workerOut ?? config.logs,
    workerErr: options.logs?.workerErr ?? config.logs,
    watcherState: options.logs?.watcherState ?? config.logs,
    watcherUpdate: options.logs?.watcherUpdate ?? config.logs,
    prefixWorkerOut: options.logs?.prefixWorkerOut ?? config.logs,
    prefixWorkerErr: options.logs?.prefixWorkerErr ?? config.logs,
  };

  return config;
};

export default createSettings;
