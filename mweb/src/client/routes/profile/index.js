"use strict";

import ProfileFieldValidation from '../../validations/ProfileFieldValidation';
import passToErrorPage from '../../utils/passToErrorPage';

export const main = {
  path: '/m/profile/:pid',
  getComponent(nextState, cb) {
    var profileFieldValidation = new ProfileFieldValidation();
    profileFieldValidation.setValidTarget(nextState.params);
    profileFieldValidation.test();
    
    if(profileFieldValidation.result){
      require.ensure([], (require) => {
        cb(null, require('src/client/containers/mProfile/index').default )
      }, "profile");
    }else{
      return passToErrorPage({
        errorCode: 404,
        errorStatus: 'member'
      }, nextState, cb);
    }
  }
};

export const myCollect = {
  path: '/m/myCollect',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/mMyCollect/index').default )
    }, "myCollect");
  }
};