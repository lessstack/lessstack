import createFork, { STATES as FORK_STATES } from "./fork.js";

export const STATES = {
  STOPPED: "STOPPED",
  STARTED: "STARTED",
  STOPPING: "STOPPING",
  RELOADING: "RELOADING",
  READY: "READY",
};

const removeArrayItem = (array, item) => {
  const index = array.indexOf(item);
  return [...array.slice(0, index), ...array.slice(index + 1)];
};

const createPool = () => {
  let instances = [];
  let obsoleteInstances = [];
  let listeners = [];
  let state = STATES.STOPPED;
  let settings = {};
  let failures = 0;

  const listen = (callback) => {
    if (listeners.includes(callback)) {
      throw new Error("Trying to add the same listener multiple times");
    }
    listeners = listeners.concat(callback);

    return () => {
      if (!listeners.includes(callback)) {
        throw new Error("Trying to remove an unknown listener");
      }

      listeners = removeArrayItem(listeners, callback);
    };
  };

  const setState = (newState, data) => {
    state = newState;
    settings.logger?.info({
      category: "pool",
      state,
      data,
    });
    listeners.forEach((listener) => listener(newState, data));
  };

  const updateInstances = () => {
    if (!settings.maxFailures || failures <= settings.maxFailures) {
      const readyInstances = instances.filter(
        (instance) => instance.state === FORK_STATES.READY,
      );
      const readyStoppableCount = readyInstances.length - settings.minInstances;

      // stop obsolete started instances if minInstances is reached
      if (readyStoppableCount >= 0) {
        instances.forEach((instance) => {
          if (
            obsoleteInstances.includes(instance) &&
            instance.state === FORK_STATES.STARTED
          ) {
            instance.fork.stop();
          }
        });
      }

      // start idle instances
      instances.forEach((instance) => {
        if (
          instance.state === FORK_STATES.STOPPED ||
          instance.state === FORK_STATES.FAILED
        ) {
          obsoleteInstances = removeArrayItem(obsoleteInstances, instance);
          instances = removeArrayItem(instances, instance).concat(instance);
          instance.fork.start(settings);
        }
      });

      // stop obsolete ready instances if minInstances is exceeded
      if (readyStoppableCount > 0) {
        readyInstances
          .filter((instance) => obsoleteInstances.includes(instance))
          .slice(0, readyStoppableCount)
          .forEach((instance) => instance.fork.stop());
      }
    }
  };

  const forgetInstance = (instance) => {
    if (!instances.includes(instance)) {
      throw new Error("Trying to forget an unknown instance");
    }

    instances = removeArrayItem(instances, instance);
  };

  const startNewInstance = () => {
    const instance = { fork: createFork(), state };

    instance.fork.listen((forkState) => {
      instance.state = forkState;
      switch (instance.state) {
        case FORK_STATES.FAILED:
        case FORK_STATES.STOPPED: {
          const hasFailed = instance.state === FORK_STATES.FAILED;
          // up to date fork failed
          if (!obsoleteInstances.includes(instance) && hasFailed) {
            failures += 1;
          }

          switch (state) {
            case STATES.RELOADING:
              if (instances.length > settings.maxInstances) {
                forgetInstance(instance);
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
              forgetInstance(instance);
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
              (poolInstance) =>
                poolInstance.state !== FORK_STATES.READY ||
                obsoleteInstances.includes(poolInstance),
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

    instances = instances.concat(instance);
    instance.fork.start(settings);

    return instance;
  };

  const start = async (newSettings) => {
    switch (state) {
      case STATES.STOPPED: {
        failures = 0;
        settings = newSettings;
        setState(STATES.STARTED);

        const output = new Promise((resolve) => {
          const removeListener = listen((newState) => {
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
          const removeListener = listen((newState) => {
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
          switch (instance.state) {
            case FORK_STATES.STARTED:
            case FORK_STATES.READY:
              instance.fork.stop();
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
          const removeListener = listen((newState) => {
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

  return {
    start,
    stop,
    reload,
    listen,
  };
};

export default createPool;
