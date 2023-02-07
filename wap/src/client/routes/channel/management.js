"use strict";

export default {
  path: '/channel/:cid/management',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/component_channel/channel/channelManagement').default )
    }, "channelManagement");
  }
}