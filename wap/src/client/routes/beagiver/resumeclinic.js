"use strict";

export default {
	path: '/104beagiver/resumeclinic',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			cb(null, require('src/client/containers/beagiver/resumeclinic').default);
		}, '104beagiverResumeclinic');
	}
};
