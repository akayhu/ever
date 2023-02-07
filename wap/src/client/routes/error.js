"use strict";

export const errorCode = {
  path: '/error/:errorCode',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/error/index').default )
    }, "errorCode");
  }
};

export const errorStatus = {
  path: '/error/:errorCode/:error_status',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/error/index').default )
    },"errorCodeStatus");
  }
};