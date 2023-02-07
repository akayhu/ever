"use strict";

export const main = {
  path: '/channel',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/channel/channelList').default )
    }, "channelList");
  }
};

export const content = {
  path: '/channel/:cid',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/channel/channelMain').default )
    }, "channelMain");
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./member').default,
        require('./member').admin,
        require('./management').default
      ]);
    }, "channelMainSub");
  }
};

