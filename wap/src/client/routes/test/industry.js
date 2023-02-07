"use strict";

export default {
  path: '/test/industry',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/test/industry').default )
    }, "testIndustry");
  }
}