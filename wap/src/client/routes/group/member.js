"use strict";

export default {
  path: '/group/:gid/member',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/component_group/group/groupMember').default )
    }, "groupMember");
  }
}

export const admin = {
  path: '/group/:gid/member/admin',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/component_group/group/groupMember').default )
    }, "groupMemberAdmin");
  }
}