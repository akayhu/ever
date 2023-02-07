"use strict";

export default {
  path: '/activity/:aid',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/activity/singlePage').default )
    }, "activity");
  }
};