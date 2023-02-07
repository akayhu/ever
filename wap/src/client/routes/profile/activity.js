"use strict";

export default {
  path: '/profile/:pid/activity',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/component_activities/personalList').default )
    }, "personalActivityList");
  }
}