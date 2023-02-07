"use strict";

export default {
  path: '/profile/:pid',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/profile/main').default )
    }, "profileContent");
  }
}