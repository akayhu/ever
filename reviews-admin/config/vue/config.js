const args = require("minimist")(process.argv.slice(2));
const workspace = args.workspace || "dev";
const local = args.local || false;
const vueEnv = Object.keys(process.env)
  .filter(x => /^VUE_APP_/.test(x))
  .reduce((acc, cur, i) => ({ ...acc, [cur]: process.env[cur] }), {});

const config = {
  env: {
    current: process.env.VUE_APP_ENV,
    dev: "development",
    vagrant: "vagrant",
    lab: "lab",
    staging: "staging",
    prod: "production"
  },
  local: local,
  port: process.env.VUE_APP_PORT || 8787,
  vueEnv: vueEnv,
  workspace: {
    current: workspace,
    default: "dev",
    dev: "dev"
  }
};

module.exports = config;
