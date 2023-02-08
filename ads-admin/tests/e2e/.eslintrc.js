module.exports = {
  plugins: ["cypress", "cypress-real-events"],
  env: {
    mocha: true,
    "cypress/globals": true
  },
  rules: {
    strict: "off"
  }
};
