import { STATES as FORK_STATES } from "./fork.js";
import { STATES as POOL_STATES } from "./pool.js";
import { STATES as WATCHER_STATES } from "./watcher.js";

const INSTANCE_STATE_COLORS = {
  [FORK_STATES.STOPPED]: "\x1b[33m",
  [FORK_STATES.STARTED]: "\x1b[36m",
  [FORK_STATES.READY]: "\x1b[32m",
  [FORK_STATES.STOPPING]: "",
  [FORK_STATES.FAILED]: "\x1b[31m",
};
const POOL_STATE_COLORS = {
  [POOL_STATES.STOPPED]: "\x1b[33m",
  [POOL_STATES.STARTED]: "\x1b[36m",
  [POOL_STATES.STOPPING]: "",
  [POOL_STATES.RELOADING]: "\x1b[36m",
  [POOL_STATES.READY]: "\x1b[32m",
  [POOL_STATES.FAILED]: "\x1b[31m",
};
const WATCHER_STATE_COLORS = {
  [WATCHER_STATES.STOPPED]: "\x1b[33m",
  [WATCHER_STATES.FAILED]: "\x1b[31m",
  [WATCHER_STATES.WATCHING]: "\x1b[32m",
  [WATCHER_STATES.STOPPING]: "",
};

const MODIFIERS = {
  bold: "1m",
  dim: "2m",
  cursive: "3m",
  underline: "4m",
  blink: "5m",
  reversed: "7m",
  hidden: "8m",
};

/* eslint-disable no-control-regex */
const REGEX = new RegExp(
  `(?:${[
    ...Object.entries(MODIFIERS).map(
      ([modifier, code]) => `(?<${modifier}>${/\x1b\[/.source}${code}})`,
    ),
    `(?<reset>${/\x1b\[0m/.source})`,
    `(?<foreground>${
      /\x1b\[(3[0-7](?:;1)?|38;5;(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))m/
        .source
    })`,
    `(?<background>${
      /\x1b\[(4[0-7](?:;1)?|38;5;(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))m/
        .source
    })`,
  ].join("|")})`,
  "g",
);
/* eslint-enable no-control-regex */

const getNoStyles = () => ({
  ...Object.keys(MODIFIERS).reduce((acc, name) => {
    acc[name] = false;
    return acc;
  }, {}),
  foreground: null,
  background: null,
});

const getNextStyles = (input, styles) => {
  const exec = () => REGEX.exec(input);
  let nextStyles = { ...styles };
  REGEX.lastIndex = 0;

  for (let res = exec(); res; res = exec()) {
    const modifier = Object.keys(MODIFIERS).find((name) => res.groups[name]);
    if (modifier) {
      nextStyles[modifier] = true;
    } else if (res.groups.foreground) {
      nextStyles.foreground = res.groups.foreground;
    } else if (res.groups.background) {
      nextStyles.background = res.groups.background;
    } else if (res.groups.reset) {
      nextStyles = getNoStyles();
    }
  }

  return nextStyles;
};

const getStylesCodes = (styles) => {
  let codes = "";

  Object.entries(MODIFIERS).forEach(([modifier, code]) => {
    if (styles[modifier]) {
      codes += `\x1b[${code}`;
    }
  });
  if (styles.background) {
    codes += styles.background;
  }
  if (styles.foreground) {
    codes += styles.foreground;
  }

  return codes;
};

export const createCanal = (target = process) => {
  let styles = getNoStyles();
  return {
    stdout: (data) => {
      target.stdout.write("\x1b[0m");
      const codes = getStylesCodes(styles);
      styles = getNextStyles(data, styles);
      target.stdout.write(codes);
      target.stdout.write(data);
      target.stdout.write("\x1b[0m");
    },
    stderr: (data) => {
      const codes = getStylesCodes(styles);
      styles = getNextStyles(data, styles);
      target.stderr.write("\x1b[0m");
      target.stderr.write(codes);
      target.stderr.write(data);
      target.stderr.write("\x1b[0m");
    },
  };
};

let maxPidLength = Math.max(`${process.pid}`.length, "watcher".length);
const getTimePrefix = () =>
  `\x1b[2m${new Date().toISOString().replace(/[ZT]/g, " ")}\x1b[0m`;
const getPoolPrefix = (pool) =>
  `${getTimePrefix()}\x1b[36m${pool.getName()}\x1b[0m ${" ".repeat(
    maxPidLength,
  )}  `;
const getInstancePrefix = (pool, worker) =>
  `${getTimePrefix()}\x1b[36m${pool.getName()}\x1b[0m:\x1b[33m${
    worker.process.pid
  }${" ".repeat(maxPidLength - `${worker.process.pid}`.length)}\x1b[0m   `;
const getWatcherPrefix = (pool) =>
  `${getTimePrefix()}\x1b[36m${pool.getName()}\x1b[0m:\x1b[34mwatcher\x1b[0m   `;

export const createInstanceLogger = (
  pool,
  instance,
  settings,
  target = process,
) => {
  let instanceCanal;

  instance.prepend("state", ({ state, worker }) => {
    if (state === "STARTED") {
      instanceCanal = createCanal(target);
      maxPidLength = Math.max(maxPidLength, `${worker.process.pid}`.length);
    }
    if (settings.logs.workerState) {
      target.stdout.write(getInstancePrefix(pool, worker));
      target.stdout.write(`${INSTANCE_STATE_COLORS[state]}${state}\x1b[0m\n`);
    }
  });

  if (settings.logs.workerOut) {
    instance.on("stdout", ({ data, worker }) => {
      `${data}`.split(/\n/g).forEach((line, key, lines) => {
        if (line || key < lines.length - 1) {
          if (settings.logs.prefixWorkerOut) {
            target.stdout.write(getInstancePrefix(pool, worker));
          }
          instanceCanal.stdout(line);
        }
        if (key < lines.length - 1) {
          instanceCanal.stdout("\n");
        }
      });
    });
  }

  if (settings.logs.workerErr) {
    instance.on("stderr", ({ data, worker }) => {
      `${data}`.split(/\n/g).forEach((line, key, lines) => {
        if (line || key < lines.length - 1) {
          if (settings.logs.prefixWorkerErr) {
            target.stdout.write(getInstancePrefix(pool, worker));
          }
          instanceCanal.stderr(line);
        }
        if (key < lines.length - 1) {
          instanceCanal.stderr("\n");
        }
      });
    });
  }
};

export const createPoolLogger = (pool, settings, target = process) => {
  if (settings.logs.poolState) {
    pool.on("state", ({ state }) => {
      target.stdout.write(getPoolPrefix(pool, maxPidLength));
      target.stdout.write(
        `\x1b[7m${POOL_STATE_COLORS[state]} ${state} \x1b[0m\n`,
      );
    });
  }

  if (
    settings.logs.workerState ||
    settings.logs.workerOut ||
    settings.logs.workerErr
  ) {
    pool.on("instance", ({ instance }) =>
      createInstanceLogger(pool, instance, settings, target),
    );
  }
};

export const createWatcherLogger = (
  pool,
  watcher,
  settings,
  target = process,
) => {
  if (settings.logs.watcherState) {
    watcher.on("state", ({ state }) => {
      target.stdout.write(getWatcherPrefix(pool, maxPidLength));
      target.stdout.write(`${WATCHER_STATE_COLORS[state]}${state}\x1b[0m\n`);
    });
  }
  if (settings.logs.watcherUpdate) {
    watcher.on("update", ({ updates }) => {
      const prefix = getWatcherPrefix(pool, maxPidLength);

      target.stdout.write(prefix);
      target.stdout.write(`reloaded by:\n`);

      updates.forEach((path) => {
        target.stdout.write(prefix);
        target.stdout.write(`- ${path}\n`);
      });
    });
  }
};
