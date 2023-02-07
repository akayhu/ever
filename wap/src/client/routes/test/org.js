"use strict";

export default {
  path: '/test/org',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/test/organization').default )
    }, "testOrganization");
  }
}