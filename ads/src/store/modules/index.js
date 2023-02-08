const requireStoreModule = require.context(".", true, /\.js$/);
const storeModules = {};

requireStoreModule.keys().forEach(filename => {
  const moduleName = filename
    .replace(/(\.\/|\.js)/g, "")
    .replace(/^\w/, c => c);

  storeModules[moduleName] =
    requireStoreModule(filename).default || requireStoreModule(filename);
});

export default storeModules;
