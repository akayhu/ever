"use strict";

const beagiver = {
  path: '/m/104beagiver',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/mBeagiver/index').default )
    }, "beagiverMain");
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./story').default,
        require('./live').default,
        require('./resumeclinic').default
      ]);
    }, "beagiverMainSub");
  }
};

export default beagiver;
