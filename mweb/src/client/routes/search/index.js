"use strict";

export const main = {
  path: '/m/search',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/mSearch/index').default );
    }, "search");
  }
};

export const activity = {
  path: '/m/search/activity/:keyword',
  getComponent(nextState, cb) {
  	nextState.params.mode = 'activity';
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/mSearch/index').default );
    }, "search");
  }
};

export const profile = {
  path: '/m/search/person/:keyword',
  getComponent(nextState, cb) {
  	nextState.params.mode = 'person';
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/mSearch/index').default );
    }, "search");
  }
};