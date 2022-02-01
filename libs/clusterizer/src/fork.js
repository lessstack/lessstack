import cluster from "cluster";

export const STATES = {
  STOPPED: "STOPPED",
  STARTED: "STARTED",
  READY: "READY",
  STOPPING: "STOPPING",
  FAILED: "FAILED",
};

const createFork = () => {
  const listeners = [];
  let state = STATES.STOPPED;
  let worker = null;
  let settings = {};

  const setState = (newState, data) => {
    state = newState;
    settings.logger?.info({
      category: "fork",
      state,
      worker,
      data,
    });
    listeners.forEach((listener) => listener(newState, data));
  };

  const getState = () => state;

  const setup = cluster.setupPrimary || cluster.setupMaster;

  const ready = (context) => {
    switch (state) {
      case STATES.STARTED: {
        setState(STATES.READY, context);
        break;
      }
      default:
    }
  };

  const stop = (context) => {
    switch (state) {
      case STATES.STARTED:
      case STATES.READY: {
        setState(STATES.STOPPING, context);
        worker.kill(settings.killSignal);
        break;
      }
      default:
        throw new Error(`Trying to kill a fork with "${state}" state`);
    }
  };

  const start = (newSettings, context) => {
    settings = newSettings;
    switch (state) {
      case STATES.STOPPED:
      case STATES.FAILED: {
        const previousSettings = cluster.settings;
        setup({
          args: settings.args,
          exec: settings.exec,
          execArgv: settings.execArgv,
        });
        worker = cluster.fork(settings.env);
        setup(previousSettings);
        setState(STATES.STARTED, context);

        worker.on("exit", (code, signal) => {
          setState(code ? STATES.FAILED : STATES.STOPPED, { code, signal });
        });

        if (settings.readyMessage) {
          worker.on("message", (message) => {
            if (message === settings.readyMessage) {
              ready({ trigger: "message", message });
            }
          });
        }

        if (settings.readyTimeout) {
          setTimeout(() => {
            ready({ trigger: "timeout", delay: settings.readyTimeout });
          }, settings.readyTimeout);
        }

        if (settings.readyWhenOnline) {
          worker.on("online", () => {
            ready({ trigger: "online" });
          });
        }
        break;
      }
      default:
        throw new Error(`Trying to start a fork with "${state}" state`);
    }
  };

  const listen = (callback) => {
    if (listeners.includes(callback)) {
      throw new Error("Trying to add the same listener multiple times");
    }
    listeners.push(callback);

    return () => {
      if (!listeners.includes(callback)) {
        throw new Error("Trying to remove an unknown listener");
      }
      listeners.splice(listeners.indexOf(callback), 1);
    };
  };

  return {
    stop,
    start,
    listen,
    getState,
  };
};

export default createFork;
