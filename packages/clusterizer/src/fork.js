import cluster from "cluster";
import createEventEmitter from "./eventEmitter.js";

export const STATES = {
  STOPPED: "STOPPED",
  STARTED: "STARTED",
  READY: "READY",
  STOPPING: "STOPPING",
  FAILED: "FAILED",
};

const createFork = () => {
  let state = STATES.STOPPED;
  let worker = null;
  let settings = {};
  const emitter = createEventEmitter();

  const setState = (newState, data) => {
    state = newState;
    emitter.emit("state", { worker, state, data });
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

  const stop = () => {
    switch (state) {
      case STATES.STARTED:
      case STATES.READY: {
        setState(STATES.STOPPING);
        worker.kill(settings.killSignal);
        break;
      }
      default:
        throw new Error(`Trying to kill a fork with "${state}" state`);
    }
  };

  const start = (newSettings) => {
    settings = newSettings;
    switch (state) {
      case STATES.STOPPED:
      case STATES.FAILED: {
        const previousSettings = cluster.settings;
        setup({
          args: settings.args,
          exec: settings.exec,
          execArgv: settings.execArgv,
          silent: true,
        });
        worker = cluster.fork(settings.env);
        setup(previousSettings);
        setState(STATES.STARTED);

        worker.on("exit", (code, signal) => {
          setState(code ? STATES.FAILED : STATES.STOPPED, { code, signal });
        });
        worker.on("error", () => {
          switch (state) {
            case STATES.STOPPING: {
              worker.process.kill(settings.killSignal);
              break;
            }
            default: {
              stop();
            }
          }
        });

        worker.process.stdout.on("data", (data) => {
          emitter.emit("stdout", { worker, data });
        });
        worker.process.stderr.on("data", (data) => {
          emitter.emit("stderr", { worker, data });
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

  return {
    stop,
    start,
    getState,
    ...emitter,
  };
};

export default createFork;
