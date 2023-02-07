"use strict";

export default {
  path: '/search/:keyword',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/search/searchActivityList/index').default );
    }, "searchOnlyKeyword");
  }
}
