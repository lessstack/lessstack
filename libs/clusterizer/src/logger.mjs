import { STATES as FORK_STATES } from "./fork.mjs";
import { STATES as POOL_STATES } from "./pool.mjs";
import { STATES as WATCHER_STATES } from "./watcher.mjs";

const PADDED_STATES_NAMES = {
  [FORK_STATES.STOPPED]: "STOPPED  ",
  [FORK_STATES.STARTED]: "STARTED  ",
  [FORK_STATES.READY]: "READY    ",
  [FORK_STATES.STOPPING]: "STOPPING ",
  [FORK_STATES.FAILED]: "FAILED   ",
  [POOL_STATES.STOPPED]: "STOPPED  ",
  [POOL_STATES.STARTED]: "STARTED  ",
  [POOL_STATES.STOPPING]: "STOPPING ",
  [POOL_STATES.RELOADING]: "RELOADING",
  [POOL_STATES.READY]: "READY    ",
  [WATCHER_STATES.STOPPED]: "STOPPED  ",
  [WATCHER_STATES.FAILED]: "FAILED   ",
  [WATCHER_STATES.WATCHING]: "WATCHING ",
  [WATCHER_STATES.STOPPING]: "STOPPING ",
};
const WATCHER_RELOAD_PADDED_NAME = "RELOAD   ";

const { log: info } = console;

const format = (category, state) =>
  `${category}  |  ${PADDED_STATES_NAMES[state] || state}  |  `;

const logger = {
  info: ({ category, state, worker, data }) => {
    switch (category) {
      case "pool":
        info(format("📦  POOL   ", state));
        break;
      case "fork":
        info(format(`📂  FORK   `, state), worker.process.pid);
        break;
      case "watcher":
        if (data?.updates) {
          info(format(`🔎  WATCHER`, WATCHER_RELOAD_PADDED_NAME));
          data.updates.map((file) => info(`   - ${file}`));
        } else {
          info(format(`🔎  WATCHER`, state));
        }
        break;
      default:
        break;
    }
  },
};

export default logger;
