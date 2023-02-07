"use strict";

export const main = {
  path: '/m/error/:errorCode',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/mError/index').default )
    }, "error");
  }
};

export const mainDetail = {
  path: '/m/error/:errorCode/:errorStatus',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/mError/index').default )
    }, "error");
  }
};

