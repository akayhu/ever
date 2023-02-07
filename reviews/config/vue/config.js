const args = require("minimist")(process.argv.slice(2));
const workspace = args.workspace || "dev";

const config = {
  env: {
    nodeEnv: process.env.NODE_ENV,
    current: process.env.VUE_APP_ENV,
    domailUrl: process.env.VUE_APP_DOMAIN_URL,
    staticUrl: process.env.VUE_APP_STATIC_URL,
    apiDomailUrl: process.env.VUE_APP_API_DOMAIN_URL
  },
  port: process.env.VUE_APP_PORT || 8787,
  workspace: {
    current: workspace
  }
};

module.exports = config;
