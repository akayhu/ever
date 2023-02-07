// const CopyWebpackPlugin = require("copy-webpack-plugin");
// const PrerenderSPAPlugin = require("prerender-spa-plugin");
// const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;
const GitRevisionPlugin = require("git-revision-webpack-plugin");
//const gitRevisionPlugin = new GitRevisionPlugin(); //必須隱藏否則 code pipeline 會錯
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
console.log(`NODE_ENV：${CONFIG.env.nodeEnv}`.cyan);
console.log(`VUE_APP_ENV：${CONFIG.env.current}`.cyan);
console.log(`Start compiling ...`.yellow);
console.log(`\n`);

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  filenameHashing: false,
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias
      .set("@$", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("layout", resolve("src/layout"))
      .set("base", resolve("src/base"))
      .set("static", resolve("src/static"))
      .set("scss", resolve("src/scss"));
  },
  css: {
    loaderOptions: {
      scss: {
        data: `@import "scss/_init.scss";`
      }
    }
  },
  // 調整 chunk-vendors.js 與 app.js 命名
  // configureWebpack: {
  //   output: {
  //     filename: "[name].js",
  //     chunkFilename: "[name].js"
  //   }
  // },
  // configureWebpack: config => {
  //   if (CONFIG.env.nodeEnv !== "production") return;
  //   const prerenderSPAPlugin = [
  //     new PrerenderSPAPlugin({
  //       // 生成文件的路徑，也可以與 webpakc 打包的一致。
  //       // 下面這句話非常重要！！！
  //       // 這個目錄只能有一級，如果目錄層次大於一級，在生成的時候不會有任何錯誤提示，在預渲染的時候只會卡著不動。
  //       staticDir: path.join(__dirname, "dist"),
  //       // outputDir: path.join(__dirname, "dist/prerenderHtml"),
  //       indexPath: path.join(__dirname, "dist", "index.html"),
  //       postProcess(renderedRoute) {
  //         // 針對 / 將 route 改為 /landing
  //         if (renderedRoute.originalRoute === "/") {
  //           renderedRoute.route = "/landing";
  //         }
  //         // 輸出路徑一律改為 dist/[route].html
  //         renderedRoute.outputPath = path.join(
  //           __dirname,
  //           "dist",
  //           `${renderedRoute.route}.html`
  //         );
  //         return renderedRoute;
  //       },
  //       // 對應自己的路由文件，某些 a 有參數，就需要寫成 /a/param1。
  //       routes: ["/", "/reviews", "/votes"],
  //       minify: {
  //         collapseBooleanAttributes: true,
  //         collapseWhitespace: true,
  //         decodeEntities: true,
  //         keepClosingSlash: true,
  //         sortAttributes: true
  //       },
  //       // 這個很重要，如果沒有配置這段，也不會進行預編譯
  //       renderer: new Renderer({
  //         // window.injectProperty
  //         inject: {
  //           // foo: "bar"
  //           prerender: true
  //         },
  //         // 可選-等待渲染，直到使用`document.querySelector`檢測到指定的元素為止
  //         // renderAfterElementExists: "#app",
  //         // 觸發渲染的時間，用於獲取數據後再保存渲染結果
  //         renderAfterTime: 5000,
  //         // 渲染時顯示瀏覽器窗口。 對於調試很有用。
  //         headless: true,
  //         ignoreHTTPSErrors: true,
  //         // 在 main.js 中 document.dispatchEven(new Event('render-event'))，其中的事件名稱要對應上。
  //         renderAfterDocumentEvent: "render-event"
  //       })
  //     })
  //   ];

  //   config.plugins = [...config.plugins, ...prerenderSPAPlugin];
  // },
  devServer: {
    host: "local.reviews.104-dev.com.tw",
    proxy: {
      "^/api": {
        target: `https:${CONFIG.env.apiDomailUrl}`,
        changeOrigin: true
      }
    },
    https: true,
    overlay: {
      warnings: false
    },
    port: CONFIG.port
  }
};
