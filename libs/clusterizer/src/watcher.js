import chokidar from "chokidar";

export const STATES = {
  STOPPED: "STOPPED",
  FAILED: "FAILED",
  WATCHING: "WATCHING",
  STOPPING: "STOPPING",
};

const defer = (cb) => {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  if (cb) {
    cb(deferred);
  }

  return deferred;
};

const createWatcher = (callback, settings) => {
  let state = STATES.STOPPED;
  let watcher;
  let deferredStop;
  let pendingPaths;
  let pendingWatchUpdate;
  let pendingMaxWatchUpdate;

  const setState = (newState) => {
    state = newState;
    settings.logger?.info({
      category: "watcher",
      state,
    });
  };

  const reload = () => {
    settings.logger?.info({
      category: "watcher",
      state,
      data: { updates: pendingPaths },
    });
    callback(pendingPaths);
    clearTimeout(pendingWatchUpdate);
    clearTimeout(pendingMaxWatchUpdate);
    pendingPaths = [];
  };

  const onWatchEvent = (path) => {
    if (!pendingPaths.includes(path)) {
      pendingPaths.push(path);
    }

    if (pendingWatchUpdate) {
      clearTimeout(pendingWatchUpdate);
    } else {
      pendingMaxWatchUpdate = setTimeout(reload, settings.watchMaxDelay);
    }

    pendingWatchUpdate = setTimeout(reload, settings.watchDelay);
  };

  return {
    start: () => {
      deferredStop?.reject();
      deferredStop = null;
      pendingPaths = [];
      watcher = chokidar.watch(settings.watch, settings.watchOptions);
      watcher
        .on("add", onWatchEvent)
        .on("change", onWatchEvent)
        .on("unlink", onWatchEvent)
        .on("addDir", onWatchEvent)
        .on("unlinkDir", onWatchEvent);

      setState(STATES.WATCHING);
    },
    stop: () => {
      deferredStop = defer(async (deferred) => {
        setState(STATES.STOPPING);
        pendingPaths = null;
        clearTimeout(pendingWatchUpdate);
        clearTimeout(pendingMaxWatchUpdate);
        try {
          await watcher.close();
          watcher = null;
          deferredStop = null;
          setState(STATES.STOPPED);
          deferred.resolve();
        } catch (error) {
          deferredStop = null;
          setState(STATES.FAILED);
          deferred.reject(error);
        }
      });
      return deferredStop.promise;
    },
  };
};

export default createWatcher;
