"use strict";

export const cc = {
  path: '/message/cc',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/message/cc/index').default )
    }, "messageCC");
  }
};

export const bc = {
  path: '/message/bc',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/message/bc/index').default )
    }, "messageBC");
  }
};