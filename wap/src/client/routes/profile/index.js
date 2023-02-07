"use strict";

export default {
  path: '/profile',
  onEnter: (nextState, replace) => {
    if(!nextState.params.pid || !/^\d+$/.test(nextState.params.pid)) replace('/error/404');
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/profile/index').default )
    }, "profileIndex");
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./main').default,
        require('./activity').default,
        require('./connection').default
      ]);
    }, "profileMainSub");
  }
};