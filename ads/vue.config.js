const path = require("path");
const args = require("minimist")(process.argv.slice(2));
const workspace = args.workspace || "dev";

console.log(`Working environment：${workspace}`);
console.log(`NODE_ENV：${process.env.NODE_ENV}`);
console.log(`VUE_APP_ENV：${process.env.VUE_APP_ENV}`);
console.log(`Start compiling ...`);
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
      .set("scss", resolve("src/scss"))
      .set("router", resolve("src/router"));
    config.entry.app = ["babel-polyfill", "./src/main.js"];
    config.plugins.delete("prefetch");
  },
  configureWebpack: config => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto"
    });
  },
  css: {
    // test ie css inline 有沒有上限的問題
    // extract: workspace.extractCss,
    // sourceMap: config.env.current === config.env.dev || config.env.current === config.env.lab,
    loaderOptions: {
      sass: {
        prependData: `$VUE_APP_STATIC_URL: '${process.env.VUE_APP_STATIC_URL}'; @import "~scss/component/variables";
        @import "~scss/mixin/mixin";`
      }
    }
  },
  devServer: {
    host: "local.pioneer.adsmart.104-dev.com.tw",
    proxy: {
      "^/api": {
        target: `https:${process.env.VUE_APP_API_DOMAIN_URL}`,
        changeOrigin: true
      },
      "^/snapshot": {
        target: `https:${process.env.VUE_APP_PROOF_DOMAIN_URL}`,
        changeOrigin: true
      }
    },
    https: true,
    overlay: {
      warnings: false
    },
    port: 8780
  }
};
