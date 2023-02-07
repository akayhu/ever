"use strict";

import GroupFieldValidation from '../../validations/GroupFieldValidation';
import passToErrorPage from '../../utils/passToErrorPage';

export const list = {
  path: '/m/group',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/mGroupList/index').default );
    }, "groupList");
  }
};

export const myGroup = {
	path: '/m/myGroup',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('src/client/containers/mMyGroups/index').default );
    }, "myGroupList");
  }
};

export const main = {
  path: '/m/group/:gid',
  getComponent(nextState, cb) {
    var groupFieldValidation = new GroupFieldValidation();
    groupFieldValidation.setValidTarget(nextState.params);
    groupFieldValidation.test();
    
    if(groupFieldValidation.result){
      require.ensure([], (require) => {
        cb(null, require('src/client/containers/mGroup/index').default );
      }, "group");
    }else{
      return passToErrorPage({
        errorCode: 404,
        errorStatus: 'group'
      }, nextState, cb);
    }
  }
};

