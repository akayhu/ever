"use strict";

export default {
  path: '/privacy',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/index/index').default)
      // cb(null, require('src/client/containers/privacy/index').default )
    }, "privacy");
  }
};