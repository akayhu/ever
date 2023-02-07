"use strict";

export const beagiverStory = {
	path: '/m/104beagiver/story',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			cb(null, require('src/client/containers/mBeagiver/story').default);
		}, 'beagiverStory');
	}
};

export default beagiverStory;
