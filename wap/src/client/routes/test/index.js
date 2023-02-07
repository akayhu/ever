"use strict";

export default {
  path: '/test',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/test/index').default )
    }, "testMain");
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./job').default,
        require('./org').default,
        require('./industry').default
      ]);
    }, "testMainSub");
  }
};

