"use strict";

export default {
  path: '/search',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/search/index').default );
    }, "searchMain");
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./person').default,
        require('./group').default,
        require('./channel').default,
        require('./activity').default,
        require('./onlyKeyword').default
      ]);
    }, "searchMainSub");
  }
};