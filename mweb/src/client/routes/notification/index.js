"use strict";

export const main = {
  path: '/m/notification',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/mNotification/index').default )
    }, "notification");
  }
};