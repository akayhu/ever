"use strict";

export const beagiverLive = {
	path: '/m/104beagiver/live',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			cb(null, require('src/client/containers/mBeagiver/live').default);
		}, 'beagiverLive');
	}
};

export default beagiverLive;
