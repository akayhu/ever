"use strict";

export default {
  path: '/group/:gid/management',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/component_group/group/groupManagement').default )
    }, "groupManagement");
  }
}