"use strict";

export default {
  path: '/initial',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/initial/index').default )
    }, "initial")
  }
};