"use strict";

export const mailConnection = {
  path: 'mail/connection/:action',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/mail/index').default )
    }, "mailConnection");
  }
};