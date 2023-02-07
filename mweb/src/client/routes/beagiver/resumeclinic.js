"use strict";

export const beagiverResumeclinic = {
	path: '/m/104beagiver/resumeclinic',
	getComponent(nextState, cb) {
		require.ensure([], (require) => {
			cb(null, require('src/client/containers/mBeagiver/resumeclinic').default);
		}, 'beagiverResumeclinic');
	}
};

export default beagiverResumeclinic;
