const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "3mrmdg",
  viewportWidth: 1366,
  viewportHeight: 768,
  fixturesFolder: "tests/e2e/fixtures",
  screenshotsFolder: "tests/e2e/screenshots",
  // video: false,
  videosFolder: "tests/e2e/videos",
  chromeWebSecurity: false,
  e2e: {
    baseUrl: "https://localhost:8787/",
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./tests/e2e/plugins/index.js")(on, config);
    },
    experimentalSessionAndOrigin: true,
    specPattern: "tests/e2e/specs/*.cy.js",
    supportFile: "tests/e2e/support/index.js"
  },
  component: {
    devServer: {
      framework: "vue-cli",
      bundler: "webpack"
    }
  }
});
