"use strict";

export const disConnect = {
  path: '/mts/disConnect/:targetPid/:ts/:config',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/index/done').default )
    }, "mtsDisConnect")
  }
};