"use strict";

export const main = {
  path: '/m/topic/:keyword',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/mTopic/index').default )
    }, "topic");
  }
};