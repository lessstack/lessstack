const mime = require("../utils/mime");

module.exports = {
  process: (src, filename) => {
    const data = Buffer.from(src).toString("base64");
    const type = mime[filename.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1]];

    return `module.exports = ${JSON.stringify(`data:${type};base64,${data}`)}`;
  },
};
