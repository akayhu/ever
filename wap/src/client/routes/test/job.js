"use strict";

export default {
  path: '/test/job',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/test/job').default )
    }, "testJob");
  }
}