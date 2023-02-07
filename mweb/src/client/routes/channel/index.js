"use strict";

import ChannelFieldValidation from '../../validations/ChannelFieldValidation';
import passToErrorPage from '../../utils/passToErrorPage';

export const main = {
  path: '/m/channel/:cid',
  getComponent(nextState, cb) {
    var channelFieldValidation = new ChannelFieldValidation();
    channelFieldValidation.setValidTarget(nextState.params);
    channelFieldValidation.test();
    
    if(channelFieldValidation.result){
	    require.ensure([], (require) => {
	      cb(null, require('src/client/containers/mChannel/index').default )
	    }, "channel");
	  }else{
      return passToErrorPage({
        errorCode: 404,
        errorStatus: 'channel'
      }, nextState, cb);
    }
  }
};

