// const GitRevisionPlugin = require("git-revision-webpack-plugin");
// const gitRevisionPlugin = new GitRevisionPlugin();
// eslint-disable-next-line no-unused-vars
const colors = require("colors");
const CONFIG = require("./config/vue/config");
const path = require("path");
// console.log(
//   `Now branch：${JSON.stringify(gitRevisionPlugin.branch())}`.bgGreen.black
// );
console.log(`Working environment：${CONFIG.workspace.current}`.cyan);
// console.log(
//   `Previous commit version：${JSON.stringify(gitRevisionPlugin.version())}`.cyan
// );
// console.log(
//   `Previous commit hash：${JSON.stringify(gitRevisionPlugin.commithash())}`.cyan
// );
console.log(`NODE_ENV：${process.env.NODE_ENV}`.cyan);
console.log(`VUE_APP_ENV：${process.env.VUE_APP_ENV}`.cyan);
console.log(`Start compiling ...`.yellow);
console.log(`\n`);

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set("@$", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("layouts", resolve("src/layouts"));
  },
  devServer: {
    host: "local.admin.reviews.104-dev.com.tw",
    proxy: {
      "^/api/admin": {
        target: `https:${process.env.VUE_APP_API_DOMAIN_URL}`,
        changeOrigin: true
      }
    },
    overlay: {
      warnings: false
    },
    port: CONFIG.port
  }
};
