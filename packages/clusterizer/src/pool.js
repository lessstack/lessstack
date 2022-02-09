import createEventEmitter from "./eventEmitter.js";
import createFork, { STATES as FORK_STATES } from "./fork.js";

export const STATES = {
  STOPPED: "STOPPED",
  STARTED: "STARTED",
  STOPPING: "STOPPING",
  RELOADING: "RELOADING",
  FAILED: "FAILED",
  READY: "READY",
};

const removeArrayItem = (array, item) => {
  const index = array.indexOf(item);
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

const createPool = () => {
  let instances = [];
  let obsoleteInstances = [];
  let state = STATES.STOPPED;
  let settings = {};
  let failures = 0;
  const emitter = createEventEmitter();

  const setState = (newState, data) => {
    state = newState;
    emitter.emit("state", { state, data });
  };

  const updateInstances = () => {
    if (!settings.maxFailures || failures <= settings.maxFailures) {
      const readyInstances = instances.filter(
        (instance) => instance.getState() === FORK_STATES.READY,
      );
      const readyStoppableCount = readyInstances.length - settings.minInstances;

      // stop obsolete started instances if minInstances is reached
      if (readyStoppableCount >= 0) {
        instances.forEach((instance) => {
          if (
            obsoleteInstances.includes(instance) &&
            instance.getState() === FORK_STATES.STARTED
          ) {
            instance.stop();
          }
        });
      }

      // start idle instances
      instances.forEach((instance) => {
        const forkState = instance.getState();
        if (
          forkState === FORK_STATES.STOPPED ||
          forkState === FORK_STATES.FAILED
        ) {
          obsoleteInstances = removeArrayItem(obsoleteInstances, instance);
          instances = removeArrayItem(instances, instance).concat(instance);
          instance.start(settings);
        }
      });

      // stop obsolete ready instances if minInstances is exceeded
      if (readyStoppableCount > 0) {
        readyInstances
          .filter((instance) => obsoleteInstances.includes(instance))
          .slice(0, readyStoppableCount)
          .forEach((instance) => instance.stop());
      }
    } else if (
      !instances.find((instance) => instance.getState() !== FORK_STATES.FAILED)
    ) {
      setState(STATES.FAILED);
    }
  };

  const forgetInstance = (instance) => {
    if (!instances.includes(instance)) {
      throw new Error("Trying to forget an unknown instance");
    }

    instances = removeArrayItem(instances, instance);
  };

  const startNewInstance = () => {
    const newInstance = createFork();
    newInstance.on("state", ({ state: forkState }) => {
      switch (forkState) {
        case FORK_STATES.FAILED:
        case FORK_STATES.STOPPED: {
          const hasFailed = forkState === FORK_STATES.FAILED;
          // up to date fork failed
          if (!obsoleteInstances.includes(newInstance) && hasFailed) {
            failures += 1;
          }

          switch (state) {
            case STATES.RELOADING:
              if (instances.length > settings.maxInstances) {
                forgetInstance(newInstance);
              } else {
                updateInstances();
              }
              break;
            case STATES.STARTED:
            case STATES.READY:
              if (hasFailed) {
                updateInstances();
              }
              break;
            case STATES.STOPPING:
              forgetInstance(newInstance);
              if (!instances.length) {
                setState(STATES.STOPPED);
              }
              break;
            default:
              break;
          }
          break;
        }
        case FORK_STATES.READY: {
          // all forks ready and up to date
          if (
            !instances.some(
              (instance) =>
                instance.getState() !== FORK_STATES.READY ||
                obsoleteInstances.includes(instance),
            )
          ) {
            setState(STATES.READY);
          } else {
            updateInstances();
          }
          break;
        }
        default:
      }
    });

    emitter.emit("instance", { instance: newInstance });

    instances = instances.concat(newInstance);
    newInstance.start(settings);

    return newInstance;
  };

  const start = async (newSettings) => {
    switch (state) {
      case STATES.FAILED:
      case STATES.STOPPED: {
        failures = 0;
        settings = newSettings;
        setState(STATES.STARTED, newSettings);

        const output = new Promise((resolve) => {
          const removeListener = emitter.on("state", ({ state: newState }) => {
            removeListener();
            switch (newState) {
              case STATES.READY: {
                resolve(true);
                break;
              }
              default: {
                resolve(false);
              }
            }
          });
        });

        for (let i = 0; i < settings.maxInstances; i += 1) {
          startNewInstance();
        }

        return output;
      }
      default: {
        throw new Error(`Trying to start pool in "${state}" state`);
      }
    }
  };

  const stop = async () => {
    switch (state) {
      case STATES.STARTED:
      case STATES.READY:
      case STATES.RELOADING: {
        setState(STATES.STOPPING);
        const output = new Promise((resolve) => {
          const removeListener = emitter.on("state", ({ state: newState }) => {
            removeListener();
            switch (newState) {
              case STATES.STOPPED: {
                resolve(true);
                break;
              }
              default: {
                resolve(false);
              }
            }
          });
        });

        instances.forEach((instance) => {
          switch (instance.getState()) {
            case FORK_STATES.STARTED:
            case FORK_STATES.READY:
              instance.stop();
              break;
            default:
              break;
          }
        });

        return output;
      }
      default: {
        throw new Error(`Trying to stop pool in "${state}" state`);
      }
    }
  };

  const reload = (newSettings) => {
    switch (state) {
      case STATES.FAILED:
      case STATES.STARTED:
      case STATES.RELOADING:
      case STATES.READY: {
        failures = 0;
        settings = newSettings ?? settings;
        setState(STATES.RELOADING, settings);
        obsoleteInstances = instances;

        const missingInstances = Math.max(
          0,
          settings.maxInstances - instances.length,
        );
        const output = new Promise((resolve) => {
          const removeListener = emitter.on("state", ({ state: newState }) => {
            removeListener();
            switch (newState) {
              case STATES.READY: {
                resolve(true);
                break;
              }
              default: {
                resolve(false);
              }
            }
          });
        });

        for (let i = 0; i < missingInstances; i += 1) {
          startNewInstance();
        }

        updateInstances();

        return output;
      }
      default: {
        throw new Error(`Trying to reload pool in "${state}" state`);
      }
    }
  };

  const getName = () => settings.name;

  return {
    start,
    stop,
    reload,
    getName,
    ...emitter,
  };
};

export default createPool;
