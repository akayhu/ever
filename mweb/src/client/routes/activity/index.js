"use strict";

import ActivityFieldValidation from '../../validations/ActivityFieldValidation';
import passToErrorPage from '../../utils/passToErrorPage';

export const main = {
	path: '/m/activity/:aid',
	getComponent(nextState, cb) {
		var activityFieldValidation = new ActivityFieldValidation();
    activityFieldValidation.setValidTarget(nextState.params);
    activityFieldValidation.test();
    
    if(activityFieldValidation.result){
			require.ensure([], (require) => {
				cb(null, require('src/client/containers/mActivity/index').default);
			}, 'activity');
		}else{
      return passToErrorPage({
        errorCode: 404,
        errorStatus: 'activity'
      }, nextState, cb);
    }
	},
};
export const comment = {
	path: '/m/activity/:aid/comment/:commentid',
	getComponent(nextState, cb) {
		var activityFieldValidation = new ActivityFieldValidation();
    activityFieldValidation.setValidTarget(nextState.params);
    activityFieldValidation.test();
    
    if(activityFieldValidation.result){
			require.ensure([], (require) => {
				cb(null, require('src/client/containers/mActivity/index').default);
			}, 'activity');
		}else{
      return passToErrorPage({
        errorCode: 404,
        errorStatus: 'activity'
      }, nextState, cb);
    }
	},
};
