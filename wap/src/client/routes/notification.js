"use strict";

export default {
  path: '/notification',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/notification/index').default )
    }, "notification");
  }
};