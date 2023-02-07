"use strict";

export default {
  path: '/channel/:cid/member',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/component_channel/channel/channelMember').default )
    }, "channelMember");
  }
}

export const admin = {
  path: '/channel/:cid/member/admin',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/component_channel/channel/channelMember').default )
    }, "channelMemberAdmin");
  }
}