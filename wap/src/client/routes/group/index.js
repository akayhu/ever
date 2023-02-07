"use strict";

export const main = {
  path: '/group',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/group/groupList').default )
    }, "groupList");
  }
};

export const applyform = {
  path: '/group/applyform',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/group/groupApplyform').default )
    }, "groupApplyform");
  }
};

export const content = {
  path: '/group/:gid',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/group/groupMain').default )
    }, "groupMain");
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./member').default,
        require('./member').admin,
        require('./management').default
      ]);
    }, "groupMainSub");
  }
};

