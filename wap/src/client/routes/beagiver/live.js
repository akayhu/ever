"use strict";

export default {
	path: '/104beagiver/live',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			cb(null, require('src/client/containers/beagiver/live').default);
		}, '104beagiverLive');
	}
};
