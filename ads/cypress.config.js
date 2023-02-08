const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1366,
  viewportHeight: 768,
  fixturesFolder: "tests/e2e/fixtures",
  screenshotsFolder: "tests/e2e/screenshots",
  videosFolder: "tests/e2e/videos",
  e2e: {
    // setupNodeEvents(on, config) {
    //   return require("./tests/e2e/plugins/index.js")(on, config);
    // },
    baseUrl: "https://localhost:8780",
    experimentalSessionAndOrigin: true,
    specPattern: "tests/e2e/specs/*.{cy,spec}.{js,jsx,ts,tsx}",
    supportFile: "tests/e2e/support/index.js"
  }
});
