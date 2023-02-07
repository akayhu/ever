"use strict";

export default {
	path: '/104beagiver/story',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			cb(null, require('src/client/containers/beagiver/story').default);
		}, '104beagiverStory');
	}
};
