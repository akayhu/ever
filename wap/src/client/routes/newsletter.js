"use strict";

export default {
  path: '/newsletter',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/newsletter/index').default )
    }, "newsletter");
  }
};
