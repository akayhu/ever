"use strict";

export default {
  path: '/profile/:pid/connection',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/component_connection/index').default )
    }, "connection");
  }
}