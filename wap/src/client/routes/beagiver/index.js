"use strict";

export default {
  path: '/104beagiver',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/beagiver/index').default )
    }, "104beagiverMain");
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./story').default,
        require('./live').default,
        require('./resumeclinic').default
      ]);
    }, "104beagiverMainSub");
  }
};
